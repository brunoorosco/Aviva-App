"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Masks } from "@/utils/masks";
import { SelectCem } from "@/components/Select/SelectCem";
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/Toast";
import { useHttpPost } from "@/hooks/api";

type FormValues = {
  name: string;
  email?: string;
  phone?: string;
  cem?: string;
  description?: string;
  visitedAt: string;
};

const VisitantesPage = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;

  const dataRetroISO = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      visitedAt: dataRetroISO,
      name: "",
      email: "",
      cem: "",
      description: "",
      phone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (formData) => {
    console.log("index.tsx:51", formData);
    try {
      setIsLoading(true);
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/visitantes`,
        data: formData,
      });

      if (response?.error) {
        Toast.showError("Erro ao tentar registrar!");
      } else {
        Toast.showSuccess("Registrado com sucesso!");
        reset();
      }
    } catch (err) {
      console.error(err);
      Toast.showError("Erro ao enviar o formulário");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center p-3 mt-5 md:mt-5">
      <div className="content-center w-full max-w-lg text-center">
        <Label className="text-2xl md:text-3xl dark:text-dark-primary">Visitantes</Label>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-lg mt-5 px-2 flex flex-col gap-4">
        {/* Data Aceitou */}
        <Controller
          name="visitedAt"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Label>Data da Visita</Label>
              <Input {...field} type="date" />
            </div>
          )}
        />

        {/* Nome */}
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input
                {...field}
                placeholder="Nome Completo"
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
              {errors.name && <p className="text-sm text-red-400">Preenchimento obrigatório</p>}
            </div>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input {...field} placeholder="E-mail" />
            </div>
          )}
        />

        {/* WhatsApp */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input
                {...field}
                placeholder="WhatsApp"
                onChange={(e) => field.onChange(Masks.phone(e.target.value))}
              />
            </div>
          )}
        />

        {/* Rede / CEM */}
        <SelectCem
          name="cem"
          control={control}
          churchId={churchId}
          title="Veio a convite de alguém"
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Textarea
                {...field}
                placeholder="Descrição"
                onChange={(e) => field.onChange(e.target.value)}
              />
            </div>
          )}
        />

        {/* Botão */}
        <div className="flex w-full mt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VisitantesPage;
