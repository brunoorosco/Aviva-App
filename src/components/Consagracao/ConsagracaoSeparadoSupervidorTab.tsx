"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoSeparadoSupervisorTab({
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
      key="separado-supervisor"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Lider"
      targetMinisterialLevel="Separado a Supervisão"
      onListChange={handleListChange}
      onSaveLabel="Separar para Supervisão"
      onSaveHint="Ao clicar, os usuários selecionados serão separados para Supervisão."
    />
  );
}