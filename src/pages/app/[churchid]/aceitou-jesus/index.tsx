"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Masks } from "@/utils/masks";
import { SelectCem } from "@/components/Select/SelectCem";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/Toast";
import { useHttpPost } from "@/hooks/api";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  cem: string;
  accepted: string;
  baptism: string;
  acceptedAt: string;
  description?: string;
  encontro?: string;
  hasEncontro?: string;
};

const AceitouJesus = () => {
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
      acceptedAt: dataRetroISO,
      name: "",
      email: "",
      baptism: "false",
      accepted: "false",
      hasEncontro:"false",
      cem: "",
      description: "",
      phone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/aceitou`,
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
      setError("Erro ao enviar o formulário");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center p-3 mt-5 md:mt-5">
      <div className="content-center w-full max-w-lg text-center">
        <Label className="text-2xl md:text-3xl dark:text-dark-primary">Aceitou Jesus</Label>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-lg mt-5 px-2 flex flex-col gap-4">
        {/* Data Aceitou */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Data do Ocorrido */}
          <div className="col-span-1">
            <Controller
              name="acceptedAt"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Label>Data do Ocorrido</Label>
                  <Input {...field} type="date" />
                </div>
              )}
            />
          </div>

          {/* Checkbox + Campo do Encontro */}
          <div className="col-span-1 md:col-span-2">
            <Controller
              name="hasEncontro"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-2">
                  {/* Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasEncontro"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 accent-blue-600 cursor-pointer"
                    />
                    <Label htmlFor="hasEncontro">Encontro</Label>
                  </div>

                  {/* Campo de número do encontro */}
                  <Controller
                    name="encontro"
                    control={control}
                    render={({ field: encontroField }) => (
                      <Input
                        {...encontroField}
                        placeholder="Nº do Encontro"
                        className="w-full"
                        disabled={!field.value}
                      />
                    )}
                  />
                </div>
              )}
            />
          </div>
        </div>

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
        <SelectCem name="cem" control={control} churchId={churchId} title="Escolha uma Rede" />

        <Controller
          name="accepted"
          control={control}
          defaultValue="false"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label>Tipo de decisão</Label>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-10"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="true" id="r1" />
                  <Label htmlFor="r1">Reconciliou</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="false" id="r2" />
                  <Label htmlFor="r2">Aceitou</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        />

        <Controller
          name="baptism"
          control={control}
          defaultValue="false"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label>Batizado?</Label>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-10"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="true" id="b1" />
                  <Label htmlFor="b1">Sim</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="false" id="b2" />
                  <Label htmlFor="b2">Não</Label>
                </div>
              </RadioGroup>
            </div>
          )}
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

export default AceitouJesus;
