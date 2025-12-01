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
        rede: data.rede || data.cemId || "", // Use cemId se rede estiver vazia
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

  const handlePrint = () => {
    const doc = new jsPDF();

    // Add church logo (placeholder text for now)
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Avivamento em Cristo", 105, 20, { align: "center" });
    doc.addImage("/logo-preto.png");

    doc.setFontSize(16);
    doc.text("Apresentações", 105, 35, { align: "center" });

    let yPosition = 50;

    if (activeTab === "novosmembros" && novosMembros.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Novos Membros", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      novosMembros.forEach((membro) => {
        doc.text(`${membro.nome} - ${membro.rede}`, 25, yPosition);
        doc.text(
          `Data: ${new Date(membro.dataApresentacao).toLocaleDateString("pt-BR")}`,
          25,
          yPosition + 5
        );
        yPosition += 15;
      });
    } else if (activeTab === "aliancas" && aliancas.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Alianças", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      aliancas.forEach((alianca) => {
        doc.text(`${alianca.nomeHomem} e ${alianca.nomeMulher}`, 25, yPosition);
        doc.text(
          `Data: ${new Date(alianca.dataApresentacao).toLocaleDateString("pt-BR")}`,
          25,
          yPosition + 5
        );
        yPosition += 15;
      });
    } else if (activeTab === "criancas" && criancas.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Crianças", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      criancas.forEach((crianca) => {
        doc.text(`Criança: ${crianca.nomeCrianca}`, 25, yPosition);
        doc.text(`Pais: ${crianca.nomePai} e ${crianca.nomeMae}`, 25, yPosition + 5);
        doc.text(
          `Data: ${new Date(crianca.dataApresentacao).toLocaleDateString("pt-BR")}`,
          25,
          yPosition + 10
        );
        yPosition += 20;
      });
    }

    doc.save("apresentacoes.pdf");
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
              <div className="text-sm text-muted-foreground">Rede: {data.rede}</div>
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
              variant="outline"
              size="sm"
              className="self-center sm:self-auto"
            >
              <Printer className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Imprimir</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          )}
        </div>

        {/* Tabs - Otimizado para mobile */}
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

          {/* Novos Membros */}
          <TabsContent value="novosmembros">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Novos Membros</CardTitle>
                    <CardDescription className="text-sm">
                      Lista de novos membros apresentados
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleOpenDialog("membro")}
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Rede</TableHead>
                          <TableHead>Data Apresentação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {novosMembros.map((membro) => (
                          <TableRow key={membro._id}>
                            <TableCell className="font-medium">{membro.nome}</TableCell>
                            <TableCell>{membro.rede.split('-')[1]}</TableCell>
                            <TableCell>
                              {new Date(membro.dataApresentacao).toLocaleDateString("pt-BR")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 sm:hidden">
                  {novosMembros.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhum membro cadastrado
                    </div>
                  ) : (
                    novosMembros.map((membro) => renderMobileCard("membro", membro))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alianças */}
          <TabsContent value="aliancas">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Alianças</CardTitle>
                    <CardDescription className="text-sm">
                      Lista de alianças apresentadas
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleOpenDialog("alianca")}
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Homem</TableHead>
                          <TableHead>Nome da Mulher</TableHead>
                          <TableHead>Rede</TableHead>
                          <TableHead>Data Apresentação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aliancas.map((alianca) => (
                          <TableRow key={alianca._id}>
                            <TableCell className="font-medium">{alianca.nomeHomem}</TableCell>
                            <TableCell>{alianca.nomeMulher}</TableCell>
                            <TableCell>{alianca.rede?.split('-')[1]}</TableCell>
                            <TableCell>
                              {new Date(alianca.dataApresentacao).toLocaleDateString("pt-BR")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 sm:hidden">
                  {aliancas.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhuma aliança cadastrada
                    </div>
                  ) : (
                    aliancas.map((alianca) => renderMobileCard("alianca", alianca))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crianças */}
          <TabsContent value="criancas">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Crianças</CardTitle>
                    <CardDescription className="text-sm">
                      Lista de crianças apresentadas
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleOpenDialog("crianca")}
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Criança</TableHead>
                          <TableHead>Nome do Pai</TableHead>
                          <TableHead>Nome da Mãe</TableHead>
                          <TableHead>Rede</TableHead>
                          <TableHead>Data Apresentação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {criancas.map((crianca) => (
                          <TableRow key={crianca._id}>
                            <TableCell className="font-medium">{crianca.nomeCrianca}</TableCell>
                            <TableCell>{crianca.nomePai}</TableCell>
                            <TableCell>{crianca.nomeMae}</TableCell>
                            <TableCell>{crianca.rede?.split('-')[1]}</TableCell>
                            <TableCell>
                              {new Date(crianca.dataApresentacao).toLocaleDateString("pt-BR")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 sm:hidden">
                  {criancas.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      Nenhuma criança cadastrada
                    </div>
                  ) : (
                    criancas.map((crianca) => renderMobileCard("crianca", crianca))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog - Otimizado para mobile */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {currentCategory === "alianca" && "Adicionar Aliança"}
                {currentCategory === "membro" && "Adicionar Novo Membro"}
                {currentCategory === "crianca" && "Adicionar Criança"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Preencha os dados para adicionar uma nova apresentação
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <form onSubmit={handleSubmit(onSubmit)} className="pr-4 space-y-4">
                {currentCategory === "alianca" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nomeHomem" className="text-sm">
                        Nome do Homem
                      </Label>
                      <Controller
                        name="nomeHomem"
                        control={control}
                        rules={{ required: "Nome do homem é obrigatório" }}
                        render={({ field }) => (
                          <Input {...field} id="nomeHomem" className="text-base" />
                        )}
                      />
                      {errors.nomeHomem && (
                        <p className="text-sm text-red-600">{errors.nomeHomem.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeMulher" className="text-sm">
                        Nome da Mulher
                      </Label>
                      <Controller
                        name="nomeMulher"
                        control={control}
                        rules={{ required: "Nome da mulher é obrigatório" }}
                        render={({ field }) => (
                          <Input {...field} id="nomeMulher" className="text-base" />
                        )}
                      />
                      {errors.nomeMulher && (
                        <p className="text-sm text-red-600">{errors.nomeMulher.message}</p>
                      )}
                    </div>
                  </>
                )}

                {currentCategory === "membro" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-sm">
                        Nome do Membro
                      </Label>
                      <Controller
                        name="nome"
                        control={control}
                        rules={{ required: "Nome é obrigatório" }}
                        render={({ field }) => <Input {...field} id="nome" className="text-base" />}
                      />
                      {errors.nome && <p className="text-sm text-red-600">{errors.nome.message}</p>}
                    </div>
                  </>
                )}

                {currentCategory === "crianca" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nomeCrianca" className="text-sm">
                        Nome da Criança
                      </Label>
                      <Controller
                        name="nomeCrianca"
                        control={control}
                        rules={{ required: "Nome da criança é obrigatório" }}
                        render={({ field }) => (
                          <Input {...field} id="nomeCrianca" className="text-base" />
                        )}
                      />
                      {errors.nomeCrianca && (
                        <p className="text-sm text-red-600">{errors.nomeCrianca.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomePai" className="text-sm">
                        Nome do Pai
                      </Label>
                      <Controller
                        name="nomePai"
                        control={control}
                        rules={{ required: "Nome do pai é obrigatório" }}
                        render={({ field }) => (
                          <Input {...field} id="nomePai" className="text-base" />
                        )}
                      />
                      {errors.nomePai && (
                        <p className="text-sm text-red-600">{errors.nomePai.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeMae" className="text-sm">
                        Nome da Mãe
                      </Label>
                      <Controller
                        name="nomeMae"
                        control={control}
                        rules={{ required: "Nome da mãe é obrigatório" }}
                        render={({ field }) => (
                          <Input {...field} id="nomeMae" className="text-base" />
                        )}
                      />
                      {errors.nomeMae && (
                        <p className="text-sm text-red-600">{errors.nomeMae.message}</p>
                      )}
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <SelectCem
                    name="rede"
                    control={control}
                    churchId={session?.user.churchId as string}
                    title="Rede"
                    errors={errors}
                    isRequired={true}
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <Label htmlFor="dataApresentacao" className="text-sm">
                    Data de Apresentação
                  </Label>
                  <Controller
                    name="dataApresentacao"
                    control={control}
                    rules={{ required: "Data é obrigatória" }}
                    render={({ field }) => (
                      <Input {...field} id="dataApresentacao" type="date" className="text-base" />
                    )}
                  />
                  {errors.dataApresentacao && (
                    <p className="text-sm text-red-600">{errors.dataApresentacao.message}</p>
                  )}
                </div>

                <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Adicionando..." : "Adicionar"}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApresentacaoPage;
