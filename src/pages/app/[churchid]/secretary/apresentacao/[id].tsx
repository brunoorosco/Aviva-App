'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useHttpGet, useHttpPut } from '@/hooks/api';
import Toast from '@/components/Toast';
import { CellsModel } from '@/domain/models/cells';
import { TApresentacao } from '@/domain/models/apresentacao';
import { SelectCem } from '@/components/Select/SelectCem';

type FormValues = {
    tipo: 'alianca' | 'novoMembro' | 'crianca';
    dataApresentacao: string;
    horario: 'manha' | 'noite';
    rede: { _id: string; name: string } | string;
    nomeHomem?: string;
    nomeMulher?: string;
    nome?: string;
    igreja_anterior?: string;
    nomeCrianca?: string;
    nomePai?: string;
    nomeMae?: string;
}

export default function EditarApresentacao() {
    const { data: session } = useSession();
    const router = useRouter();
    // @ts-ignore
    const churchId = session?.user?.churchId;
    // @ts-ignore
    const userRole = session?.user?.role;
    // @ts-ignore
    const userCem = session?.user?.cem

    const { id } = router.query;
    const [isSaving, setIsSaving] = useState(false);

    // Fetch existing data
    const { data: initialData, isLoading: isLoadingData } = useHttpGet<TApresentacao>(
        (churchId && id) ? `/api/protected/churches/${churchId}/secretary/apresentacao/${id}` : null
    );

    // Fetch redes if admin
    const { data: redesData } = useHttpGet<CellsModel[]>(
        (userRole === 'admin' && churchId) ? `/api/protected/churches/${churchId}/redes` : null
    );

    const { control, handleSubmit, watch, register, reset, setValue } = useForm<FormValues>();

    const tipo = watch('tipo');
    const isAdmin = userRole === 'admin';

    // Populate form when data loads
    useEffect(() => {
        if (initialData?.data) {
            const data: any = initialData.data;
            const storedRede = data.rede as FormValues['rede'] | undefined;
            let rede: FormValues['rede'] = storedRede || '';

            // Não-admin: preserva a rede do registro (só usa a do usuário para
            // corrigir rede legada string que pertence à própria rede dele)
            if (!isAdmin) {
                if (typeof rede === 'string' && rede && userCem?.name && rede === userCem.name) {
                    rede = userCem as FormValues['rede'];
                }
            }

            reset({
                tipo: data.tipo,
                rede,
                horario: data.horario,
                // Ensure date is YYYY-MM-DD for input type="date"
                dataApresentacao: data.dataApresentacao ? data.dataApresentacao.split('T')[0] : '',
                nomeHomem: data.nomeHomem,
                nomeMulher: data.nomeMulher,
                nome: data.nome,
                igreja_anterior: data.igreja_anterior,
                nomeCrianca: data.nomeCrianca,
                nomePai: data.nomePai,
                nomeMae: data.nomeMae
            });
        }
    }, [initialData, reset, isAdmin, userCem]);

    // Resolve rede legada (string sem _id) para objeto assim que as redes carregarem
    useEffect(() => {
        const data = initialData?.data;
        if (!data || !isAdmin) return;
        if (typeof data.rede === 'string' && data.rede) {
            const match = (redesData?.data || []).find((rede: any) => rede.name === data.rede);
            if (match) setValue('rede', { _id: match._id, name: match.name });
        }
    }, [redesData, initialData, isAdmin, setValue]);


    const onSubmit = async (data: FormValues) => {
        if (!churchId || !id) return;
        setIsSaving(true);

        try {
            await useHttpPut({
                url: `/api/protected/churches/${churchId}/secretary/apresentacao/${id}`,
                data
            });
            Toast.showSuccess('Apresentação atualizada com sucesso!');
            router.back();
        } catch (error) {
            console.error(error);
            Toast.showError('Erro ao atualizar apresentação.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex bg-slate-50 h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-black/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-gray-100">Editar Apresentação</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Tipo de Apresentação</Label>
                        <Controller
                            control={control}
                            name="tipo"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                churchId={churchId as string}
                            />
                        ) : (
                            <Controller
                                control={control}
                                name="rede"
                                render={({ field }) => (
                                    <Input
                                        value={typeof field.value === 'object' ? field.value?.name || '' : field.value || ''}
                                        disabled
                                        className="bg-gray-200 dark:bg-zinc-700 dark:text-gray-100"
                                    />
                                )}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Data da Apresentação</Label>
                        <Input type="date" {...register('dataApresentacao')} />
                    </div>

                    <div className="space-y-2">
                        <Label>Horário do Culto</Label>
                        <Controller
                            control={control}
                            name="horario"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
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

                <div className="pt-4 border-t">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-gray-300">Dados Específicos</h2>

                    {tipo === 'alianca' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label>Nome do Homem</Label>
                                <Input {...register('nomeHomem', { required: true })} placeholder="Nome completo" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome da Mulher</Label>
                                <Input {...register('nomeMulher', { required: true })} placeholder="Nome completo" />
                            </div>
                        </div>
                    )}

                    {tipo === 'novoMembro' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Nome do Membro</Label>
                            <Input {...register('nome', { required: true })} placeholder="Nome completo" />
                        </div>
                    )}

                    {tipo === 'crianca' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <Label>Nome da Criança</Label>
                                <Input {...register('nomeCrianca', { required: true })} placeholder="Nome completo da criança" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome do Pai</Label>
                                    <Input {...register('nomePai')} placeholder="Nome do pai" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nome da Mãe</Label>
                                    <Input {...register('nomeMae', { required: true })} placeholder="Nome da mãe" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Salvar Alterações'}
                    </Button>
                </div>

            </form>
        </div>
    );
}
