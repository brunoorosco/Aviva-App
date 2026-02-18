"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImportButton from "../../../../../components/encontroComDeus/ImportButton";
import { useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus, Trash2, Users } from "lucide-react";
import { CardContent, Card } from "@/components/ui/card";
import { TPeople } from "@/domain/models/encontroComDeus";
import { SelectCem } from "@/components/Select/SelectCem";

type FormValues = {
  encontristas: TPeople[];
  data: string;
  igreja: string;
  numero?: number;
};

const NovoEncontroComDeus = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      encontristas: [],
      data: new Date().toISOString().split("T")[0],
      igreja: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "encontristas" });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const encontristas = watch("encontristas");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const churchId = session?.user.churchId as string;

  const onSubmit = handleSubmit(async (data) => {
    if (!data.encontristas?.length) {
      Toast.showError("Adicione pelo menos um encontrista!");
      return;
    }
    setIsLoading(true);
    const response = await useHttpPost({
      url: `/api/protected/churches/${churchId}/encontroComDeus`,
      data,
    });
    setIsLoading(false);
    if (response?.error) Toast.showError("Erro ao salvar!");
    else {
      Toast.showSuccess("Cadastrado com sucesso!");
      router.back();
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-secondary/50 p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-200">
            Encontro com Deus
          </h1>
          <p className="text-muted-foreground">
            Gerencie os participantes e informações do encontro.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs uppercase font-bold text-slate-500 dark:text-gray-200">
                Data
              </Label>
              <Controller
                name="data"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" className="h-9 dark:border-gray-400 " />
                )}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase font-bold text-slate-500  dark:text-gray-200">
                Edição/Nº
              </Label>
              <Controller
                name="numero"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="00"
                    className="h-9 dark:border-gray-400"
                  />
                )}
              />
            </div>
          </div>
          <div className="self-end">
            <ImportButton
              inputFileRef={inputFileRef}
              onImport={(imported) => imported.forEach((c) => append(c))}
            />
          </div>
        </div>
      </div>

      {/* LISTA DE ENCONTRISTAS */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
            Participantes ({fields.length})
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-orange-900/30  dark:border-orange-500 dark:text-orange-500"
            onClick={() =>
              append({
                nome: "",
                telefone: "",
                email: "",
                rede: "",
                endereco: "",
                idade: "",
                isento: false,
              })
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar Manualmente
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50/50 dark:bg-dark-secondary/30">
            <Users className="mx-auto h-12 w-12 text-slate-300 " />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhum encontrista</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-300">
              Comece importando uma lista ou adicionando manualmente.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="overflow-hidden border-slate-200 hover:border-blue-300 transition-colors"
            >
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <Label className="text-xs">Nome Completo</Label>
                    <Controller
                      name={`encontristas.${index}.nome`}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Ex: João Silva" />}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-xs">Idade</Label>
                    <Controller
                      name={`encontristas.${index}.idade`}
                      control={control}
                      render={({ field }) => <Input {...field} type="number" />}
                    />
                  </div>
                  {/* <div className="md:col-span-2">
                    <Label className="text-xs">Rede</Label>
                    <Controller
                      name={`encontristas.${index}.rede`}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Rede" />}
                    />
                  </div> */}
                  <div className="md:col-span-2">
                    <Label className="text-xs">Rede</Label>
                    <Controller
                      name={`encontristas.${index}.rede`}
                      control={control}
                      render={({ field }) => (
                        <SelectCem {...field} title="Rede" churchId={churchId} control={control} />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Telefone</Label>
                    <Controller
                      name={`encontristas.${index}.telefone`}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="(00) 00000-0000" />}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Endereço</Label>
                    <Controller
                      name={`encontristas.${index}.endereco`}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Rua, Bairro..." />}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FOOTER DE AÇÕES */}
        {fields.length > 0 && (
          <div className="sticky bottom-6 flex justify-end gap-4 bg-white/80 dark:bg-dark-secondary/30 backdrop-blur-md p-4 rounded-2xl border shadow-lg">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Finalizar Cadastro"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NovoEncontroComDeus;
