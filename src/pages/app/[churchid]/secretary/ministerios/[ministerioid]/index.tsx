"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHttpGet, useHttpPut } from "@/hooks/api";
import Toast from "@/components/Toast";
import { Masks } from "@/utils/masks";
import ButtonSubmit from "@/components/ButtonSubmit";
import { useRouter } from "next/router";

type FormValues = {
  name: string;
  zipcode: string;
  street: string;
  number: string;
  city: string;
  pastor_id?: string;
  supervisor_id?: string;
  description?: string;
};

const EditRede = () => {
  const { control, handleSubmit, reset } = useForm<FormValues>();
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession();
  const [loading, setIsLoading] = useState(false);

  const id = query.cemid;
  const churchid = query.churchid;

  const { data: rede, isLoading } = useHttpGet<FormValues[]>(
    id && churchid ? `/api/protected/churches/${churchid}/cems/${id}` : null
  );

  // 🔹 Atualiza o formulário quando os dados chegarem
  useEffect(() => {
    if (rede?.data[0]) {
      reset(rede.data[0]); // <-- isso preenche todos os campos automaticamente
    }
  }, [rede, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const endpoint = `/api/protected/churches/${session?.user.churchId}/cems${
        id ? `/${id}` : ""
      }`;

      const response = await useHttpPut({
        url: endpoint,
        data,
      });

      if (response?.error) {
        Toast.showError("Erro ao salvar!");
        return;
      }

      Toast.showSuccess(id ? "Atualizado com sucesso!" : "Salvo com sucesso!");
      router.back();
    } catch (error) {
      console.error("[ERROR]:", error);
      Toast.showError("Erro ao salvar");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-dark-primary">
          Editar Rede
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-3xl mt-6 flex flex-col gap-4"
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nome da Rede"
              className="uppercase w-full"
              onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
            />
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Logradouro"
                className="uppercase w-full md:w-2/3"
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nº"
                className="uppercase w-full md:w-1/3"
              />
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Cidade"
                className="uppercase w-full md:w-2/3"
                onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
              />
            )}
          />
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="CEP"
                className="w-full md:w-1/3"
                onChange={(e) => field.onChange(Masks.cep(e.target.value))}
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

        <div className="w-full">
          <ButtonSubmit
            text={id ? "Atualizar" : "Salvar"}
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditRede;
