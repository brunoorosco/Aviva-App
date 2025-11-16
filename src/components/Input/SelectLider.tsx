import { Controller } from "react-hook-form";
import { useHttpGet } from "@/hooks/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type Props = {
  name: string;
  control: any;
  title: string;
  churchId: string;
  cargo: string;
  errors?: any;
  isRequired?: boolean;
};
type TInputConsagracao = {
  _id: string;
  name: string;
  cargo: string;
};

export function InputLider({
  control,
  name,
  title,
  churchId,
  cargo,
  errors,
  isRequired = false,
}: Props) {
  const { data, isLoading } = useHttpGet(
    `/api/protected/churches/${churchId}/users/cargo/${cargo}`
  );

  const options = (data?.data ?? []) as TInputConsagracao[];

  return (
    <div className="flex flex-col w-full my-2">
      <label className="mb-1 font-medium">{title}</label>

      <Controller
        name={name}
        control={control}
        rules={isRequired ? { required: "Selecione uma opção" } : {}}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isLoading} // 🔥 DESABILITA DURANTE O LOADING
          >
            <SelectTrigger className="w-full capitalize">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando...
                </div>
              ) : (
                <SelectValue placeholder="Selecione" />
              )}
            </SelectTrigger>

            <SelectContent >
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Carregando...
                </SelectItem>
              ) : options?.length === 0 ? (
                <SelectItem value="none" disabled>
                  Nenhum registro encontrado
                </SelectItem>
              ) : (
                options?.map((item: TInputConsagracao) => (
                  <SelectItem key={item._id} value={item._id} className='capitalize'>
                    {item.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />

      {errors?.[name] && (
        <p className="mt-2 text-sm text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
