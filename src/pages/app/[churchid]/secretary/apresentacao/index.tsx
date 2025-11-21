import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAliancas, mockNovosMembros, mockCriancas } from "@/mocks/mockapresentacao";
import { TAlianca, TNovoMembro, TCrianca } from "@/domain/models/apresentacao";
import { Plus, Users, Baby, Heart, Printer } from "lucide-react";
import jsPDF from "jspdf";

const ApresentacaoPage = () => {
  const [aliancas, setAliancas] = useState<TAlianca[]>(mockAliancas);
  const [novosMembros, setNovosMembros] = useState<TNovoMembro[]>(mockNovosMembros);
  const [criancas, setCriancas] = useState<TCrianca[]>(mockCriancas);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<"alianca" | "membro" | "crianca">("membro");
  const [activeTab, setActiveTab] = useState<"novosmembros" | "aliancas" | "criancas">("novosmembros");

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
    doc.text("Igreja [Nome]", 105, 20, { align: "center" });
    
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
        doc.text(`Data: ${new Date(membro.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition + 5);
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
        doc.text(`Data: ${new Date(alianca.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition + 5);
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
        doc.text(`Data: ${new Date(crianca.dataApresentacao).toLocaleDateString("pt-BR")}`, 25, yPosition + 10);
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Apresentações</h1>
            <p className="text-muted-foreground">Gerenciamento de apresentações</p>
          </div>
          {canPrint() && (
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          )}
        </div>

        <Tabs defaultValue="novosmembros" className="w-full" onValueChange={(value) => setActiveTab(value as "novosmembros" | "aliancas" | "criancas")}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="novosmembros">
              <Users className="mr-2 h-4 w-4" />
              Novos Membros
            </TabsTrigger>
            <TabsTrigger value="aliancas">
              <Heart className="mr-2 h-4 w-4" />
              Alianças
            </TabsTrigger>
            <TabsTrigger value="criancas">
              <Baby className="mr-2 h-4 w-4" />
              Crianças
            </TabsTrigger>
          </TabsList>

          <TabsContent value="novosmembros">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Novos Membros</CardTitle>
                    <CardDescription>Lista de novos membros apresentados</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenDialog("membro")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                        <TableCell>{new Date(membro.dataApresentacao).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aliancas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Alianças</CardTitle>
                    <CardDescription>Lista de alianças apresentadas</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenDialog("alianca")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                        <TableCell>{new Date(alianca.dataApresentacao).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criancas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Crianças</CardTitle>
                    <CardDescription>Lista de crianças apresentadas</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenDialog("crianca")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                        <TableCell>{new Date(crianca.dataApresentacao).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentCategory === "alianca" && "Adicionar Aliança"}
                {currentCategory === "membro" && "Adicionar Novo Membro"}
                {currentCategory === "crianca" && "Adicionar Criança"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar uma nova apresentação
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentCategory === "alianca" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nomeHomem">Nome do Homem</Label>
                    <Input
                      id="nomeHomem"
                      value={formData.nomeHomem}
                      onChange={(e) => setFormData({ ...formData, nomeHomem: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeMulher">Nome da Mulher</Label>
                    <Input
                      id="nomeMulher"
                      value={formData.nomeMulher}
                      onChange={(e) => setFormData({ ...formData, nomeMulher: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              {currentCategory === "membro" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Membro</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rede">Rede</Label>
                    <Input
                      id="rede"
                      value={formData.rede}
                      onChange={(e) => setFormData({ ...formData, rede: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              {currentCategory === "crianca" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nomeCrianca">Nome da Criança</Label>
                    <Input
                      id="nomeCrianca"
                      value={formData.nomeCrianca}
                      onChange={(e) => setFormData({ ...formData, nomeCrianca: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomePai">Nome do Pai</Label>
                    <Input
                      id="nomePai"
                      value={formData.nomePai}
                      onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeMae">Nome da Mãe</Label>
                    <Input
                      id="nomeMae"
                      value={formData.nomeMae}
                      onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="dataApresentacao">Data de Apresentação</Label>
                <Input
                  id="dataApresentacao"
                  type="date"
                  value={formData.dataApresentacao}
                  onChange={(e) => setFormData({ ...formData, dataApresentacao: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApresentacaoPage