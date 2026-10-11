'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useHttpGet, useHttpDelete } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Calendar, User, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getRedeName } from '@/utils/helpersNameREde';
import { TApresentacao } from '@/domain/models/apresentacao';
import { Badge } from '@/components/ui/badge';
import Toast from '@/components/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useReactToPrint } from 'react-to-print';
import { useCultoSettings } from '@/hooks/useCultoSettings';
import { isSunday } from '@/utils/date';

const typeOrder: Record<TApresentacao['tipo'], number> = {
    alianca: 1,
    novoMembro: 2,
    crianca: 3
};

export default function DetalhesApresentacao() {
    const { data: session } = useSession();
    const router = useRouter();
    const churchId = session?.user?.churchId;
    const userRole = session?.user?.role;
    const userCemName = session?.user?.cem?.name;
    const printRef = useRef<HTMLDivElement>(null);
    const [selectedToDelete, setSelectedToDelete] = useState<TApresentacao | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { date } = router.query;

    const { cultoDomingo } = useCultoSettings(churchId);
    const isDomingo = isSunday(date as string | undefined);
    const hideHorario = isDomingo && cultoDomingo !== 'manha_e_noite';

    const { data: apresentacoesResponse, isLoading, mutate } = useHttpGet<TApresentacao[]>(
        churchId ? `/api/protected/churches/${churchId}/secretary/apresentacao` : null
    );

    const filteredList = (apresentacoesResponse?.data || []).filter(item => {
        if (!date) return false;
        const itemDate = item.dataApresentacao.split('T')[0];
        return itemDate === date;
    }).sort((a, b) => {
        if (a.horario !== b.horario) return a.horario === 'manha' ? -1 : 1;
        return typeOrder[a.tipo] - typeOrder[b.tipo];
    });

    // Organize data for print: group by time block and sort by type
    const printData = useMemo(() => {
        const sortByType = (items: TApresentacao[]) => {
            return [...items].sort((a, b) => typeOrder[a.tipo] - typeOrder[b.tipo]);
        };

        const manha = filteredList.filter(i => i.horario === 'manha');
        const noite = filteredList.filter(i => i.horario === 'noite');

        return {
            manha: sortByType(manha),
            noite: sortByType(noite)
        };
    }, [filteredList]);

    // Helper to extract clean network name
    const getCleanRedeName = (rede?: string | { _id: string; name: string }) => {
        return getRedeName(rede) || '';
    };

    // Admin pode remover qualquer uma; supervisor/pastor só da própria rede
    const canDeleteItem = (item: TApresentacao) => {
        if (userRole === 'admin') return true;
        if (userRole === 'supervisor' || userRole === 'pastor') {
            return !!userCemName &&
                getCleanRedeName(item.rede).toUpperCase() === userCemName.toUpperCase();
        }
        return false;
    };

    const getItemLabel = (item: TApresentacao) => {
        if (item.tipo === 'novoMembro') return item.nome || '';
        if (item.tipo === 'alianca') return `${item.nomeHomem || ''} & ${item.nomeMulher || ''}`;
        return item.nomeCrianca || '';
    };

    const handleDelete = async () => {
        if (!selectedToDelete) return;
        setIsDeleting(true);

        try {
            const res = await useHttpDelete({
                url: `/api/protected/churches/${churchId}/secretary/apresentacao/${selectedToDelete._id}`
            });
            if (res?.error) throw new Error(res.error);
            Toast.showSuccess('Pessoa removida da apresentação!');
            setSelectedToDelete(null);
            mutate();
        } catch (error) {
            console.error(error);
            Toast.showError('Erro ao remover. Você só pode remover pessoas da sua própria rede.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Apresentacoes_${date}`,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const dateFormatted = date ? new Date(date as string + 'T12:00:00').toLocaleDateString('pt-BR', { dateStyle: 'long' }) : 'Data inválida';

    return (
        <>
            {/* Print-only styles */}
            <style jsx global>{`
                @media screen {
                    .print-content { display: none; }
                }
                @media print {
                    .no-print { display: none !important; }
                    .print-content { display: block !important; }
                    body { background: white !important; }
                    
                    /* Hide all navigation and layout elements */
                    header, nav, aside, footer { display: none !important; }
                    [role="navigation"], [role="banner"], [role="complementary"] { display: none !important; }
                    .sidebar, .navbar, .menu, .nav, .header { display: none !important; }
                }
            `}</style>

            {/* Print content - will be captured by react-to-print */}
            <div ref={printRef} className="print-content">
                <div style={{ padding: '2rem', backgroundColor: 'white' }}>
                    <div style={{ marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem', textAlign: 'center' }}>
                        <img src="/logo-preto.png" alt="Logo" style={{ maxWidth: '100px', maxHeight: '75px', margin: '0 auto 1rem', display: 'block' }} />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>APRESENTAÇÕES</h1>
                        <p style={{ fontSize: '1rem' }}>{dateFormatted}</p>
                    </div>

                    {/* Morning Block */}
                    {printData.manha.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #666', paddingBottom: '0.5rem' }}>MANHÃ</h3>

                            {/* Covenants */}
                            {printData.manha.filter(i => i.tipo === 'alianca').length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Alianças</h4>
                                    {printData.manha.filter(i => i.tipo === 'alianca').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            • {item.nomeHomem} & {item.nomeMulher} - {getCleanRedeName(item.rede)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Members */}
                            {printData.manha.filter(i => i.tipo === 'novoMembro').length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Novos Membros</h4>
                                    {printData.manha.filter(i => i.tipo === 'novoMembro').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            • {item.nome} - {getCleanRedeName(item.rede)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Children */}
                            {printData.manha.filter(i => i.tipo === 'crianca').length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Crianças</h4>
                                    {printData.manha.filter(i => i.tipo === 'crianca').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            • {item.nomeCrianca} (Pais: {item.nomePai} & {item.nomeMae}) - {getCleanRedeName(item.rede)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Night Block */}
                    {printData.noite.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #666', paddingBottom: '0.5rem' }}>NOITE</h3>

                            {/* Covenants */}
                            {printData.noite.filter(i => i.tipo === 'alianca').length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Alianças</h4>
                                    {printData.noite.filter(i => i.tipo === 'alianca').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            • {item.nomeHomem} & {item.nomeMulher} - {getCleanRedeName(item.rede)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Members */}
                            {printData.noite.filter(i => i.tipo === 'novoMembro').length > 0 && (
                                <div style={{ marginBottom: '1.0rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Novos Membros</h4>
                                    {printData.noite.filter(i => i.tipo === 'novoMembro').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            • {item.nome} - {getCleanRedeName(item.rede)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Children */}
                            {printData.noite.filter(i => i.tipo === 'crianca').length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Crianças</h4>
                                    {printData.noite.filter(i => i.tipo === 'crianca').map((item, idx) => (
                                        <div key={idx} style={{ padding: '0.3rem 0', borderBottom: '1px dashed #ccc' }}>
                                            {item.nomePai && item.nomeMae && (
                                                <span>
                                                    • {item.nomeCrianca} (Pais: {item.nomePai} & {item.nomeMae}) - {getCleanRedeName(item.rede)}
                                                </span>
                                            )}
                                            {!item.nomePai && item.nomeMae && (
                                                <span>
                                                    • {item.nomeCrianca} (Mãe: {item.nomeMae}) - {getCleanRedeName(item.rede)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Screen view */}
            < div className="min-h-screen bg-slate-50 dark:bg-dark-secondary p-4 md:p-8 no-print" >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={`/app/${churchId}/secretary/apresentacao`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 capitalize">
                                Apresentação
                            </h1>
                            <p className="text-slate-500 flex items-center gap-2 dark:text-gray-300">
                                <Calendar className="w-4 h-4" />
                                {dateFormatted}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2 " />
                            Imprimir
                        </Button>
                        <Link href={hideHorario ? `/app/${churchId}/secretary/apresentacao/novo?date=${date}&horario=${cultoDomingo}` : `/app/${churchId}/secretary/apresentacao/novo?date=${date}`}>
                            <Button className='bg-blue-500 dark:bg-orange-500'>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Pessoa
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredList.length === 0 ? (
                        <div className="text-center p-8 text-slate-500 bg-white rounded-lg border border-dashed">
                            Nenhuma pessoa encontrada neste evento.
                        </div>
                    ) : (
                        filteredList.map((item) => (
                            <Card key={item._id} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="uppercase text-xs font-bold text-slate-600 bg-slate-100">
                                                {item.tipo === 'novoMembro' ? 'Novo Membro' : item.tipo}
                                            </Badge>
                                            <span className="text-sm text-slate-400 dark:text-gray-100">|</span>
                                            <span className="text-sm text-slate-500 font-medium dark:text-gray-200">{getCleanRedeName(item.rede) || 'nome da rede'}</span>
                                            {!hideHorario && (
                                                <>
                                                    <span className="text-sm text-slate-400 dark:text-gray-100">|</span>
                                                    <span className="text-sm text-slate-500 font-medium dark:text-gray-200">{item.horario}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="font-semibold text-lg text-slate-800 flex items-center gap-2 dark:text-gray-100">
                                            <User className="w-4 h-4 text-slate-400 dark:text-gray-100" />
                                            {item.tipo === 'alianca' && `${item.nomeHomem} & ${item.nomeMulher}`}
                                            {item.tipo === 'novoMembro' && item.nome}
                                            {item.tipo === 'crianca' && item.nomeCrianca}
                                        </div>

                                        {item.tipo === 'crianca' && (
                                            <div className="text-sm text-slate-500 pl-6 dark:text-gray-100">
                                                {item.nomePai && item.nomeMae && (
                                                    <span>
                                                        Pais: {item.nomePai} & {item.nomeMae}
                                                    </span>
                                                )}
                                                {item.nomePai && !item.nomeMae && (
                                                    <span>
                                                        Pai: {item.nomePai}
                                                    </span>
                                                )}
                                                {!item.nomePai && item.nomeMae && (
                                                    <span>
                                                        Mãe: {item.nomeMae}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/app/${churchId}/secretary/apresentacao/${item._id}`}>
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 dark:text-gray-100">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </Link>
                                        {canDeleteItem(item) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedToDelete(item)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remover
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div >

            <ConfirmDialog
                open={!!selectedToDelete}
                onClose={() => setSelectedToDelete(null)}
                onConfirm={handleDelete}
                title="Remover da Apresentação"
                description={selectedToDelete
                    ? `Tem certeza que deseja remover "${getItemLabel(selectedToDelete)}" desta apresentação? Esta ação não pode ser desfeita.`
                    : 'Esta ação não pode ser desfeita.'}
                confirmLabel="Sim, remover"
                cancelLabel="Cancelar"
                isLoading={isDeleting}
            />
        </>
    );
}
