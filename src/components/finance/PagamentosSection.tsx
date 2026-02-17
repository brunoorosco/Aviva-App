import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CreditCard, FileImage, Upload, X } from "lucide-react";
import { Pagamento, TypePagamento } from "@/domain/models/encontroComDeus";


interface Props {
  pagamentos: Pagamento[];
  onAdd: (p: Omit<Pagamento, "_id" | "data">) => void;
  onRemove: (id: string) => void;
}

const tipoLabels: Record<string, string> = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" };

export function PagamentosSection({ pagamentos, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<string>("");
  const [valor, setValor] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const needsComprovante = tipo === "pix" || tipo === "cartao";
  const canSave = tipo && parseFloat(valor) > 0 && (!needsComprovante || comprovante);

  const handleSave = () => {
    const v = parseFloat(valor);
    if (!tipo || isNaN(v) || v <= 0) return;
    if (needsComprovante && !comprovante) return;

    onAdd({
      tipo: tipo as TypePagamento,
      valor: parseFloat(valor),
      comprovanteUrl: comprovante ? URL.createObjectURL(comprovante) : undefined,
      comprovanteName: comprovante?.name,
    });
    setTipo("");
    setValor("");
    setComprovante(null);
    setShowForm(false);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Pagamentos
        </CardTitle>
        {!showForm && (
          <Button size="sm" className="gap-1" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Adicionar Pagamento
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">Pix</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Valor</Label>
                <Input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>

            {needsComprovante && (
              <div className="space-y-1.5">
                <Label>Comprovante {needsComprovante && <span className="text-destructive">*</span>}</Label>
                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setComprovante(e.target.files?.[0] || null)} />
                {comprovante ? (
                  <div className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/30 px-3 py-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate flex-1">{comprovante.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setComprovante(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1 w-full" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Enviar comprovante
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setTipo(""); setValor(""); setComprovante(null); }}>Cancelar</Button>
              <Button size="sm" onClick={handleSave} disabled={!canSave}>Salvar</Button>
            </div>
          </div>
        )}

        {pagamentos.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum pagamento registrado</p>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {pagamentos.map((p) => (
            <div key={p._id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2">
              <span className="text-xs font-medium uppercase rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                {tipoLabels[p.tipo]}
              </span>
              <span className="text-sm font-semibold flex-1">
                {p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <span className="text-xs text-muted-foreground">{new Date(p.data).toLocaleDateString("pt-BR")}</span>
              {p.comprovanteUrl && (
                <a href={p.comprovanteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                  <FileImage className="h-4 w-4" />
                </a>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onRemove(p._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
