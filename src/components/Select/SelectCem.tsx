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
  const required = isRequired ? { required: "Selecione uma Rede" } : {};
  return (
    <div className="flex flex-col w-full">
      <Controller
        name={name}
        control={control}
        rules={required}
        render={({ field }) => {
          return (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
                <SelectValue placeholder={title} />
              </SelectTrigger>
              <SelectContent>
                {isLoading && <Loading />}
                {!isLoading &&
                  items.map((item: any) => (
                    <SelectItem key={item._id} value={`${item._id}-${item.name}`}>
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
