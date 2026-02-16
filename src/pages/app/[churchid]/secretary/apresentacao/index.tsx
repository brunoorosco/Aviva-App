'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useHttpGet } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Loader2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TApresentacao } from '@/domain/models/apresentacao';

export default function ListaApresentacao() {
  const { data: session } = useSession();
  const churchId = session?.user?.churchId;

  const { data: apresentacoesResponse, isLoading } = useHttpGet<TApresentacao[]>(
    churchId ? `/api/protected/churches/${churchId}/secretary/apresentacao` : null
  );

  // Group by Date + Horario
  const groupedEvents = React.useMemo(() => {
    const list = apresentacoesResponse?.data || [];
    const groups: Record<string, { date: string, items: TApresentacao[] }> = {};

    list.forEach(item => {
      // Parse date string directly to avoid timezone issues
      const dateKey = item.dataApresentacao.split('T')[0];
      const key = `${dateKey}`;

      if (!groups[key]) {
        groups[key] = {
          date: dateKey,
          items: []
        };
      }
      groups[key].items.push(item);
    });

    // Convert to array and sort by date descending
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [apresentacoesResponse]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background   p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Apresentações</h1>
          <p className="text-slate-500 dark:text-gray-300">Eventos de apresentação agendados</p>
        </div>
        <Link href={`/app/${churchId}/secretary/apresentacao/novo`}>
          <Button className='bg-blue-500 dark:bg-orange-500'>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {groupedEvents.length === 0 ? (
          <div className="text-center p-8 text-slate-500 bg-white dark:bg-dark-secondary rounded-lg border border-dashed">
            Nenhum evento cadastrado.
          </div>
        ) : (
          groupedEvents.map((group) => {
            const aliancas = group.items.filter(i => i.tipo === 'alianca').length;
            const membros = group.items.filter(i => i.tipo === 'novoMembro').length;
            const criancas = group.items.filter(i => i.tipo === 'crianca').length;

            return (
              <Card key={`${group.date}`} className="hover:border-blue-300 transition-colors cursor-pointer group">
                <Link href={`/app/${churchId}/secretary/apresentacao/detalhes?date=${group.date}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 dark:bg-dark-secondary">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-orange-500 rounded-lg border shadow-sm text-center min-w-[50px]">
                        <span className="block text-xs uppercase text-slate-400 dark:text-white font-bold">
                          {new Date(group.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
                        </span>
                        <span className="block text-xl font-bold text-slate-800 dark:text-gray-100">
                          {new Date(group.date + 'T12:00:00').getDate()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 dark:text-gray-100">
                          {new Date(group.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-blue-600 group-hover:bg-blue-50 dark:text-orange-500 dark:group-hover:bg-orange-50">
                      Gerenciar
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-orange-500 rounded-md w-24">
                        <span className="font-bold text-lg text-slate-700 dark:text-gray-50">{group.items.length}</span>
                        <span className="text-xs text-slate-500 dark:text-gray-100">Total</span>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="flex flex-col justify-center px-3 border-l">
                          <span className="text-xs text-slate-400 uppercase">Alianças</span>
                          <span className="font-semibold text-slate-700 dark:text-gray-100">{aliancas}</span>
                        </div>
                        <div className="flex flex-col justify-center px-3 border-l">
                          <span className="text-xs text-slate-400 uppercase">Novos</span>
                          <span className="font-semibold text-slate-700 dark:text-gray-100">{membros}</span>
                        </div>
                        <div className="flex flex-col justify-center px-3 border-l">
                          <span className="text-xs text-slate-400 uppercase">Crianças</span>
                          <span className="font-semibold text-slate-700 dark:text-gray-100">{criancas}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
