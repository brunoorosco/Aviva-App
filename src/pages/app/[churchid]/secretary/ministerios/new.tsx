"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { useHttpPost } from "@/hooks/api";
import Toast from "@/components/Toast";
import { Masks } from "@/utils/masks";
import ButtonSubmit from "@/components/ButtonSubmit";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  name: string;
  responsaveis: {
    _id: string;
    name: string;
  }[];
  description?: string;
  membros?: {
    _id: string;
    name: string;
  }[];
};

const NewRede = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await useHttpPost({
        url: `/api/protected/churches/${session?.user.churchId}/ministerios`,
        data,
      });
      setIsLoading(false);

      if (response?.error) {
        Toast.showError("Erro ao Salvar!");
        return;
      }

      Toast.showSuccess("Salvo com Sucesso!");
      router.back();
    } catch (error) {
      setIsLoading(false);
      console.error("[ERROR]:", error);
      Toast.showError("Erro ao salvar");
    }
  });

  return (
    <div className="flex flex-col items-center mt-10 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-dark-primary">
          Cadastro de Ministério
        </h1>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-3xl mt-6 flex flex-col gap-4">
        {/* Nome da Rede */}
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nome do Ministério"
              className="w-full"
              onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
            />
          )}
        />

        {/* Logradouro e Número */}
        <div className="flex flex-col md:flex-row gap-4">
          <Controller
            name="responsaveis"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Lideres"
                className="w-full md:w-2/3"
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Descrição"
                className="w-full"
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </div>

        {/* Botão */}
        <div className="w-full">
          <ButtonSubmit text="Salvar" type="submit" disabled={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default NewRede;
