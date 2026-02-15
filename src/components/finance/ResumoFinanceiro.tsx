import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { StatusFinanceiro, TPeople, TEquipe, Pagamento } from "@/domain/models/encontroComDeus";

interface Props {
  encontristas: TPeople[];
  equipeMembers: TEquipe[];
  pagamentos: Pagamento[];
  totalPago: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getStatus(saldo: number, totalPago: number): StatusFinanceiro {
  if (saldo === 0 && totalPago > 0) return "quitado";
  if (saldo < 0) return "excedente";
  if (saldo > 0 && totalPago > 0) return "parcial";
  return "pendente";
}

const statusConfig: Record<StatusFinanceiro, { label: string; color: string; bg: string }> = {
  quitado:  { label: "Quitado",  color: "hsl(142, 71%, 45%)", bg: "hsl(142, 71%, 45%, 0.15)" },
  parcial:  { label: "Parcial",  color: "hsl(45, 93%, 47%)",  bg: "hsl(45, 93%, 47%, 0.15)" },
  pendente: { label: "Pendente", color: "hsl(0, 84%, 60%)",   bg: "hsl(0, 84%, 60%, 0.15)" },
  excedente:{ label: "Excedente",color: "hsl(217, 91%, 60%)", bg: "hsl(217, 91%, 60%, 0.15)" },
};

const tipoLabels: Record<string, string> = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" };

export function ResumoFinanceiro({ encontristas, equipeMembers, pagamentos, totalPago }: Props) {
  const qtdEncontristas = encontristas.length;
  const qtdEquipe = equipeMembers.length;
  const qtdIsentosEncontristas = encontristas.filter(e => e.isento).length;
  const qtdIsentosEquipe = equipeMembers.filter(m => m.isento).length;
  const totalParticipantes = qtdEncontristas + qtdEquipe;
  const totalIsento = qtdIsentosEncontristas + qtdIsentosEquipe;

  // Pagamentos por tipo
  const pagamentosPorTipo = pagamentos.reduce((acc, p) => {
    acc[p.tipo] = (acc[p.tipo] || 0) + p.valor;
    return acc;
  }, {} as Record<string, number>);

  const saldo = totalPago > 0 ? 0 : 0; // Without fixed values, saldo is based on payments only
  const status = totalPago > 0 ? "quitado" : "pendente";
  const cfg = statusConfig[status as StatusFinanceiro];

  return (
    <Card className="border-2 border-primary/20 bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Resumo Financeiro
          </span>
          <Badge
            className="text-xs px-3 py-1 border-0"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contagens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCard label="Encontristas" value={String(qtdEncontristas)} />
          <InfoCard label="Equipe" value={String(qtdEquipe)} />
          <InfoCard label="Total Participantes" value={String(totalParticipantes)} />
          <InfoCard label="Isentos" value={String(totalIsento)} />
        </div>

        {/* Total pago */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total à Pagar</p>
            <p className="text-xl font-bold mt-1 text-red-600" >{formatCurrency(totalPago)}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Pago</p>
            <p className="text-xl font-bold mt-1" style={{ color: "hsl(142, 71%, 45%)" }}>{formatCurrency(totalPago)}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Qtd Pagamentos</p>
            <p className="text-xl font-bold mt-1">{pagamentos.length}</p>
          </div>
        </div>

        {/* Formas de pagamento */}
        {Object.keys(pagamentosPorTipo).length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Formas de Pagamento</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(pagamentosPorTipo).map(([tipo, valor]) => (
                <div key={tipo} className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tipoLabels[tipo] || tipo}</p>
                  <p className="text-sm font-semibold mt-0.5">{formatCurrency(valor)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
