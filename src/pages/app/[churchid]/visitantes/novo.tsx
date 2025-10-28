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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type FormValues = {
  name: string;
  phone?: string;
  description?: string;
  visitedAt: string;
  howHeard?: string;
  invitedBy?: string;
  region?: string;
};

const VisitantesPage = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const router = useRouter()

  const dataRetroISO = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      visitedAt: dataRetroISO,
      name: "",
      phone: "",
      description: "",
      howHeard: "",
      invitedBy: "",
      region: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const howHeardValue = watch("howHeard");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsLoading(true);
      const response = await useHttpPost({
        url: `/api/protected/churches/${churchId}/visitantes`,
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
        {/* Data da Visita */}
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

        {/* Região / Localização */}
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input {...field} placeholder="Região / Localização" />
            </div>
          )}
        />

        {/* Como nos conheceu (shadcn Select) */}
        <Controller
          name="howHeard"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
                  <SelectValue placeholder="Como nos Conheceu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="invited">Alguém convidou</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Input para quem convidou */}
        {howHeardValue === "invited" && (
          <Controller
            name="invitedBy"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input {...field} placeholder="Nome da pessoa que convidou?" />
              </div>
            )}
          />
        )}

        {/* Observações / Descrição */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <Textarea {...field} placeholder="Descrição" />
            </div>
          )}
        />

        {/* Botão */}
        <div className="flex w-full mt-4 gap-4">
          <Button type="button" className="w-full " variant="outline" onClick={()=> router.back() }>
            Voltar
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VisitantesPage;
