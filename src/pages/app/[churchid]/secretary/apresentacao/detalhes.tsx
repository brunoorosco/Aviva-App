'use client';

import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useHttpGet } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Loader2, ArrowLeft, Calendar, User, Printer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TApresentacao } from '@/domain/models/apresentacao';
import { Badge } from '@/components/ui/badge';

export default function DetalhesApresentacao() {
    const { data: session } = useSession();
    const router = useRouter();
    const churchId = session?.user?.churchId;

    const { date } = router.query;

    const { data: apresentacoesResponse, isLoading } = useHttpGet<TApresentacao[]>(
        churchId ? `/api/protected/churches/${churchId}/secretary/apresentacao` : null
    );

    const filteredList = (apresentacoesResponse?.data || []).filter(item => {
        if (!date) return false;
        const itemDate = item.dataApresentacao.split('T')[0];
        return itemDate === date;
    }).sort((a, b) => {
        if (a.horario === b.horario) return 0;
        return a.horario === 'manha' ? -1 : 1;
    });

    // Organize data for print: group by time block and sort by type
    const printData = useMemo(() => {
        const typeOrder = { novoMembro: 1, crianca: 2, alianca: 3 };

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

    const handlePrint = () => {
        window.print();
    };

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
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    .print-header { 
                        margin-bottom: 2rem;
                        border-bottom: 2px solid #000;
                        padding-bottom: 1rem;
                    }
                    .print-block {
                        margin-bottom: 2rem;
                        page-break-inside: avoid;
                    }
                    .print-section-title {
                        font-size: 1.25rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                        border-bottom: 1px solid #666;
                        padding-bottom: 0.5rem;
                    }
                    .print-type-group {
                        margin-bottom: 1.5rem;
                    }
                    .print-type-title {
                        font-size: 1rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                        text-transform: uppercase;
                    }
                    .print-item {
                        padding: 0.5rem 0;
                        border-bottom: 1px dashed #ccc;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            {/* Print-only content */}
            <div className="print-only p-8">
                <div className="print-header">
                    <h1 className="text-2xl font-bold">APRESENTAÇÕES</h1>
                    <p className="text-lg">{dateFormatted}</p>
                    <p className="text-sm text-gray-600">Igreja</p>
                </div>

                {/* Morning Block */}
                {printData.manha.length > 0 && (
                    <div className="print-block">
                        <h2 className="print-section-title">MANHÃ</h2>

                        {/* New Members */}
                        {printData.manha.filter(i => i.tipo === 'novoMembro').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Novos Membros</h3>
                                {printData.manha.filter(i => i.tipo === 'novoMembro').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nome} - {item.rede}
                                        {item.igreja_anterior && ` (De: ${item.igreja_anterior})`}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Children */}
                        {printData.manha.filter(i => i.tipo === 'crianca').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Crianças</h3>
                                {printData.manha.filter(i => i.tipo === 'crianca').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nomeCrianca} (Pais: {item.nomePai} & {item.nomeMae}) - {item.rede}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Covenants */}
                        {printData.manha.filter(i => i.tipo === 'alianca').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Alianças</h3>
                                {printData.manha.filter(i => i.tipo === 'alianca').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nomeHomem} & {item.nomeMulher} - {item.rede}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Night Block */}
                {printData.noite.length > 0 && (
                    <div className="print-block">
                        <h2 className="print-section-title">NOITE</h2>

                        {/* New Members */}
                        {printData.noite.filter(i => i.tipo === 'novoMembro').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Novos Membros</h3>
                                {printData.noite.filter(i => i.tipo === 'novoMembro').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nome} - {item.rede}
                                        {item.igreja_anterior && ` (De: ${item.igreja_anterior})`}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Children */}
                        {printData.noite.filter(i => i.tipo === 'crianca').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Crianças</h3>
                                {printData.noite.filter(i => i.tipo === 'crianca').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nomeCrianca} (Pais: {item.nomePai} & {item.nomeMae}) - {item.rede}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Covenants */}
                        {printData.noite.filter(i => i.tipo === 'alianca').length > 0 && (
                            <div className="print-type-group">
                                <h3 className="print-type-title">Alianças</h3>
                                {printData.noite.filter(i => i.tipo === 'alianca').map((item, idx) => (
                                    <div key={idx} className="print-item">
                                        • {item.nomeHomem} & {item.nomeMulher} - {item.rede}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Screen view */}
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 no-print">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={`/app/${churchId}/secretary/apresentacao`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 capitalize">
                                Apresentação
                            </h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {dateFormatted}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </Button>
                        <Link href={`/app/${churchId}/secretary/apresentacao/novo?date=${date}`}>
                            <Button>
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
                            <Card key={item._id} className="hover:bg-slate-50 transition-colors">
                                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="uppercase text-xs font-bold text-slate-600 bg-slate-100">
                                                {item.tipo === 'novoMembro' ? 'Novo Membro' : item.tipo}
                                            </Badge>
                                            <span className="text-sm text-slate-400">|</span>
                                            <span className="text-sm text-slate-500 font-medium">{item.rede || 'nome da rede'}</span>
                                            <span className="text-sm text-slate-400">|</span>
                                            <span className="text-sm text-slate-500 font-medium">{item.horario}</span>
                                        </div>

                                        <div className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {item.tipo === 'alianca' && `${item.nomeHomem} & ${item.nomeMulher}`}
                                            {item.tipo === 'novoMembro' && item.nome}
                                            {item.tipo === 'crianca' && item.nomeCrianca}
                                        </div>

                                        {item.tipo === 'crianca' && (
                                            <div className="text-sm text-slate-500 pl-6">
                                                Pais: {item.nomePai} & {item.nomeMae}
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/app/${churchId}/secretary/apresentacao/${item._id}`}>
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
