import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useHttpGet } from "@/hooks/api";
import Loading from "./loading";
import { useRef, useEffect } from "react";

type DropdownProps = {
  name: string;
  control: Control<any>;
  title: string;
  churchId: string;
  errors?: FieldErrors;
  isRequired?: boolean;
};

export function SelectCem({
  control,
  name,
  title,
  churchId,
  errors,
  isRequired = false,
}: DropdownProps) {
  const { data, isLoading } = useHttpGet<any[]>(`/api/protected/churches/${churchId}/redes`);
  const items = data?.data ?? [];
  const itemsRef = useRef<any[]>([]);

  // Mantém referência atualizada dos items
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const required = isRequired ? { required: "Selecione uma Rede" } : {};

  return (
    <div className="flex flex-col w-full">
      <Controller
        name={name}
        control={control}
        rules={required}
        render={({ field }) => {
          // Extrai o _id do valor (pode ser objeto ou string antiga "id-nome")
          const selectedId = typeof field.value === 'object' && field.value?._id
            ? field.value._id
            : typeof field.value === 'string'
            ? field.value.split('-')[0] // suporta formato antigo
            : '';

          // Quando seleciona, busca o objeto completo e retorna { _id, name }
          const handleChange = (id: string) => {
            const rede = itemsRef.current.find((r) => r._id === id);
            if (rede && field.onChange) {
              field.onChange({ _id: rede._id, name: rede.name });
            }
          };

          return (
            <Select onValueChange={handleChange} value={selectedId}>
              <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
                <SelectValue placeholder={title} />
              </SelectTrigger>
              <SelectContent>
                {isLoading && <Loading />}
                {!isLoading &&
                  items.map((item: any) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {errors?.[name] && (
        <p className="mt-2 text-sm text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}