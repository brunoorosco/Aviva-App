"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHttpGet } from "@/hooks/api";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { useMemo } from "react";

type TBatizando = {
  _id: string;
  name: string;
  batizado?: boolean;
  sexo?: string;
};

type Props = {
  churchId: string;
  redeId: string;
  placeholder?: string;
  value?: string;
  excludeIds?: string[];
  onChange: (member: { _id: string; name: string; sexo?: string }) => void;
};

export default function SelectBatizando({
  churchId,
  redeId,
  placeholder = "Selecione o membro",
  value,
  excludeIds = [],
  onChange,
}: Props) {
  const { data } = useHttpGet<TBatizando[]>(
    `/api/protected/churches/${churchId}/redes/${redeId}/equipe`
  );

  const items = data?.data ?? [];

  const eligible = useMemo(
    () =>
      items.filter(
        (m) =>
          !m.batizado &&
          !excludeIds.includes(m._id)
      ),
    [items, excludeIds]
  );

  const handleChange = (id: string) => {
    const member = items.find((m) => m._id === id);
    if (member) {
      onChange({ _id: member._id, name: member.name, sexo: member.sexo });
    }
  };

  return (
    <Select value={value || ""} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {eligible.length === 0 ? (
          <SelectItem value="__nenhum__" disabled>
            Nenhum membro disponível
          </SelectItem>
        ) : (
          eligible.map((member) => (
            <SelectItem key={member._id} value={member._id}>
              {capitalizeWords(member.name)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}