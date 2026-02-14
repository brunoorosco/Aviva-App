"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useHttpGet } from "@/hooks/api";
import Loading from "./loading";
import { useEffect } from "react";

type DropdownProps = {
  title: string;
  churchId: string;
  cemId: string;
  value?: string;
  onChange?: (value: string) => void;
  onDataLoaded?: (data: any[]) => void; // Nova prop para expor os dados
  error?: string;
};

export function SelectMembrosRede({
  title,
  churchId,
  cemId,
  value,
  onChange,
  onDataLoaded,
  error,
}: DropdownProps) {
  const { data, isLoading } = useHttpGet<any[]>(
    `/api/protected/churches/${churchId}/cems/${cemId}`,
  );
  const items = data?.data ?? [];

  // Expõe os dados quando carregados
  useEffect(() => {
    if (!isLoading && items.length > 0 && onDataLoaded) {
      onDataLoaded(items);
    }
  }, [items, isLoading, onDataLoaded]);

  return (
    <div className="flex flex-col w-full my-2">
      <Select onValueChange={onChange} value={value}>
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
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}