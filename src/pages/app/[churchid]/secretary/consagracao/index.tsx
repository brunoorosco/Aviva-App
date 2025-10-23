import { useState } from "react";
import { ArrowLeft, Plus, Calendar, User, FileText } from "lucide-react";
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
import { mockMinisterialHistory } from "./mockMinisterial";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/router";
import {
  ministerialLevels,
  TMinisterialHistory,
  TMinisterialLevel,
  TMinisterialRecord,
} from "@/domain/models/ministerial";

const MinisterialHistory = () => {
  const navigate = useRouter();
  const [histories, setHistories] = useState<TMinisterialHistory[]>(mockMinisterialHistory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfSortOrder, setPdfSortOrder] = useState<"alfabetica" | "celula" | "cargo">("alfabetica");

  // Form states
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<TMinisterialLevel>("Auxiliar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text("Relatório de Mudanças Ministeriais", 20, yPosition);
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
            {/* Add New Person */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Adicionar Nova Pessoa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome completo"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                  />
                  <Button onClick={handleAddNewPerson}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* People List with Timeline */}
            {histories.map((person) => (
              <Card key={person._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{person.name}</CardTitle>
                    <Dialog
                      open={isAddDialogOpen && selectedPersonId === person._id}
                      onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (open) setSelectedPersonId(person._id);
                        else setSelectedPersonId("");
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedPersonId(person._id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Mudança
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Mudança Ministerial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="level">Nível Ministerial</Label>
                            <Select
                              value={selectedLevel}
                              onValueChange={(value) =>
                                setSelectedLevel(value as TMinisterialLevel)
                              }
                            >
                              <SelectTrigger id="level">
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
                            <Label htmlFor="date">Data</Label>
                            <Input
                              id="date"
                              type="date"
                              value={format(selectedDate, "yyyy-MM-dd")}
                              onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            />
                          </div>
                          <Button onClick={handleAddRecord} className="w-full">
                            Adicionar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {person.consagracao.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum histórico registrado
                    </p>
                  ) : (
                    <div className="relative pl-8 space-y-4">
                      {/* Timeline line */}
                      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

                      {person.consagracao.map((record, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary border-4 border-background" />

                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-lg">{record.type}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(record.data), "dd 'de' MMMM 'de' yyyy", {
                                    locale: ptBR,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Pending Consecrations */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Pendentes de Consagração</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingConsecrations.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Nenhuma consagração pendente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingConsecrations.map((item, idx) => (
                      <div key={idx} className="bg-muted rounded-lg p-3">
                        <p className="font-medium">{item?.nome}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aguardando: {item?.pendingFor}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinisterialHistory;
