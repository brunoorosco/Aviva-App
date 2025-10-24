"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Masks } from "@/utils/masks";
import { SelectCem } from "@/components/Select/SelectCem";
import RadioInput from "@/components/RadioInput";
import { optionAccepted, optionBapstism } from "@/components/RadioInput/options";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  cem: string;
  accepted: string;
  baptism: boolean;
  acceptedAt: string;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AceitouJesus = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;

  const dataRetroISO = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { acceptedAt: dataRetroISO },
  });

  const { data } = useSWR(`/api/protected/churches/${churchId}/cems`, fetcher);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      setError("");
      console.log("Form Data:", formData);
      // Aqui você faria o POST para salvar os dados
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      setError("Erro ao enviar o formulário");
    }
  });

  return (
    <div className="flex flex-col items-center p-3 mt-5 md:mt-5">
      <div className="content-center w-full max-w-lg text-center">
        <Label className="text-2xl md:text-3xl dark:text-dark-primary">Aceitou Jesus</Label>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-lg mt-5 px-2 flex flex-col gap-4">
        {/* Data Aceitou */}
        <Controller
          name="acceptedAt"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Label>Data Aceitou</Label>
              <Input {...field} type="date" className="" />
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
              <Label>Nome Completo</Label>
              <Input
                {...field}
                placeholder="Nome Completo"
                className="uppercase"
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
              <Label>Email</Label>
              <Input {...field} placeholder="Email" className="lowercase" />
            </div>
          )}
        />

        {/* WhatsApp */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Label>WhatsApp</Label>
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

        <RadioGroup defaultValue="false" name="accept" className="flex gap-10">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="true" id="r1" />
            <Label htmlFor="r1">Reconciliou</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="false" id="r2" />
            <Label htmlFor="r2">Aceitou</Label>
          </div>
        </RadioGroup>

        {/* Batizado? */}
        <Label>Batizado?</Label>
        <RadioGroup defaultValue="false" name="batizado" className="flex gap-10">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="true" id="r1" />
            <Label htmlFor="r1">Sim</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="false" id="r2" />
            <Label htmlFor="r2">Não</Label>
          </div>
        </RadioGroup>

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
