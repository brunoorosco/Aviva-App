"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2, Plus, X } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { ROLES } from "@/lib/permissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import { SelectMembrosRede } from "@/components/Select/SelectMembrosRede";
import { TCems } from "@/domain/models/cems";

type FormValues = {
  casas: TCems[];
  data_inicial: string;
};

const NovaCem = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      casas: [],
      data_inicial: new Date().toISOString().split("T")[0],
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove, prepend } = useFieldArray({ control, name: "casas" }); // ← adiciona prepend
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();
  const casas = watch("casas");

  const canEditRede = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA]);
  const defaultRede = session?.user?.cem?.name || "";

  const churchId = session?.user?.churchId || "";
  const cemId = session?.user?.cem?._id || "";

  // ↓ Usa prepend em vez de append - adiciona no topo
  const handleAddCasa = () => {
    prepend({
      lider1: { name: "", _id: "" },
      lider2: { name: "", _id: "" },
      endereco: "",
      rede: canEditRede ? "" : defaultRede,
      anfitria: "",
      telefone: "",
      _id: "",
    });
  };

  const handleImport = (imported: TCems[]) => {
    fields.forEach((_, index) => remove(index));
    imported.forEach((casa) => {
      append({
        ...casa,
        rede: canEditRede ? casa.rede : defaultRede,
      });
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!data.casas || data.casas.length === 0) {
      Toast.showError("Adicione pelo menos uma Casa de Paz antes de salvar!");
      return;
    }

    setIsLoading(true);
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/cems`,
      data,
    });
    setIsLoading(false);

    if (response?.error) {
      Toast.showError("Erro ao salvar Cem's!");
    } else {
      Toast.showSuccess("Cem's cadastradas com sucesso!");
      router.back();
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl mt-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Nova Cem's</h1>

        <div className="flex flex-row sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <Label className="mb-1">Data Inicial</Label>
            <Controller
              name="data_inicial"
              control={control}
              render={({ field }) => <Input {...field} type="date" className="w-full sm:w-auto" />}
            />
          </div>
        </div>
      </div>

      {/* ↓ Botões de ação movidos para cima */}
      <div className="flex flex-col sm:flex-row gap-2 justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>

        <Button type="button" onClick={handleAddCasa} className="w-full sm:w-auto bg-blue-500">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cem's
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isLoading || !casas || casas.length === 0}
          className="bg-[#04AA6D] hover:bg-[#04AA6D]/90 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Cem's"
          )}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {fields.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4 text-center">Nenhuma Cem's adicionada ainda</p>
              <Button
                type="button"
                onClick={handleAddCasa}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Cem's
              </Button>
            </CardContent>
          </Card>
        ) : (
          fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Label className="mb-2">Líder 1 *</Label>
                      <Controller
                        name={`casas.${index}.lider1`}
                        control={control}
                        render={({ field }) => (
                          <SelectMembrosRede
                            title="Selecionar Líder 1"
                            churchId={churchId}
                            cemId={cemId}
                            value={field.value?._id ?? ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Líder 2/Auxiliar</Label>
                      <Controller
                        name={`casas.${index}.lider2`}
                        control={control}
                        render={({ field }) => (
                          <SelectMembrosRede
                            title="Selecionar Líder 2"
                            churchId={churchId}
                            cemId={cemId}
                            value={field.value?._id ?? ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">
                        Rede *
                        {!canEditRede && (
                          <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">
                            (automático)
                          </span>
                        )}
                      </Label>
                      <Controller
                        name={`casas.${index}.rede`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nome da Rede"
                            disabled={!canEditRede}
                            className={!canEditRede ? "bg-gray-100 dark:bg-gray-500 cursor-not-allowed" : ""}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Label className="mb-2">Anfitriã</Label>
                      <Controller
                        name={`casas.${index}.anfitria`}
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Nome da anfitriã" />}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Telefone</Label>
                      <Controller
                        name={`casas.${index}.telefone`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="(00) 00000-0000" type="tel" />
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-2">Endereço</Label>
                      <Controller
                        name={`casas.${index}.endereco`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Rua, número, bairro" />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover Cem's
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </form>
    </div>
  );
};

export default NovaCem;
