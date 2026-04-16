import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { useHttpGet } from "@/hooks/api";
import {
  RelatorioFinanceiroData,
  RelatorioFinanceiroEncontro,
  RelatorioFinanceiroGrupo,
  RelatorioFinanceiroTotais,
} from "./types";
import { ComprovantesDropdown } from "./ComprovantesDropdown";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const tipoLabels: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

const statusColors: Record<string, string> = {
  quitado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  parcial: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  pendente: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  excedente: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
};

const statusLabels: Record<string, string> = {
  quitado: "Quitado",
  parcial: "Parcial",
  pendente: "Pendente",
  excedente: "Excedente",
};

export default function FinanceReport({ type }: { type: "encontro" | "reencontro" }) {
  const navigate = useRouter();
  const { churchid, id } = navigate.query;
  const urlType = type === "encontro" ? "encontroComDeus" : "reencontroComDeus";

  const {
    data: response,
    isLoading,
    error,
  } = useHttpGet<RelatorioFinanceiroData>(
    churchid && id
      ? `/api/protected/churches/${churchid}/${urlType}/${id}/relatorio-financeiro`
      : null,
  );

  const reportData = response?.data;

  const grupos: RelatorioFinanceiroGrupo[] = reportData?.grupos ?? [];
  const totais: RelatorioFinanceiroTotais = reportData?.totais ?? {
    totalEncontristas: 0,
    totalReencontristas: 0,
    totalEquipe: 0,
    totalParticipantes: 0,
    totalIsentos: 0,
    totalPago: 0,
    totalAPagar: 0,
    pagamentosPorTipoGeral: {},
  };
  const encontro: RelatorioFinanceiroEncontro = reportData?.encontro ?? reportData?.reencontro ?? {
    _id: "",
    numero: "",
    data: "",
  };
  const totalEncontristas = totais.totalEncontristas ?? totais.totalReencontristas ?? 0;
  const totalEquipe = totais.totalEquipe ?? 0;
  const totalIsentos = totais.totalIsentos ?? 0;
  const totalPago = totais.totalPago ?? 0;
  const totalAPagar = totais.totalAPagar ?? 0;
  const totalParticipantes = totais.totalParticipantes ?? 0;

  const pagamentosPorTipoGeral = totais.pagamentosPorTipoGeral ?? {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">Erro ao carregar relatório</p>
          <Button onClick={() => navigate.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-6 sm:mt-0">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold font-[Montserrat]">Relatório Financeiro</h1>
            <p className="text-xs text-muted-foreground">
              {type === "encontro" ? "Encontro" : "Reencontro"} #{encontro.numero} - {new Date(encontro.data).toLocaleDateString("pt-BR")}
            </p>
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
              <InfoCard label="Redes" value={String(grupos.length)} />
              <InfoCard label={type === "encontro" ? "Encontristas" : "Reencontristas"} value={String(totalEncontristas)} />
              <InfoCard label="Equipe" value={String(totalEquipe)} />
              <InfoCard label="Total Participantes" value={String(totalParticipantes)} />
              <InfoCard label="Isentos" value={String(totalIsentos)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Total Pago
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalPago)}
                </p>
              </div>

              <div className="rounded-xl border-2 border-orange-500/30 bg-orange-500/5 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Total a Pagar
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(totalAPagar)}
                </p>
              </div>
            </div>

            {/* Formas de pagamento */}
            {Object.keys(pagamentosPorTipoGeral).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Formas de Pagamento
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(pagamentosPorTipoGeral).map(([tipo, valor]) => (
                    <div
                      key={tipo}
                      className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center"
                    >
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {tipoLabels[tipo] || tipo}
                      </p>
                      <p className="text-lg font-semibold mt-1">
                        {formatCurrency(valor as number)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhamento por Grupo */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Detalhamento por Grupo ({grupos.length})
        </h2>

        {grupos.length === 0 ? (
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum grupo com inscrição ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {grupos.map((g: any) => (
              <Card key={g.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{g.nome}</h3>
                      <p className="text-xs text-muted-foreground">{g.celula}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ComprovantesDropdown pagamentos={g.pagamentos} />
                      <Badge variant="outline" className={statusColors[g.status] || ""}>
                        {statusLabels[g.status] || g.status}
                      </Badge>
                      <Badge variant="secondary" className="text-base font-bold">
                        {formatCurrency(g.totalPago)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">{type === "encontro" ? "Encontristas" : "Reencontristas"}</p>
                      <p className="text-lg font-semibold">{g.encontristas ?? g.reencontristas}</p>
                      {(g.encontristasIsentos ?? g.reencontristasIsentos) > 0 && (
                        <p className="text-xs text-muted-foreground">
                          ({g.encontristasIsentos ?? g.reencontristasIsentos} isentos)
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Equipe</p>
                      <p className="text-lg font-semibold">{g.equipe}</p>
                      {g.equipeIsentos > 0 && (
                        <p className="text-xs text-muted-foreground">({g.equipeIsentos} isentos)</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Pago</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(g.totalPago)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">A Pagar</p>
                      <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                        {formatCurrency(g.totalAPagar)}
                      </p>
                    </div>
                  </div>

                  {/* Formas de pagamento do grupo */}
                  {Object.keys(g.pagamentosPorTipo).length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground uppercase mb-2">Pagamentos</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(g.pagamentosPorTipo).map(([tipo, valor]) => (
                          <div
                            key={tipo}
                            className="rounded-md border border-border/50 bg-secondary/30 px-3 py-1.5 text-sm"
                          >
                            <span className="font-medium">{tipoLabels[tipo] || tipo}:</span>{" "}
                            <span className="font-semibold">{formatCurrency(valor as number)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
