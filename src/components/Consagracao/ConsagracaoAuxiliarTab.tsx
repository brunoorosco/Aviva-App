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
  readOnly = false,
}: {
  churchId: string;
  consagracaoId: string;
  initialUsers: any;
  onListChange?: (list: TempUserToAdd[]) => void;
  readOnly?: boolean;
}) {
  const handleListChange = useCallback(
    (list: TempUserToAdd[]) => {
      if (readOnly) return;
      onListChange?.(list);
    },
    [onListChange, readOnly],
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
      readOnly={readOnly}
    />
  );
}