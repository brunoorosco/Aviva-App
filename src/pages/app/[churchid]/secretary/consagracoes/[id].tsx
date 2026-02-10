import { useState, useCallback } from "react";
import { ArrowLeft, FileText, SaveAllIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/router";
import { ConsagracaoFormTabs } from "@/components/Consagracao/ConsagracaoFormTabs";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { loadImageAsDataURL } from "@/utils/loadImageasDataUrl";
import { useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";

const MinisterialHistory = () => {
  const navigate = useRouter();
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfSortOrder, setPdfSortOrder] = useState<"alfabetica" | "celula" | "cargo">("alfabetica");
  const [usersData, setUsersData] = useState<any>({});
  const [consagracaoDate, setConsagracaoDate] = useState<Date | null>(null); // ✅ Estado para date
  const [concluedAt, setConcluedAt] = useState<Date | null>(null); // ✅ Estado para concluedAt
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const consagracaoId = router.query.id;

  // Callback para receber dados do ConsagracaoFormTabs
  const handleDataChange = useCallback((data: any) => {
    setUsersData(data.users || data); // ✅ Atualiza users
    if (data.date) setConsagracaoDate(data.date); // ✅ Atualiza date
    if (data.concluedAt) setConcluedAt(data.concluedAt); // ✅ Atualiza concluedAt
  }, []);

  // ✅ Verifica se a consagração já foi concluída
  const isConsagracaoConcluida = !!concluedAt;

  const generatePDF = async () => {
    const doc = new jsPDF();
    let currentPage = 1;
    let yPosition = 40;

    // ... resto do código de geração de PDF ...
  };

  const handleSubmit = async () => {
    if (isConsagracaoConcluida) {
      Toast.showError("Esta consagração já foi finalizada!");
      return;
    }

    setIsLoading(true);
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/consagracao/${consagracaoId}`,
      data: { 
        users: usersData,
        date: consagracaoDate // ✅ Envia a data também
      },
    });
    setIsLoading(false);

    if (response?.error) {
      Toast.showError("Erro ao registrar consagração!");
    } else {
      Toast.showSuccess("Consagrações finalizada com sucesso!");
      setConcluedAt(new Date()); // ✅ Atualiza localmente
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Consagração Ministerial</h1>
              <p className="text-muted-foreground">Gerencie a evolução ministerial dos membros</p>
              {/* ✅ Mostra status de conclusão */}
              {isConsagracaoConcluida && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  ✅ Consagração concluída em {format(new Date(concluedAt), "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </div>
          <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
            <div className="flex gap-4">
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>
              </DialogTrigger>

              {/* ✅ Botão bloqueado se já foi concluída */}
              <Button 
                onClick={handleSubmit}
                disabled={isConsagracaoConcluida || isLoading}
                className={isConsagracaoConcluida ? "opacity-50 cursor-not-allowed" : ""}
              >
                <SaveAllIcon className="h-4 w-4 mr-2" />
                {isConsagracaoConcluida ? "Já Finalizada" : "Finalizar Consagrações"}
              </Button>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Relatório PDF</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Ordem de Organização</Label>
                  <RadioGroup
                    value={pdfSortOrder}
                    onValueChange={(value) => setPdfSortOrder(value as typeof pdfSortOrder)}
                  >
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="alfabetica" id="alfabetica" />
                      <Label htmlFor="alfabetica" className="font-normal cursor-pointer">
                        Ordem Alfabética
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="celula" id="celula" />
                      <Label htmlFor="celula" className="font-normal cursor-pointer">
                        Separar por Célula
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cargo" id="cargo" />
                      <Label htmlFor="cargo" className="font-normal cursor-pointer">
                        Separar por Cargo Ministerial
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cargo-inverso-rede" id="cargo-inverso-rede" />
                      <Label htmlFor="cargo-inverso-rede" className="font-normal cursor-pointer">
                        Cargo Inverso por Rede
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={generatePDF} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="container mx-auto">
          <ConsagracaoFormTabs onDataChange={handleDataChange} />
        </div>
      </div>
    </div>
  );
};

export default MinisterialHistory;