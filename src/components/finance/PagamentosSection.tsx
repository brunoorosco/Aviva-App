import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CreditCard, FileImage, Upload, X, Eye, Loader2 } from "lucide-react";
import { Pagamento, TypePagamento } from "@/domain/models/encontroComDeus";
import { ComprovanteModal } from "./ComprovanteModal";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Props {
  pagamentos: Pagamento[];
  onAdd: (p: Omit<Pagamento, "_id" | "data">) => void;
  onRemove: (id: string) => void;
  onRemoveComprovante: (id: string) => void;
  customFolder?: string;
}

const tipoLabels: Record<string, string> = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro" };

export function PagamentosSection({ pagamentos, onAdd, onRemove, onRemoveComprovante, customFolder }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<string>("");
  const [valor, setValor] = useState("");
  const [observacao, setObservacao] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComprovante, setSelectedComprovante] = useState<{
    url: string;
    name?: string;
  } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    id: string;
    type: "payment" | "comprovante";
  }>({ open: false, id: "", type: "payment" });

  // Gerenciar URL local para preview
  useEffect(() => {
    if (comprovante) {
      const url = URL.createObjectURL(comprovante);
      setLocalPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLocalPreviewUrl(null);
    }
  }, [comprovante]);

  const fileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const needsComprovante = tipo === "pix" || tipo === "cartao";
  const canSave = tipo && parseFloat(valor) > 0 && (!needsComprovante || comprovante);

  const handleSave = async () => {
    const v = parseFloat(valor);
    if (!tipo || isNaN(v) || v <= 0) return;
    if (needsComprovante && !comprovante) return;

    let comprovanteUrl: string | undefined;
    let comprovanteName: string | undefined;
    let comprovantePublicId: string | undefined;

    // Upload do comprovante se existir
    if (comprovante) {
      setIsUploading(true);
      try {
        // 1. Obter assinatura do backend
        const module = customFolder?.includes("reencontro")
          ? "reencontroComDeus"
          : "encontroComDeus";

        const signatureRes = await fetch(
          `/api/protected/churches/${session?.user.churchId}/${module}/comprovante/signature`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder: customFolder }),
          },
        );
        const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json();

        // 2. Upload direto para Cloudinary
        const formData = new FormData();
        formData.append("file", comprovante);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        formData.append("folder", folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Erro no upload");

        const uploadData = await uploadRes.json();
        comprovanteUrl = uploadData.secure_url;
        comprovantePublicId = uploadData.public_id;
        comprovanteName = comprovante.name;

        Toast.showSuccess("Comprovante enviado com sucesso!");
      } catch (error) {
        console.error("Erro no upload:", error);
        Toast.showError("Erro ao enviar comprovante");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    onAdd({
      tipo: tipo as TypePagamento,
      valor: v,
      comprovanteUrl,
      comprovanteName,
      comprovantePublicId,
      observacao,
    });

    setTipo("");
    setValor("");
    setObservacao("");
    setComprovante(null);
    setShowForm(false);
  };

  const handleViewComprovante = (url: string, name?: string) => {
    setSelectedComprovante({ url, name });
    setModalOpen(true);
  };

  return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Pagamentos
          </CardTitle>
          {!showForm && (
            <Button size="sm" className="gap-1" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> <span className="hidden sm:block">Adicionar Pagamento</span>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
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

              <div className="space-y-1.5">
                <Label>Observação (Opcional)</Label>
                <Input
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Pagamento referente a inscrição e transporte..."
                />
              </div>

              {needsComprovante && (
                <div className="space-y-1.5">
                  <Label>
                    Comprovante {needsComprovante && <span className="text-destructive">*</span>}
                  </Label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setComprovante(e.target.files?.[0] || null)}
                  />
                  {comprovante ? (
                    <div className="flex items-center gap-2 rounded-md border border-border/50 bg-secondary/30 px-3 py-2">
                      <FileImage className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate flex-1">{comprovante.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary"
                          onClick={() => handleViewComprovante(localPreviewUrl!, comprovante.name)}
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setComprovante(null)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 w-full"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" /> Enviar comprovante
                    </Button>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setTipo("");
                    setValor("");
                    setObservacao("");
                    setComprovante(null);
                  }}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} disabled={!canSave || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Adicionar"
                  )}
                </Button>
              </div>
            </div>
          )}

          {pagamentos.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum pagamento registrado
            </p>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pagamentos.map((p) => (
              <div
                key={p._id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
              >
                <span className="text-xs font-medium uppercase rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                  {tipoLabels[p.tipo]}
                </span>
                <span className="text-sm font-semibold flex-1">
                  {p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.data || (p as any).createdAt ? new Date(p.data || (p as any).createdAt).toLocaleDateString("pt-BR") : "Data não disponível"}
                </span>
                {p.comprovanteUrl && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary/80"
                      onClick={() => handleViewComprovante(p.comprovanteUrl!, p.comprovanteName)}
                      title="Ver comprovante"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/70 hover:text-destructive"
                      onClick={() => {
                        setConfirmConfig({ open: true, id: p._id, type: "comprovante" });
                      }}
                      title="Apagar apenas arquivo"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => {
                    setConfirmConfig({ open: true, id: p._id, type: "payment" });
                  }}
                  title="Apagar pagamento"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {p.observacao && (
                  <div className="w-full mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2 col-span-full">
                    {p.observacao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedComprovante && (
        <ComprovanteModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedComprovante(null);
          }}
          comprovanteUrl={selectedComprovante.url}
          comprovanteName={selectedComprovante.name}
        />
      )}

      <ConfirmDialog
        open={confirmConfig.open}
        onClose={() => setConfirmConfig({ ...confirmConfig, open: false })}
        onConfirm={() => {
          if (confirmConfig.type === "payment") {
            onRemove(confirmConfig.id);
          } else {
            onRemoveComprovante(confirmConfig.id);
          }
          setConfirmConfig({ ...confirmConfig, open: false });
        }}
        title={confirmConfig.type === "payment" ? "Remover Pagamento" : "Remover Comprovante"}
        description={
          confirmConfig.type === "payment"
            ? "Tem certeza que deseja remover este pagamento? Esta ação não pode ser desfeita."
            : "Deseja apagar apenas o arquivo do comprovante? As informações do pagamento serão mantidas."
        }
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}
