import { useState, useCallback } from "react";
import { ArrowLeft, FileText } from "lucide-react";
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

const MinisterialHistory = () => {
  const navigate = useRouter();
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfSortOrder, setPdfSortOrder] = useState<"alfabetica" | "celula" | "cargo">("alfabetica");
  const [usersData, setUsersData] = useState<any>({});

  // Callback para receber dados do ConsagracaoFormTabs
  const handleDataChange = useCallback((data: any) => {
    setUsersData(data);
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF();
    let currentPage = 1;
    let yPosition = 40;

    // Função para adicionar cabeçalho e rodapé em cada página
    try {
      const logoDataURL = await loadImageAsDataURL("/logo-preto.png");
      doc.addImage(logoDataURL, "PNG", 140, 10, 50, 20); // x, y, width, height
      yPosition = 40;
    } catch (error) {
      console.warn("Erro ao carregar logo, continuando sem imagem:", error);
      // Continuar sem a imagem
    }
    const addHeaderAndFooter = async (pageNumber: number) => {
      // Cabeçalho
      doc.setFontSize(14);
      doc.setFont("", "bold");
      doc.text(`Consagração Ministerial - ${new Date().getFullYear()}`, 20, 25);

      doc.setFontSize(9);
      doc.setFont("", "normal");
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy")}`, 20, 29);

      // Linha separadora do cabeçalho
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);

      // Rodapé com número da página
      doc.setFontSize(9);
      doc.setFont("", "normal");
      const pageText = `Página ${pageNumber}`;
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - textWidth - 20, 285);

      // Linha separadora do rodapé
      doc.setLineWidth(0.5);
      doc.line(20, 280, 190, 280);
    };

    // Adiciona cabeçalho e rodapé na primeira página
    addHeaderAndFooter(currentPage);

    // Coleta todos os usuários de todas as categorias
    const allUsers: any[] = [];

    Object.keys(usersData).forEach((role) => {
      if (usersData[role] && Array.isArray(usersData[role])) {
        usersData[role].forEach((user: any) => {
          allUsers.push({
            ...user,
            currentRole: role,
          });
        });
      }
    });

    if (allUsers.length === 0) {
      doc.setFontSize(12);
      doc.text("Nenhum usuário encontrado para gerar o relatório.", 20, yPosition);
      doc.save(`relatorio-ministerial-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      setIsPdfDialogOpen(false);
      return;
    }

    // Função para verificar se precisa de nova página
    const checkNewPage = (additionalSpace = 10) => {
      if (yPosition > 270 - additionalSpace) {
        doc.addPage();
        currentPage++;
        addHeaderAndFooter(currentPage);
        yPosition = 35;
        return true;
      }
      return false;
    };

    if (pdfSortOrder === "alfabetica") {
      // Ordenação alfabética simples
      allUsers.sort((a, b) => a.name.localeCompare(b.name));

      allUsers.forEach((user) => {
        checkNewPage(15);

        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text(user.name, 20, yPosition);
        yPosition += 7;

        doc.setFont("", "normal");
        doc.setFontSize(9);
        doc.text(`${user.rede} - ${user.currentRole}`, 25, yPosition);
        yPosition += 10;
      });
    } else if (pdfSortOrder === "celula") {
      // Agrupamento por rede (célula)
      const groupedByRede: any = {};
      allUsers.forEach((user) => {
        const rede = user.rede || "Sem Rede";
        if (!groupedByRede[rede]) groupedByRede[rede] = [];
        groupedByRede[rede].push(user);
      });

      const sortedRedes = Object.keys(groupedByRede).sort();

      sortedRedes.forEach((rede) => {
        checkNewPage(20);

        doc.setFontSize(14);
        doc.setFont("", "bold");
        doc.text(`${rede}`, 20, yPosition);
        yPosition += 10;
        doc.setFont("", "normal");

        groupedByRede[rede]
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .forEach((user: any) => {
            checkNewPage(8);

            doc.setFontSize(10);
            doc.text(`• ${user.name} - ${user.currentRole}`, 25, yPosition);
            yPosition += 6;
          });
        yPosition += 8;
      });
    } else if (pdfSortOrder === "cargo") {
      // Agrupamento por cargo (role) - ordem original
      const groupedByCargo: any = {};
      allUsers.forEach((user) => {
        const cargo = user.currentRole || "Sem Cargo";
        if (!groupedByCargo[cargo]) groupedByCargo[cargo] = [];
        groupedByCargo[cargo].push(user);
      });

      const cargoOrder = [
        "Auxiliar",
        "Lider",
        "Separado a Supervisão",
        "Supervisor",
        "Separado a Pastorado",
        "Pastor",
      ];
      const sortedCargos = Object.keys(groupedByCargo).sort((a, b) => {
        const indexA = cargoOrder.indexOf(a);
        const indexB = cargoOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        } else if (indexA !== -1) {
          return -1;
        } else if (indexB !== -1) {
          return 1;
        } else {
          return a.localeCompare(b);
        }
      });

      sortedCargos.forEach((cargo) => {
        checkNewPage(20);

        doc.setFontSize(14);
        doc.setFont("", "bold");
        doc.text(`${cargo}`, 20, yPosition);
        yPosition += 10;
        doc.setFont("", "normal");

        groupedByCargo[cargo]
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .forEach((user: any) => {
            checkNewPage(8);

            doc.setFontSize(10);
            doc.text(`• ${user.name} - ${user.rede}`, 25, yPosition);
            yPosition += 6;
          });
        yPosition += 8;
      });
    } else if (pdfSortOrder === "cargo-inverso-rede") {
      // NOVA OPÇÃO: Agrupamento por cargo (Pastor para Auxiliar) e depois por rede
      const groupedByCargoAndRede: any = {};

      allUsers.forEach((user) => {
        const cargo = user.currentRole || "Sem Cargo";
        const rede = user.rede || "Sem Rede";

        if (!groupedByCargoAndRede[cargo]) {
          groupedByCargoAndRede[cargo] = {};
        }
        if (!groupedByCargoAndRede[cargo][rede]) {
          groupedByCargoAndRede[cargo][rede] = [];
        }
        groupedByCargoAndRede[cargo][rede].push(user);
      });

      // Ordem INVERSA dos cargos (Pastor para Auxiliar)
      const cargoOrderInverso = [
        "Pastor",
        "Separado a Pastorado",
        "Supervisor",
        "Separado a Supervisão",
        "Lider",
        "Auxiliar",
      ];

      const sortedCargosInverso = Object.keys(groupedByCargoAndRede).sort((a, b) => {
        const indexA = cargoOrderInverso.indexOf(a);
        const indexB = cargoOrderInverso.indexOf(b);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        } else if (indexA !== -1) {
          return -1;
        } else if (indexB !== -1) {
          return 1;
        } else {
          return a.localeCompare(b);
        }
      });

      sortedCargosInverso.forEach((cargo) => {
        const redes = groupedByCargoAndRede[cargo];

        // Verifica se há usuários neste cargo
        const totalUsers = Object.values(redes).flat().length;
        if (totalUsers === 0) return;

        // Cabeçalho do cargo
        checkNewPage(25);

        doc.setFontSize(16);
        doc.setFont("", "bold");
        doc.text(`${cargo}`, 20, yPosition);
        yPosition += 8;

        // Ordena as redes alfabeticamente
        const sortedRedes = Object.keys(redes).sort();

        sortedRedes.forEach((rede) => {
          const usersInRede = redes[rede];
          if (usersInRede.length === 0) return;

          // Verifica espaço para cabeçalho da rede + pelo menos um usuário
          checkNewPage(20);

          doc.setFontSize(12);
          doc.setFont("", "bold");
          doc.text(`${capitalizeWords(rede)}`, 25, yPosition);
          yPosition += 5;
          doc.setFont("", "normal");

          // Lista os usuários da rede, ordenados alfabeticamente
          usersInRede
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .forEach((user: any) => {
              checkNewPage(6);

              doc.setFontSize(12);
              doc.text(`- ${capitalizeWords(user.name)}`, 30, yPosition);
              yPosition += 5;
            });

          yPosition += 5; // Espaço extra entre redes
        });

        yPosition += 5; // Espaço extra entre cargos
      });
    }

    doc.save(`relatorio-ministerial-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    setIsPdfDialogOpen(false);
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
            </div>
          </div>
          <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
            </DialogTrigger>
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
