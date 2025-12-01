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

  const [formData, setFormData] = useState({
    nomeHomem: "",
    nomeMulher: "",
    nome: "",
    rede: "",
    nomeCrianca: "",
    nomePai: "",
    nomeMae: "",
    dataApresentacao: new Date().toISOString().split("T")[0],
  });

  const handleOpenDialog = (category: "alianca" | "membro" | "crianca") => {
    setCurrentCategory(category);
    setFormData({
      nomeHomem: "",
      nomeMulher: "",
      nome: "",
      rede: "",
      nomeCrianca: "",
      nomePai: "",
      nomeMae: "",
      dataApresentacao: new Date().toISOString().split("T")[0],
    });
    setOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCategory === "alianca") {
      const newAlianca: TAlianca = {
        _id: Date.now().toString(),
        nomeHomem: formData.nomeHomem,
        nomeMulher: formData.nomeMulher,
        dataApresentacao: formData.dataApresentacao,
      };
      setAliancas([...aliancas, newAlianca]);
    } else if (currentCategory === "membro") {
      const newMembro: TNovoMembro = {
        _id: Date.now().toString(),
        nome: formData.nome,
        rede: formData.rede,
        dataApresentacao: formData.dataApresentacao,
      };
      setNovosMembros([...novosMembros, newMembro]);
    } else {
      const newCrianca: TCrianca = {
        _id: Date.now().toString(),
        nomeCrianca: formData.nomeCrianca,
        nomePai: formData.nomePai,
        nomeMae: formData.nomeMae,
        dataApresentacao: formData.dataApresentacao,
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
    doc.addImage("/logo-preto.png", "png");

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
                            <TableCell>{membro.rede}</TableCell>
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
                          <TableHead>Data Apresentação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aliancas.map((alianca) => (
                          <TableRow key={alianca._id}>
                            <TableCell className="font-medium">{alianca.nomeHomem}</TableCell>
                            <TableCell>{alianca.nomeMulher}</TableCell>
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
                          <TableHead>Data Apresentação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {criancas.map((crianca) => (
                          <TableRow key={crianca._id}>
                            <TableCell className="font-medium">{crianca.nomeCrianca}</TableCell>
                            <TableCell>{crianca.nomePai}</TableCell>
                            <TableCell>{crianca.nomeMae}</TableCell>
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
              <form onSubmit={handleSubmit} className="pr-4 space-y-4">
                {currentCategory === "alianca" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nomeHomem" className="text-sm">
                        Nome do Homem
                      </Label>
                      <Input
                        id="nomeHomem"
                        value={formData.nomeHomem}
                        onChange={(e) => setFormData({ ...formData, nomeHomem: e.target.value })}
                        required
                        className="text-base" // Evita zoom no iOS
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeMulher" className="text-sm">
                        Nome da Mulher
                      </Label>
                      <Input
                        id="nomeMulher"
                        value={formData.nomeMulher}
                        onChange={(e) => setFormData({ ...formData, nomeMulher: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                  </>
                )}

                {currentCategory === "membro" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-sm">
                        Nome do Membro
                      </Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rede" className="text-sm">
                        Rede
                      </Label>
                      <Input
                        id="rede"
                        value={formData.rede}
                        onChange={(e) => setFormData({ ...formData, rede: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                  </>
                )}

                {currentCategory === "crianca" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nomeCrianca" className="text-sm">
                        Nome da Criança
                      </Label>
                      <Input
                        id="nomeCrianca"
                        value={formData.nomeCrianca}
                        onChange={(e) => setFormData({ ...formData, nomeCrianca: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomePai" className="text-sm">
                        Nome do Pai
                      </Label>
                      <Input
                        id="nomePai"
                        value={formData.nomePai}
                        onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeMae" className="text-sm">
                        Nome da Mãe
                      </Label>
                      <Input
                        id="nomeMae"
                        value={formData.nomeMae}
                        onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                        required
                        className="text-base"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dataApresentacao" className="text-sm">
                    Data de Apresentação
                  </Label>
                  <Input
                    id="dataApresentacao"
                    type="date"
                    value={formData.dataApresentacao}
                    onChange={(e) => setFormData({ ...formData, dataApresentacao: e.target.value })}
                    required
                    className="text-base"
                  />
                </div>

                <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Adicionar
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
