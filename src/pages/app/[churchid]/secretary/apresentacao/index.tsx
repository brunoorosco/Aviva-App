import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockAliancas, mockNovosMembros, mockCriancas } from "@/mocks/mockapresentacao";
import { TAlianca, TNovoMembro, TCrianca } from "@/domain/models/apresentacao";
import { Plus, Users, Baby, Heart, Printer } from "lucide-react";
import jsPDF from "jspdf";
import { SelectCem } from "@/components/Select/SelectCem";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import { loadImageAsDataURL } from "@/utils/loadImageasDataUrl";

// Tipos para os formulários
type AliancaFormData = {
  nomeHomem: string;
  nomeMulher: string;
  dataApresentacao: string;
};

type MembroFormData = {
  nome: string;
  rede: string;
  cemId?: string;
  dataApresentacao: string;
};

type CriancaFormData = {
  nomeCrianca: string;
  nomePai: string;
  nomeMae: string;
  dataApresentacao: string;
};

type FormData = AliancaFormData & MembroFormData & CriancaFormData;

const ApresentacaoPage = () => {
  const [aliancas, setAliancas] = useState<TAlianca[]>(mockAliancas);
  const [novosMembros, setNovosMembros] = useState<TNovoMembro[]>(mockNovosMembros);
  const [criancas, setCriancas] = useState<TCrianca[]>(mockCriancas);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<"alianca" | "membro" | "crianca">(
    "membro"
  );
  const [activeTab, setActiveTab] = useState<"novosmembros" | "aliancas" | "criancas">(
    "novosmembros"
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { data: session } = useSession();

  // Hook form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nomeHomem: "",
      nomeMulher: "",
      nome: "",
      rede: "",
      cemId: "",
      nomeCrianca: "",
      nomePai: "",
      nomeMae: "",
      dataApresentacao: new Date().toISOString().split("T")[0],
    },
  });

  const handleOpenDialog = (category: "alianca" | "membro" | "crianca") => {
    setCurrentCategory(category);
    reset({
      nomeHomem: "",
      nomeMulher: "",
      nome: "",
      rede: "",
      cemId: "",
      nomeCrianca: "",
      nomePai: "",
      nomeMae: "",
      dataApresentacao: new Date().toISOString().split("T")[0],
    });
    setOpenDialog(true);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (currentCategory === "alianca") {
      const newAlianca: TAlianca = {
        _id: Date.now().toString(),
        nomeHomem: data.nomeHomem,
        nomeMulher: data.nomeMulher,
        rede: data.rede,
        dataApresentacao: data.dataApresentacao,
      };
      setAliancas([...aliancas, newAlianca]);
    } else if (currentCategory === "membro") {
      const newMembro: TNovoMembro = {
        _id: Date.now().toString(),
        nome: data.nome,
        rede: data.rede || data.cemId || "", 
        dataApresentacao: data.dataApresentacao,
      };
      setNovosMembros([...novosMembros, newMembro]);
    } else {
      const newCrianca: TCrianca = {
        _id: Date.now().toString(),
        nomeCrianca: data.nomeCrianca,
        nomePai: data.nomePai,
        nomeMae: data.nomeMae,
        rede: data.rede,
        dataApresentacao: data.dataApresentacao,
      };
      setCriancas([...criancas, newCrianca]);
    }

    setOpenDialog(false);
  };

  // FUNÇÃO CORRIGIDA para gerar PDF
  const handlePrint = async () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Header com logo (tratamento de erro)
      try {
        const logoDataURL = await loadImageAsDataURL('/logo-preto.png');
        doc.addImage(logoDataURL, 'PNG', 15, 10, 30, 20); // x, y, width, height
        yPosition = 40;
      } catch (error) {
        console.warn('Erro ao carregar logo, continuando sem imagem:', error);
        // Continuar sem a imagem
      }

      // Título principal
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Avivamento em Cristo", 105, yPosition, { align: "center" });
      yPosition += 10;

      doc.setFontSize(16);
      doc.text("Apresentações", 105, yPosition, { align: "center" });
      yPosition += 5;

      // Data do relatório
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, yPosition, { align: "center" });
      yPosition += 15;

      // Função para adicionar uma nova página se necessário
      const checkPageBreak = (additionalHeight: number = 15) => {
        if (yPosition + additionalHeight > 280) { // Margem inferior
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Renderizar dados baseado na tab ativa
      if (activeTab === "novosmembros" && novosMembros.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("NOVOS MEMBROS", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        novosMembros.forEach((membro, index) => {
          checkPageBreak(20);
          
          // Nome em negrito
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}. ${membro.nome}`, 25, yPosition);
          yPosition += 5;
          
          // Informações adicionais
          doc.setFont("helvetica", "normal");
          doc.text(`    Rede: ${membro.rede?.split('-')[1] || membro.rede}`, 25, yPosition);
          yPosition += 4;
          doc.text(`    Data: ${new Date(membro.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition);
          yPosition += 8;
        });
        
      } else if (activeTab === "aliancas" && aliancas.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("ALIANÇAS", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        aliancas.forEach((alianca, index) => {
          checkPageBreak(20);
          
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}. ${alianca.nomeHomem} e ${alianca.nomeMulher}`, 25, yPosition);
          yPosition += 5;
          
          doc.setFont("helvetica", "normal");
          if (alianca.rede) {
            doc.text(`    Rede: ${alianca.rede?.split('-')[1] || alianca.rede}`, 25, yPosition);
            yPosition += 4;
          }
          doc.text(`    Data: ${new Date(alianca.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition);
          yPosition += 8;
        });
        
      } else if (activeTab === "criancas" && criancas.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("CRIANÇAS", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        criancas.forEach((crianca, index) => {
          checkPageBreak(25);
          
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}. ${crianca.nomeCrianca}`, 25, yPosition);
          yPosition += 5;
          
          doc.setFont("helvetica", "normal");
          doc.text(`    Pais: ${crianca.nomePai} e ${crianca.nomeMae}`, 25, yPosition);
          yPosition += 4;
          if (crianca.rede) {
            doc.text(`    Rede: ${crianca.rede?.split('-')[1] || crianca.rede}`, 25, yPosition);
            yPosition += 4;
          }
          doc.text(`    Data: ${new Date(crianca.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition);
          yPosition += 8;
        });
      } else {
        // Nenhum dado disponível
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Nenhum dado disponível para impressão.", 105, yPosition, { align: "center" });
      }

      // Rodapé
      const pageCount = doc.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
      }

      // Salvar o arquivo
      const fileName = `apresentacoes_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const canPrint = () => {
    if (activeTab === "novosmembros") return novosMembros.length > 0;
    if (activeTab === "aliancas") return aliancas.length > 0;
    if (activeTab === "criancas") return criancas.length > 0;
    return false;
  };

  // Componente para renderizar cards em mobile
  const renderMobileCard = (type: "membro" | "alianca" | "crianca", data: any) => {
    return (
      <Card key={data._id} className="mb-3">
        <CardContent className="p-4">
          {type === "membro" && (
            <div className="space-y-2">
              <div className="text-lg font-semibold">{data.nome}</div>
              <div className="text-sm text-muted-foreground">Rede: {data.rede?.split('-')[1] || data.rede}</div>
              <div className="text-sm text-muted-foreground">
                Data: {new Date(data.dataApresentacao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          )}
          {type === "alianca" && (
            <div className="space-y-2">
              <div className="text-lg font-semibold">
                {data.nomeHomem} e {data.nomeMulher}
              </div>
              {data.rede && (
                <div className="text-sm text-muted-foreground">Rede: {data.rede?.split('-')[1] || data.rede}</div>
              )}
              <div className="text-sm text-muted-foreground">
                Data: {new Date(data.dataApresentacao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          )}
          {type === "crianca" && (
            <div className="space-y-2">
              <div className="text-lg font-semibold">{data.nomeCrianca}</div>
              <div className="text-sm text-muted-foreground">
                Pais: {data.nomePai} e {data.nomeMae}
              </div>
              {data.rede && (
                <div className="text-sm text-muted-foreground">Rede: {data.rede?.split('-')[1] || data.rede}</div>
              )}
              <div className="text-sm text-muted-foreground">
                Data: {new Date(data.dataApresentacao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-3 bg-background sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header - Responsivo */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-center sm:text-left">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl text-foreground">
              Apresentações
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Gerenciamento de apresentações
            </p>
          </div>
          {canPrint() && (
            <Button
              onClick={handlePrint}
              disabled={isGeneratingPdf}
              variant="outline"
              size="sm"
              className="self-center sm:self-auto"
            >
              <Printer className="w-4 h-4 mr-2" />
              {isGeneratingPdf ? (
                <>
                  <span className="hidden sm:inline">Gerando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Imprimir</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Resto do componente permanece igual... */}
        <Tabs
          defaultValue="novosmembros"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "novosmembros" | "aliancas" | "criancas")}
        >
          <TabsList className="grid w-full h-auto grid-cols-3 mb-4">
            <TabsTrigger
              value="novosmembros"
              className="flex flex-col items-center gap-1 p-2 sm:flex-row sm:gap-2 sm:p-3"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Membros</span>
            </TabsTrigger>
            <TabsTrigger
              value="aliancas"
              className="flex flex-col items-center gap-1 p-2 sm:flex-row sm:gap-2 sm:p-3"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Alianças</span>
            </TabsTrigger>
            <TabsTrigger
              value="criancas"
              className="flex flex-col items-center gap-1 p-2 sm:flex-row sm:gap-2 sm:p-3"
            >
              <Baby className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Crianças</span>
            </TabsTrigger>
          </TabsList>

          {/* Resto das TabsContent... igual ao código original */}
          
        </Tabs>

        {/* Dialog permanece igual... */}
      </div>
    </div>
  );
};

export default ApresentacaoPage;
