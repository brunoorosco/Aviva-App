"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Baby,
  Loader2,
  Plus,
  Trash2,
  ShieldAlert,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectCem } from "@/components/Select/SelectCem";
import { getRedeName } from "@/utils/helpersNameREde";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Toast from "@/components/Toast";
import { hasCriancaAccess } from "@/lib/hasCriancaAccess";
import { TCursoCrianca } from "@/domain/models/apresentacao";
import { useCultoSettings } from "@/hooks/useCultoSettings";
import { isSunday } from "@/utils/date";

type FormItem = {
  nomeCrianca: string;
  nomePai: string;
  nomeMae: string;
  rede: { _id: string; name: string };
};

type FormValues = {
  dataCurso: string;
  dataApresentacao: string;
  horario: "manha" | "noite";
  items: FormItem[];
};

const EMPTY_ITEM: FormItem = {
  nomeCrianca: "",
  nomePai: "",
  nomeMae: "",
  rede: { _id: "", name: "" },
};

function formatBR(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR");
}

export default function ApresentacaoCriancaPage() {
  const { data: session } = useSession();
  const isAdmin = hasCriancaAccess(session);
  // @ts-ignore
  const churchId = (session?.user?.churchId || "").toString();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<TCursoCrianca | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cursos, setCursos] = useState<TCursoCrianca[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(true);

  const { cultoDomingo } = useCultoSettings(churchId || undefined);
  const [formPreviewDate, setFormPreviewDate] = useState<string>("");
  const fixedHorario =
    isSunday(formPreviewDate) && cultoDomingo !== "manha_e_noite"
      ? cultoDomingo
      : null;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      dataCurso: "",
      dataApresentacao: "",
      horario: "manha",
      items: [{ ...EMPTY_ITEM }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const dataPreview = watch("dataApresentacao");
  const dataCursoPreview = watch("dataCurso");

  React.useEffect(() => setFormPreviewDate(dataPreview || ""), [dataPreview]);

  // Mantém o valor do form em sync quando o campo fica fixado por config
  // (domingo + cultoFixo). Se o dia não é mais domingo/fixo, não sobrescreve
  // o que o usuário escolher.
  React.useEffect(() => {
    if (fixedHorario) {
      setValue("horario", fixedHorario);
    }
  }, [fixedHorario, setValue]);

  const dateOrderError = useMemo(() => {
    if (!dataCursoPreview || !dataPreview) return null;
    const c = new Date(dataCursoPreview + "T00:00:00").getTime();
    const a = new Date(dataPreview + "T00:00:00").getTime();
    if (a <= c) return "A data da apresentação deve ser depois da data do curso";
    return null;
  }, [dataCursoPreview, dataPreview]);

  const loadCursos = async () => {
    if (!churchId) return;
    setLoadingCursos(true);
    try {
      const res = await fetch(`/api/protected/churches/${churchId}/secretary/apresentacao-crianca`);
      if (!res.ok) throw new Error((await res.json()).error || "Erro");
      const data = await res.json();
      setCursos(Array.isArray(data) ? (data as TCursoCrianca[]) : []);
    } catch (e: any) {
      console.error(e);
      Toast.showError("Erro ao carregar cursos");
    } finally {
      setLoadingCursos(false);
    }
  };

  React.useEffect(() => {
    if (isAdmin) loadCursos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, churchId]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex-1 w-full">
        <main className="w-full max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Acesso restrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta página é exclusiva para administradores (admin / bispo) ou
                usuários com a permissão
                <code className="mx-1 px-1 py-0.5 rounded bg-muted text-xs">
                  apresentacao_crianca
                </code>.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    if (dateOrderError) {
      Toast.showError(dateOrderError);
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(
        `/api/protected/churches/${churchId}/secretary/apresentacao-crianca`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataCurso: data.dataCurso,
            dataApresentacao: data.dataApresentacao,
            horario: data.horario,
            items: data.items.map((it) => ({
              nomeCrianca: it.nomeCrianca,
              nomePai: it.nomePai || undefined,
              nomeMae: it.nomeMae,
              rede: it.rede,
            })),
          }),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Erro ao salvar");
      setDialogOpen(false);
      reset();
      Toast.showSuccess(
        `Curso salvo. ${(body.gerados || []).length} apresentações geradas.`
      );
      loadCursos();
    } catch (e: any) {
      Toast.showError(e.message || "Erro ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!deleting) return;
    setIsRemoving(true);
    try {
      const res = await fetch(
        `/api/protected/churches/${churchId}/secretary/apresentacao-crianca/${deleting._id}`,
        { method: "DELETE" }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Erro ao remover");
      Toast.showSuccess(
        `Curso removido. ${body.removed?.criancas ?? 0} crianças apagadas.`
      );
      setDeleting(null);
      loadCursos();
    } catch (e: any) {
      Toast.showError(e.message || "Erro ao remover");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background mt-6 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-3">
            <Baby className="w-6 h-6 text-orange-500" />
            Apresentação de Crianças
          </h1>
          <p className="text-slate-500 dark:text-gray-300">
            Registre a data do curso e as crianças; a apresentação entra
            automaticamente na listagem geral.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 dark:bg-orange-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Novo curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Novo curso de apresentação de crianças
              </DialogTitle>
              <DialogDescription>
                A data do curso é sempre anterior à da apresentação. As
                crianças são adicionadas automaticamente na listagem
                de apresentações na data escolhida.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 pt-2"
            >
              {/* DATAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Data do Curso <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    {...(control as any).register("dataCurso", {
                      required: true,
                      setValueAs: (v: string) => v,
                    })}
                  />
                  {errors.dataCurso && (
                    <p className="text-sm text-red-500">
                      {errors.dataCurso.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    Data da Apresentação <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="dataApresentacao"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                        min={dataCursoPreview || undefined}
                      />
                    )}
                  />
                  {errors.dataApresentacao && (
                    <p className="text-sm text-red-500">
                      {errors.dataApresentacao.message as string}
                    </p>
                  )}
                </div>
              </div>
              {dateOrderError && (
                <p className="text-sm text-red-500">{dateOrderError}</p>
              )}

{/* HORÁRIO */}
               <div className="space-y-2">
                 <Label>Horário do Culto</Label>
                 {fixedHorario ? (
                   <Controller
                     control={control}
                     name="horario"
                     render={({ field }) => (
                       <Input
                         value={
                           field.value === "manha"
                             ? "Manhã"
                             : "Noite"
                         }
                         disabled
                       />
                     )}
                   />
                 ) : (
                  <Controller
                    control={control}
                    name="horario"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">Manhã</SelectItem>
                          <SelectItem value="noite">Noite</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>

              {/* ITENS */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Crianças
                </h3>

                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg border bg-white/50 dark:bg-dark-secondary"
                  >
                    <div className="md:col-span-2 space-y-2">
                      <Label>Criança ({idx + 1})</Label>
                      <div className="relative">
                        <Input
                          placeholder="Nome completo da criança"
                          {...(control as any).register(`items.${idx}.nomeCrianca`, {
                            required: "Nome obrigatório",
                          })}
                        />
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full w-10 text-red-500 hover:text-red-600"
                            onClick={() => remove(idx)}
                            aria-label="Remover criança"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {errors.items?.[idx]?.nomeCrianca && (
                        <p className="text-sm text-red-500">
                          {
                            (
                              errors.items[idx] as any
                            )?.nomeCrianca?.message as string
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Pai</Label>
                      <Input
                        placeholder="Nome do pai (opcional)"
                        {...(control as any).register(`items.${idx}.nomePai`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Mãe <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Nome da mãe"
                        {...(control as any).register(`items.${idx}.nomeMae`, {
                          required: "Nome da mãe obrigatório",
                        })}
                      />
                      {errors.items?.[idx]?.nomeMae && (
                        <p className="text-sm text-red-500">
                          {
                            (errors.items[idx] as any)?.nomeMae
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>
                        Rede <span className="text-red-500">*</span>
                      </Label>
                      <SelectCem
                        control={control}
                        name={`items.${idx}.rede`}
                        title="Selecione a rede"
                        churchId={churchId}
                        errors={errors as any}
                        isRequired
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append({ ...EMPTY_ITEM })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar criança
                </Button>
              </div>

 <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-2" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Baby className="w-4 h-4" />
                    )}
                    {isSaving ? "Salvando..." : "Salvar curso"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTAGEM DE CURSOS */}
      <div className="grid gap-4">
        {loadingCursos ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cursos.length === 0 ? (
          <div className="text-center p-8 text-slate-500 bg-white dark:bg-dark-secondary rounded-lg border border-dashed">
            Nenhum curso registrado ainda.
          </div>
        ) : (
          cursos.map((curso) => (
            <Card key={curso._id}>
              <CardHeader className="bg-slate-50/50 dark:bg-dark-secondary">
                <CardTitle className="flex items-center gap-3">
                  <Baby className="w-5 h-5 text-orange-500" />
                  <span className="capitalize">
                    {curso.horario === "manha"
                      ? "Manhã"
                      : "Noite"}
                  </span>
                  <span className="text-muted-foreground font-normal">
                    · {curso.items.length} criança(s)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs uppercase text-slate-400">Curso</span>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatBR(curso.dataCurso)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase text-slate-400">
                      Apresentação
                    </span>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatBR(curso.dataApresentacao)}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <span className="text-xs uppercase text-slate-400">
                      Cadastro por
                    </span>
                    <p>{curso.criadoPor?.name || "—"}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <span className="text-xs uppercase text-slate-400 block mb-3">
                    Crianças
                  </span>
                  {curso.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-2 rounded border bg-white/40 dark:bg-dark-secondary/40"
                    >
                      <span className="font-medium">
                        {it.nomeCrianca}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {it.nomePai && `${it.nomePai} · `}
                        {it.nomeMae} · {getRedeName(it.rede) || ''}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setDeleting(curso)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover curso
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleRemove}
        isLoading={isRemoving}
        title="Remover curso?"
        description={
          deleting
            ? `Isso vai apagar o curso do dia ${formatBR(
                deleting.dataCurso
              )} e ${deleting.items.length} crianças da listagem de apresentações. Essa ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </div>
  );
}