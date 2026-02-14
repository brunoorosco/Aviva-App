import { ArrowLeft, BarChart3, Users, CreditCard, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Mock data for demonstration — will be replaced by API integration
const mockGrupos = [
  {
    id: "1",
    nome: "Grupo Alpha",
    celula: "Célula Centro",
    encontristas: 12,
    encontristasIsentos: 2,
    equipe: 5,
    equipeIsentos: 1,
    totalPago: 3500,
    pagamentosPorTipo: { pix: 2000, cartao: 1000, dinheiro: 500 },
  },
  {
    id: "2",
    nome: "Grupo Beta",
    celula: "Célula Norte",
    encontristas: 8,
    encontristasIsentos: 1,
    equipe: 3,
    equipeIsentos: 0,
    totalPago: 1800,
    pagamentosPorTipo: { pix: 1200, dinheiro: 600 },
  },
];

const tipoLabels: Record<string, string> = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" };

export default function FinanceReport() {
  const navigate = useRouter();

  const totalEncontristas = mockGrupos.reduce((s, g) => s + g.encontristas, 0);
  const totalEquipe = mockGrupos.reduce((s, g) => s + g.equipe, 0);
  const totalIsentos = mockGrupos.reduce((s, g) => s + g.encontristasIsentos + g.equipeIsentos, 0);
  const totalPago = mockGrupos.reduce((s, g) => s + g.totalPago, 0);
  const totalParticipantes = totalEncontristas + totalEquipe;

  // Aggregate payment types
  const allTipos = mockGrupos.reduce((acc, g) => {
    Object.entries(g.pagamentosPorTipo).forEach(([tipo, val]) => {
      acc[tipo] = (acc[tipo] || 0) + val;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold font-[Montserrat]">Relatório Financeiro</h1>
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
              <InfoCard label="Grupos" value={String(mockGrupos.length)} />
              <InfoCard label="Encontristas" value={String(totalEncontristas)} />
              <InfoCard label="Equipe" value={String(totalEquipe)} />
              <InfoCard label="Total Participantes" value={String(totalParticipantes)} />
              <InfoCard label="Isentos" value={String(totalIsentos)} />
            </div>

            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valor Total Pago</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalPago)}</p>
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
        <div className="space-y-4">
          {mockGrupos.map((g) => (
            <Card key={g.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{g.nome}</h3>
                    <p className="text-xs text-muted-foreground">{g.celula}</p>
                  </div>
                  <Badge variant="secondary">{formatCurrency(g.totalPago)}</Badge>
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
