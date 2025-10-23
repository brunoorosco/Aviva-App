import { useState } from "react";
import { ArrowLeft, Plus, Calendar, User, FileText, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockConsagracoes, mockMinisterialHistory, mockPeople } from "../../../../../mocks/mockMinisterial";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/router";
import {
  ministerialLevels,
  TConsagracao,
  TConsagracaoUser,
  TMinisterialHistory,
  TMinisterialLevel,
  TMinisterialRecord,
  TPerson,
} from "@/domain/models/ministerial";
import { Badge } from "@/components/ui/badge";

const MinisterialHistory = () => {
  const navigate = useRouter();
  const [histories, setHistories] = useState<TMinisterialHistory[]>(mockMinisterialHistory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfSortOrder, setPdfSortOrder] = useState<"alfabetica" | "celula" | "cargo">("alfabetica");
  const [consagracoes, setConsagracoes] = useState<TConsagracao[]>(mockConsagracoes);

  // Form states
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<TMinisterialLevel>("Auxiliar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCargo, setSelectedCargo] = useState<TMinisterialLevel>("Auxiliar");
  const [selectedUsers, setSelectedUsers] = useState<TConsagracaoUser[]>([]);

  const handleAddNewPerson = () => {
    if (!newPersonName.trim()) return;

    const newPerson: TMinisterialHistory = {
      _id: Date.now().toString(),
      name: newPersonName,
      consagracao: [],
    };

    setHistories([...histories, newPerson]);
    setNewPersonName("");
  };

  const handleAddRecord = () => {
    if (!selectedPersonId) return;

    const newRecord: TMinisterialRecord = {
      data: format(selectedDate, "yyyy-MM-dd"),
      type: selectedLevel,
    };

    setHistories(
      histories.map((h) =>
        h._id === selectedPersonId
          ? {
              ...h,
              consagracao: [...h.consagracao, newRecord].sort((a, b) =>
                a.data.localeCompare(b.data)
              ),
            }
          : h
      )
    );

    setIsAddDialogOpen(false);
    setSelectedPersonId("");
  };

  const getPendingConsecrations = () => {
    return histories
      .map((person) => {
        const lastRecord = person.consagracao[person.consagracao.length - 1];
        if (!lastRecord) return null;

        // Check if last position was "Separado" (pending consecration)
        if (lastRecord.type === "Separado a Supervisão") {
          return { nome: person.name, pendingFor: "Supervisor (Consagrado)" };
        }
        if (lastRecord.type === "Separado a Pastorado") {
          return { nome: person.name, pendingFor: "Pastor (Consagrado)" };
        }
        return null;
      })
      .filter((item) => item !== null);
  };

  const pendingConsecrations = getPendingConsecrations();

  const filteredPeople = mockPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPersonToList = (person: TPerson) => {
    // Check if person is already in the list
    if (selectedUsers.some((u) => u.user_id === person._id)) return;

    setSelectedUsers([
      ...selectedUsers,
      {
        user_id: person._id,
        name: person.name,
        cell_id: person.cell_id,
      },
    ]);
    setSearchQuery("");
  };
  const handleRemovePersonFromList = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.user_id !== userId));
  };

  const handleSaveConsagracao = () => {
    if (selectedUsers.length === 0) return;

    const newConsagracao: TConsagracao = {
      _id: Date.now().toString(),
      consagracao_at: format(selectedDate, "yyyy-MM-dd"),
      cargo: selectedCargo,
      users: selectedUsers,
    };

    setConsagracoes(
      [...consagracoes, newConsagracao].sort((a, b) =>
        b.consagracao_at.localeCompare(a.consagracao_at)
      )
    );

    // Reset form
    setSelectedUsers([]);
    setSelectedCargo("Auxiliar");
    setSelectedDate(new Date());
    setIsAddDialogOpen(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text(`Consagração Ministerial - ${new Date().getFullYear()} `, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy")}`, 20, yPosition);
    yPosition += 15;

    // Sort histories based on selected order
    let sortedHistories = [...histories];

    if (pdfSortOrder === "alfabetica") {
      sortedHistories.sort((a, b) => a.name.localeCompare(b.name));
    } else if (pdfSortOrder === "cargo") {
      sortedHistories.sort((a, b) => {
        const lastA = a.consagracao[a.consagracao.length - 1];
        const lastB = b.consagracao[b.consagracao.length - 1];
        const cargoA = lastA ? lastA.type : "";
        const cargoB = lastB ? lastB.type : "";
        return cargoA.localeCompare(cargoB);
      });
    }

    // Group by cargo if selected
    if (pdfSortOrder === "cargo") {
      const groupedByCargo: { [key: string]: TMinisterialHistory[] } = {};
      sortedHistories.forEach((person) => {
        const lastRecord = person.consagracao[person.consagracao.length - 1];
        const cargo = lastRecord ? lastRecord.type : "Sem Cargo";
        if (!groupedByCargo[cargo]) groupedByCargo[cargo] = [];
        groupedByCargo[cargo].push(person);
      });

      Object.keys(groupedByCargo).forEach((cargo) => {
        doc.setFontSize(12);
        doc.setFont("", "bold");
        doc.text(`Cargo: ${cargo}`, 20, yPosition);
        yPosition += 8;
        doc.setFont("", "normal");

        groupedByCargo[cargo].forEach((person) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(10);
          doc.text(`• ${person.name}`, 25, yPosition);
          yPosition += 6;

          person.consagracao.forEach((record) => {
            doc.setFontSize(8);
            doc.text(
              `  - ${record.type} em ${format(new Date(record.data), "dd/MM/yyyy")}`,
              30,
              yPosition
            );
            yPosition += 5;
          });
          yPosition += 3;
        });
        yPosition += 5;
      });
    } else {
      // Regular list
      sortedHistories.forEach((person) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont("", "bold");
        doc.text(person.name, 20, yPosition);
        yPosition += 7;
        doc.setFont("", "normal");

        if (person.consagracao.length === 0) {
          doc.setFontSize(9);
          doc.text("Sem histórico ministerial", 25, yPosition);
          yPosition += 6;
        } else {
          person.consagracao.forEach((record) => {
            doc.setFontSize(9);
            doc.text(
              `• ${record.type} - ${format(new Date(record.data), "dd/MM/yyyy")}`,
              25,
              yPosition
            );
            yPosition += 6;
          });
        }
        yPosition += 5;
      });
    }

    doc.save(`relatorio-ministerial-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    setIsPdfDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Histórico Ministerial</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Consagracao */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Consagração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Adicionar Consagração
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Consagração</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cargo">Cargo Ministerial</Label>
                        <Select
                          value={selectedCargo}
                          onValueChange={(value) => setSelectedCargo(value as TMinisterialLevel)}
                        >
                          <SelectTrigger id="cargo">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ministerialLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="date">Data da Consagração</Label>
                        <Input
                          id="date"
                          type="date"
                          value={format(selectedDate, "yyyy-MM-dd")}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="search">Buscar Pessoa</Label>
                        <Input
                          id="search"
                          placeholder="Digite o nome..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && filteredPeople.length > 0 && (
                          <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                            {filteredPeople.map((person) => (
                              <div
                                key={person._id}
                                className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                                onClick={() => handleAddPersonToList(person)}
                              >
                                <p className="font-medium">{person.name}</p>
                                <p className="text-sm text-muted-foreground">{person.cell_name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedUsers.length > 0 && (
                        <div>
                          <Label>Pessoas Selecionadas</Label>
                          <div className="mt-2 space-y-2">
                            {selectedUsers.map((user) => {
                              const person = mockPeople.find((p) => p._id === user.user_id);
                              return (
                                <div
                                  key={user.user_id}
                                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {person?.cell_name}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemovePersonFromList(user.user_id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleSaveConsagracao}
                        className="w-full"
                        disabled={selectedUsers.length === 0}
                      >
                        Salvar Consagração
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Consagracoes List */}
            {consagracoes.map((consagracao) => (
              <Card key={consagracao._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{consagracao.cargo}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(consagracao.consagracao_at), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary">{consagracao.users.length} pessoas</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consagracao.users.map((user) => {
                      const person = mockPeople.find((p) => p._id === user.user_id);
                      return (
                        <div
                          key={user.user_id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{person?.cell_name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Total de Consagrações</p>
                    <p className="text-2xl font-bold">{consagracoes.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                    <p className="text-2xl font-bold">
                      {consagracoes.reduce((acc, c) => acc + c.users.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinisterialHistory;
