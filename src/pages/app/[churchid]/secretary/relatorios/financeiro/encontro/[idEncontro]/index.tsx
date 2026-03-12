import { ArrowLeft, BarChart3, Users, CreditCard, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { useHttpGet } from "@/hooks/api";
import { ComprovantesDropdown } from "@/components/finance/ComprovantesDropdown";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const tipoLabels: Record<string, string> = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" };

export default function FinanceReport() {
  const router = useRouter();
  const { churchid, idEncontro } = router.query;

  // Buscar dados do relatório financeiro da API
  const { data: relatorioData, error, isLoading } = useHttpGet<{
    encontro: {
      _id: string;
      numero: string;
      data: string;
    };
    grupos: Array<{
      id: string;
      nome: string;
      celula: string;
      encontristas: number;
      encontristasIsentos: number;
      equipe: number;
      equipeIsentos: number;
      totalPago: number;
      totalAPagar: number;
      status: string;
      pagamentosPorTipo: Record<string, number>;
      pagamentos?: Array<{
        _id: string;
        tipo: string;
        valor: number;
        data: string;
        comprovanteUrl?: string;
        comprovanteName?: string;
      }>;
    }>;
    totais: {
      totalEncontristas: number;
      totalEquipe: number;
      totalParticipantes: number;
      totalIsentos: number;
      totalPago: number;
      totalAPagar: number;
      pagamentosPorTipoGeral: Record<string, number>;
    };
  }>(
    churchid && idEncontro
      ? `/api/protected/churches/${churchid}/encontroComDeus/${idEncontro}/relatorio-financeiro`
      : null
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando relatório financeiro...</p>
      </div>
    );
  }

  if (error || !relatorioData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar relatório financeiro</p>
      </div>
    );
  }

  const { grupos, totais, encontro } = relatorioData.data;
  const totalParticipantes = totais.totalParticipantes;

  // Pagamentos agregados já vêm da API
  const allTipos = totais.pagamentosPorTipoGeral || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold font-[Montserrat]">Relatório Financeiro - Encontro {encontro.numero}</h1>
            <p className="text-xs text-muted-foreground">Visão geral de todos os grupos</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Resumo Geral */}
        <Card className="border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Resumo Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <InfoCard label="Grupos" value={String(grupos.length)} />
              <InfoCard label="Encontristas" value={String(totais.totalEncontristas)} />
              <InfoCard label="Equipe" value={String(totais.totalEquipe)} />
              <InfoCard label="Total Participantes" value={String(totalParticipantes)} />
              <InfoCard label="Isentos" value={String(totais.totalIsentos)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valor Total Pago</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(totais.totalPago)}</p>
              </div>
              <div className="rounded-xl border-2 border-orange-500/30 bg-orange-500/5 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total a Pagar</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(totais.totalAPagar)}</p>
              </div>
            </div>

            {/* Formas de pagamento globais */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Formas de Pagamento (Geral)</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(allTipos).map(([tipo, val]) => (
                  <div key={tipo} className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tipoLabels[tipo] || tipo}</p>
                    <p className="text-sm font-semibold mt-0.5">{formatCurrency(val)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhamento por grupo */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Detalhamento por Grupo</h2>
        {grupos.length === 0 ? (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum grupo cadastrado ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {grupos.map((g) => (
              <Card key={g.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{g.nome}</h3>
                      <p className="text-xs text-muted-foreground">{g.celula}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ComprovantesDropdown pagamentos={g.pagamentos} />
                      <Badge variant="secondary">{formatCurrency(g.totalPago)}</Badge>
                      <Badge variant={g.status === 'quitado' ? 'default' : g.status === 'pendente' ? 'destructive' : 'outline'}>
                        {g.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Encontristas</p>
                      <p className="text-sm font-semibold">{g.encontristas} <span className="text-xs text-muted-foreground">({g.encontristasIsentos} isentos)</span></p>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Equipe</p>
                      <p className="text-sm font-semibold">{g.equipe} <span className="text-xs text-muted-foreground">({g.equipeIsentos} isentos)</span></p>
                    </div>
                    {Object.entries(g.pagamentosPorTipo).map(([tipo, val]) => (
                      <div key={tipo} className="rounded-lg border border-border/50 bg-secondary/20 p-2 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase">{tipoLabels[tipo] || tipo}</p>
                        <p className="text-sm font-semibold">{formatCurrency(val)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
