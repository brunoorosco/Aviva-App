"use client";

import { useCallback } from "react";
import { UserSelectForm } from "./UserSelectForm";
import { TempUserToAdd } from "@/domain/models/ministerial";

export function ConsagracaoPastorTab({
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
      key="pastor"
      churchId={churchId}
      consagracaoId={consagracaoId}
      initialUsers={initialUsers}
      currentMinisterialLevel="Separado a Pastorado"
      targetMinisterialLevel="Pastor"
      onListChange={handleListChange}
      onSaveLabel="Consagrar para Pastor(a)"
      onSaveHint="Ao clicar, os usuários selecionados serão promovidos a Pastor."
      readOnly={readOnly}
    />
  );
}