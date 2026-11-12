"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoSupervisorTab({
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
      key="supervisor"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Separado a Supervisão"
      targetMinisterialLevel="Supervisor"
      onListChange={handleListChange}
      onSaveLabel="Consagrar para Supervisor(a)"
      onSaveHint="Ao clicar, os usuários selecionados serão promovidos a Supervisor."
    />
  );
}