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
import { useEffect, useRef, useMemo } from "react";
import { capitalizeWords } from "@/utils/capitalizaFirst";

type DropdownProps = {
  title: string;
  churchId: string;
  cemId: string;
  value?: { _id: string; name: string } | string;
  onChange?: (value: { _id: string; name: string }) => void;
  onDataLoaded?: (data: any[]) => void;
  error?: string;
  excludeIds?: string[];
};

export function SelectMembrosRede({
  title,
  churchId,
  cemId,
  value,
  onChange,
  onDataLoaded,
  error,
  excludeIds,
}: DropdownProps) {
  const { data, isLoading } = useHttpGet<any[]>(
    `/api/protected/churches/${churchId}/redes/${cemId}/equipe`,
  );
  const items = data?.data ?? [];
  // ↓ Ref sempre atualizado com a lista mais recente
  const itemsRef = useRef<any[]>([]);
  
  const filteredItems = useMemo(() => {
    if (!excludeIds || excludeIds.length === 0) return items;
    return items.filter((item: any) => !excludeIds.includes(item._id));
  }, [items, excludeIds]);

  useEffect(() => {
    itemsRef.current = filteredItems;
  }, [filteredItems]);

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
            filteredItems.map((item: any) => (
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