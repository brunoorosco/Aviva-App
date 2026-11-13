"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoSeparadoPastoradoTab({
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
      key="separado-pastorado"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Supervisor"
      targetMinisterialLevel="Separado a Pastorado"
      onListChange={handleListChange}
      onSaveLabel="Separar para Pastorado"
      onSaveHint="Ao clicar, os usuários selecionados serão separados para Pastorado."
      readOnly={readOnly}
    />
  );
}