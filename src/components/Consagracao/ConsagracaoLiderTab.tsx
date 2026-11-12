"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoLiderTab({
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
      key="lider"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Auxiliar"
      targetMinisterialLevel="Lider"
      onListChange={handleListChange}
      onSaveLabel="Consagrar para Líder"
      onSaveHint="Ao clicar, os usuários selecionados serão promovidos a Líder."
    />
  );
}