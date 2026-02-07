'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { SelectCem } from '@/components/Select/SelectCem';
import Link from 'next/link';
import { useHttpPost } from '@/hooks/api';
import Toast from '@/components/Toast';

/* =======================
   TIPOS DO FORMULÁRIO
======================= */

type BaseForm = {
    tipo: 'alianca' | 'novoMembro' | 'crianca';
    rede: string;
    dataApresentacao: string;
    horario: 'manha' | 'noite';
};

type FormAlianca = BaseForm & {
    tipo: 'alianca';
    nomeHomem: string;
    nomeMulher: string;
};

type FormNovoMembro = BaseForm & {
    tipo: 'novoMembro';
    nome: string;
    igreja_anterior: string;
};

type FormCrianca = BaseForm & {
    tipo: 'crianca';
    nomeCrianca: string;
    nomePai: string;
    nomeMae: string;
};

type FormValues = FormAlianca | FormNovoMembro | FormCrianca;

/* =======================
   COMPONENTE
======================= */

export default function NovaApresentacao() {
    const { data: session } = useSession();
    const router = useRouter();
    const { isAdmin } = usePermissions();

    const churchId = session?.user?.churchId || '';
    const userRede = session?.user?.cem?.name || '';

    const queryDate = router.query.date as string | undefined;
    const queryHorario = router.query.horario as 'manha' | 'noite' | undefined;

    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        register,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            tipo: 'alianca',
            rede: !isAdmin ? userRede : '',
            dataApresentacao:
                queryDate || new Date().toISOString().split('T')[0],
            horario: queryHorario || 'manha',
            nomeHomem: '',
            nomeMulher: '',
        },
    });

    const tipo = watch('tipo');

    /* =======================
       EFFECTS
    ======================= */

    useEffect(() => {
        if (!isAdmin && userRede) {
            setValue('rede', userRede);
        }
    }, [isAdmin, userRede, setValue]);

    useEffect(() => {
        if (tipo === 'alianca') {
            setValue('nome', undefined as never);
            setValue('nomeCrianca', undefined as never);
            setValue('nomePai', undefined as never);
            setValue('nomeMae', undefined as never);
            setValue('igreja_anterior', undefined as never);
        }

        if (tipo === 'novoMembro') {
            setValue('nomeHomem', undefined as never);
            setValue('nomeMulher', undefined as never);
            setValue('nomeCrianca', undefined as never);
            setValue('nomePai', undefined as never);
            setValue('nomeMae', undefined as never);
        }

        if (tipo === 'crianca') {
            setValue('nomeHomem', undefined as never);
            setValue('nomeMulher', undefined as never);
            setValue('nome', undefined as never);
            setValue('igreja_anterior', undefined as never);
        }
    }, [tipo, setValue]);

    /* =======================
       SUBMIT
    ======================= */

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            console.log('FORM DATA:', data);

            await useHttpPost({
                url: `/api/protected/churches/${churchId}/secretary/apresentacao`,
                data
            });

            Toast.showSuccess('Apresentação salva com sucesso!');
            router.back();
        } catch (error) {
            console.error(error);
            Toast.showError('Erro ao salvar apresentação');
        } finally {
            setIsLoading(false);
        }
    };

    /* =======================
       RENDER
    ======================= */

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Apresentações</h1>
                    <p className="text-slate-500">Eventos de apresentação agendados</p>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* DADOS GERAIS */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Apresentação</Label>
                        <Controller
                            control={control}
                            name="tipo"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alianca">Aliança</SelectItem>
                                        <SelectItem value="novoMembro">Novo Membro</SelectItem>
                                        <SelectItem value="crianca">Criança</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Rede / CEM</Label>
                        {isAdmin ? (
                            <SelectCem
                                control={control}
                                name="rede"
                                title="Selecione a Rede"
                                churchId={churchId}
                                errors={errors}
                                isRequired
                            />
                        ) : (
                            <Input
                                {...register('rede')}
                                disabled
                                className="bg-slate-100"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Data da Apresentação</Label>
                        <Input
                            type="date"
                            {...register('dataApresentacao', { required: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Horário do Culto</Label>
                        <Controller
                            control={control}
                            name="horario"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o horário" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manha">Manhã</SelectItem>
                                        <SelectItem value="noite">Noite</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                {/* DADOS ESPECÍFICOS */}
                <div className="pt-4 border-t space-y-4">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Dados Específicos
                    </h2>

                    {tipo === 'alianca' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome do Homem</Label>
                                <Input
                                    {...register('nomeHomem', { required: true })}
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Nome da Mulher</Label>
                                <Input
                                    {...register('nomeMulher', { required: true })}
                                    placeholder="Nome completo"
                                />
                            </div>
                        </div>
                    )}

                    {tipo === 'novoMembro' && (
                        <>
                            <div className="space-y-2">
                                <Label>Nome do Membro</Label>
                                <Input
                                    {...register('nome', { required: true })}
                                    placeholder="Nome completo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>De qual denominação o membro veio?</Label>
                                <Input
                                    {...register('igreja_anterior', { required: true })}
                                    placeholder="Assembleia de Deus"
                                />
                            </div>
                        </>
                    )}

                    {tipo === 'crianca' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome da Criança</Label>
                                <Input
                                    {...register('nomeCrianca', { required: true })}
                                    placeholder="Nome completo da criança"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome do Pai</Label>
                                    <Input
                                        {...register('nomePai', { required: true })}
                                        placeholder="Nome do pai"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nome da Mãe</Label>
                                    <Input
                                        {...register('nomeMae', { required: true })}
                                        placeholder="Nome da mãe"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AÇÕES */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Salvar
                    </Button>
                </div>
            </form>
        </div>
    );
}
