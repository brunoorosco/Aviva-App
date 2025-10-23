import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Award,
  BookOpen,
  Calendar,
  Edit,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  UserIcon,
  Users,
  Waves,
} from "lucide-react";
import { User as UserModel } from "@/domain/models/users";
import { formatAddress } from "@/utils/formaatAddress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "@radix-ui/react-label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { User } from "@/domain/models/users";
import EditMemberModal from "@/components/Member/EditMemberModal";
import {
  ministerialLevels,
  TMinisterialLevel,
  TMinisterialRecord,
} from "@/domain/models/ministerial";
import { capitalizeWords } from "@/utils/capitalizaFirst";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("");

type Props = {
  member: UserModel;
};

export const MemberCard = ({ member }: Props) => {
  const programs = [
    { key: "encontroComDeus", label: "Encontro com Deus", icon: Heart },
    { key: "reencontroComDeus", label: "Reencontro com Deus", icon: Heart },
    { key: "sejaLivre", label: "Seja Livre", icon: Shield },
    { key: "batizado", label: "Batizado", icon: Waves },
    { key: "discipulado", label: "Discipulado", icon: BookOpen },
    { key: "cae", label: "C.A.E", icon: Users },
  ];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<TMinisterialLevel>("Auxiliar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const handleAddRecord = () => {
    if (!selectedPersonId) return;

    const newRecord: TMinisterialRecord = {
      data: format(selectedDate, "yyyy-MM-dd"),
      type: selectedLevel,
    };

    // setHistories(
    //   histories.map((h) =>
    //     h._id === selectedPersonId
    //       ? {
    //           ...h,
    //           consagracao: [...h.consagracao, newRecord].sort((a, b) =>
    //             a.data.localeCompare(b.data)
    //           ),
    //         }
    //       : h
    //   )
    // );

    setIsAddDialogOpen(false);
    setSelectedPersonId("");
  };

  function handleModal() {
    setShowEditModal(true)
  }

  return (
    <div className="space-y-4">
      {showEditModal && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          onUpdated={() => {}}
        />
      )}

      {/* Header Card */}
      <Card className="shadow-soft border-0">
        <CardContent className="py-6 px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 shadow-card">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="text-xl bg-orange-400 text-primary-foreground">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -top-8 -left-4 w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 bg-transparent"
                onClick={handleModal}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-soft">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{capitalizeWords(member.name)}</h1>
              <Badge variant="secondary">{member.active ? "Membro Ativo" : "Membro Inativo"}</Badge>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
                {member.birthDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(member.birthDate, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">{formatAddress(member)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout com duas colunas: A/B à esquerda, C à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da esquerda (A e B empilhados) */}
        <div className="lg:col-span-2 space-y-6">
          {/* A - Trilho Ministerial */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Trilho Ministerial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-2 py-4 rounded-lg bg-secondary/50"
                  >
                    <Icon className="w-5 h-5 text-blue-600" />
                    <StatusBadge status={member[key as keyof UserModel] as boolean} label={label} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* B - Escola de Profeta */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Escola de Profeta
                {member.escolaProfeta && (
                  <Badge className="ml-2 bg-palette-success text-black">Participante</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.escolaProfeta ? (
                <div className="space-y-3">
                  {member.historicoEscolaProfeta && member.historicoEscolaProfeta.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <div className="space-y-3">
                          <AccordionTrigger>
                            <h4 className="font-semibold text-foreground">Módulos Cursados</h4>
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-4 text-balance">
                            {member.historicoEscolaProfeta.map((module) => (
                              <div
                                key={module.curso_id}
                                className="flex items-center justify-between p-4 bg-accent-light rounded-lg border border-accent/20"
                              >
                                <div className="space-y-1">
                                  <h5 className="font-medium text-foreground">
                                    {module.cursoName}
                                  </h5>
                                </div>
                                <StatusBadge
                                  status={module.status === "APROVADO"}
                                  label={module.status === "APROVADO" ? "Aprovado" : "Reprovado"}
                                  variant="module"
                                />
                              </div>
                            ))}
                          </AccordionContent>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum módulo cursado ainda</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Não participa da Escola de Profeta</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* C - Coluna lateral (Evolução Ministerial) */}
        <div>
          <Card key={member._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Evolução Ministerial</CardTitle>
                <Dialog
                  open={isAddDialogOpen && selectedPersonId === member._id}
                  onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (open) setSelectedPersonId(member._id);
                    else setSelectedPersonId("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setSelectedPersonId(member._id)}>
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
                          onValueChange={(value) => setSelectedLevel(value as TMinisterialLevel)}
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
              {member.consagracao && member.consagracao.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum histórico registrado
                </p>
              ) : (
                <div className="relative pl-8 space-y-4">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

                  {member.consagracao &&
                    member.consagracao.map((record, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary border-4 border-background" />

                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-lg">{record.ministerialLevel}</p>
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
        </div>
      </div>
    </div>
  );
};
