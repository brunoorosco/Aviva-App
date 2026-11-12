// components/consagracoes/ConsagracaoAuxiliarTab.tsx
"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoAuxiliarTab({
  churchId,
  consagracaoId,
  initialUsers,
  onListChange,
}: {
  churchId: string;
  consagracaoId: string;
  initialUsers: any;
  onListChange?: (list: TempUserToAdd[]) => void;
}) {
  const handleListChange = useCallback(
    (list: TempUserToAdd[]) => {
      onListChange?.(list);
    },
    [onListChange],
  );

  return (
    <UserSelectForm
      key="auxiliar"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Membro"
      targetMinisterialLevel="Auxiliar"
      onListChange={handleListChange}
      onSaveLabel="Consagrar Auxiliares"
      onSaveHint="Ao clicar, os usuários selecionados serão promovidos a Auxiliar."
    />
  );
}