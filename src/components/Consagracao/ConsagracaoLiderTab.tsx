"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoLiderTab({
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
      key="lider"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Auxiliar"
      targetMinisterialLevel="Lider"
      onListChange={handleListChange}
      onSaveLabel="Consagrar para Líder"
      onSaveHint="Ao clicar, os usuários selecionados serão promovidos a Líder."
      readOnly={readOnly}
    />
  );
}