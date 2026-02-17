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
import { useEffect, useRef } from "react";
import { capitalizeWords } from "@/utils/capitalizaFirst";

type DropdownProps = {
  title: string;
  churchId: string;
  cemId: string;
  value?: { _id: string; name: string } | string;
  onChange?: (value: { _id: string; name: string }) => void;
  onDataLoaded?: (data: any[]) => void;
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
    `/api/protected/churches/${churchId}/redes/${cemId}/equipe`,
  );
  const items = data?.data ?? [];
console.log('data :>> ', data);
  // ↓ Ref sempre atualizado com a lista mais recente
  const itemsRef = useRef<any[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!isLoading && items.length > 0 && onDataLoaded) {
      onDataLoaded(items);
    }
  }, [items, isLoading]);

  const selectedId = typeof value === "object" ? value?._id : value;

  const handleChange = (id: string) => {
    // ↓ Usa o ref em vez de items direto — nunca vai estar vazio
    const membro = itemsRef.current.find((item) => item._id === id);
    if (onChange) {
      onChange({
        _id: id,
        name: membro?.name || "",
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Select onValueChange={handleChange} value={selectedId}>
        <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          {isLoading && <Loading />}
          {!isLoading &&
            items.map((item: any) => (
              <SelectItem key={item._id} value={item._id}>
                {capitalizeWords(item.name)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}