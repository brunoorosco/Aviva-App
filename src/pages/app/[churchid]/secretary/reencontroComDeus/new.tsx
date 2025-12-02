"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImportButton from "../../../../../components/reencontroComDeus/ImportButton";
import { useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

type TEncontrista = {
  name: string;
  rede: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  idade?: number;
  equipe?: string;
};
type FormValues = {
  reencontristas: TEncontrista[];
  data: string;
  igreja: string;
  numero?: number;
};

const NovoReencontroComDeus = () => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      reencontristas: [],
      data: new Date().toISOString().split("T")[0],
      igreja: "",
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reencontristas",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const encontristas = watch("reencontristas");

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    if (!data.reencontristas || data.reencontristas.length === 0) {
      Toast.showError("Adicione pelo menos uma Casa de Paz antes de salvar!");
      return;
    }

    setIsLoading(true);
    const response = await useHttpPost({
      url: `/api/protected/churches/${session?.user.churchId}/reencontroComDeus`,
      data,
    });
    setIsLoading(false);

    if (response?.error) {
      Toast.showError("Erro ao salvar reencontro com Deus!");
    } else {
      Toast.showSuccess("Reencontro com Deus cadastrado com sucesso!");
      router.back();
    }
  });

  const handleImport = (imported: TEncontrista[]) => {
    fields.forEach((_, index) => remove(index));
    imported.forEach((reencontrista) => append(reencontrista));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Reencontro com Deus</h1>

        <div className="flex items-end gap-2">
          <Controller
            name="data"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Label>Data</Label>
                <Input {...field} type="date" />
              </div>
            )}
          />
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Label>Número</Label>
                <Input {...field} type="number" />
              </div>
            )}
          />

          <ImportButton
            inputFileRef={inputFileRef}
            //@ts-ignore
            onImport={handleImport}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <div>
            <Button
              type="button"
              className="text-white bg-blue-500 rounded "
              onClick={() =>
                append({
                  name: "",
                  telefone: "",
                  email: "",
                  rede: "",
                  endereco: "",
                })
              }
            >
              + Adicionar Encontrista
            </Button>
          </div>
          <div>
            <Button
              className="bg-[#04AA6D] text-white hover:bg-[#04AA6Daa] hover:text-white"
              type="submit"
              disabled={isLoading || !encontristas || encontristas.length === 0}
            >
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </div>
        {fields.reverse().map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-4 p-4 border border-gray-400 rounded-lg bg-gray-50"
          >
            {/* Linha 1: Líder 1, Líder 2, Rede */}
            <div className="flex gap-4 ">
              <div className="w-3/12">
                <Controller
                  name={`reencontristas.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Input {...field} placeholder="Nome do Encontrista" />
                    </div>
                  )}
                />
              </div>
              <div className="w-1/12">
                <Controller
                  name={`reencontristas.${index}.idade`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Input {...field} placeholder="Idade" />
                    </div>
                  )}
                />
              </div>

              <div className="w-1/12">
                <Controller
                  name={`reencontristas.${index}.rede`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Input {...field} placeholder="Rede" />
                    </div>
                  )}
                />
              </div>

              <div className="w-1/12">
                <Controller
                  name={`reencontristas.${index}.telefone`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Input {...field} placeholder="Telefone" />
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  name={`reencontristas.${index}.endereco`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Input {...field} placeholder="Endereço" />
                    </div>
                  )}
                />
              </div>

              <button
                type="button"
                className="px-2 py-1 text-white bg-red-500 rounded"
                onClick={() => remove(index)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default NovoReencontroComDeus;
