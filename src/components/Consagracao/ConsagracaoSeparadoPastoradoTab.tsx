// components/consagracoes/ConsagracaoAuxiliarTab.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserSelectForm } from "./UserSelectForm";
import Toast from "../Toast";
import { TempUserToAdd, TMinisterialLevel } from "@/domain/models/ministerial";
import { useHttpPut } from "@/hooks/api";

export function ConsagracaoSeparadoPastoradoTab({
  churchId,
  consagracaoId,
  initialUsers,
}: {
  churchId: string;
  consagracaoId: string;
  initialUsers: any;
}) {
  const [auxiliaresTempList, setAuxiliaresTempList] = useState<TempUserToAdd[]>(initialUsers ?? []);
  useEffect(() => {
    if (initialUsers) {
      setAuxiliaresTempList(initialUsers);
    }
  }, [initialUsers]);

  const handleAddUser = (user: TempUserToAdd) => {
    setAuxiliaresTempList((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId: string) => {
    setAuxiliaresTempList((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleConsagrarAuxiliares = async () => {
    if (auxiliaresTempList.length === 0) {
      Toast.showError("Nenhum auxiliar selecionado para consagrar.");
      return;
    }

    const payload = auxiliaresTempList.map((user) => ({
      name: user.name,
      rede: user.rede,
      id: user.id,
      role: "Separado a Pastorado" as TMinisterialLevel,
      nextRole: "Pastor" as TMinisterialLevel,
    }));

    try {
      const resp = useHttpPut({
        url: `/api/protected/churches/${churchId}/consagracao/${consagracaoId}`,
        data: payload,
      });

      if (!resp) {
        throw new Error("Falha ao consagrar auxiliares.");
      }

      Toast.showSuccess("Auxiliares consagrados com sucesso!");
    } catch (error: any) {
      Toast.showError(`Erro ao consagrar auxiliares: ${error.message}`);
      console.error("Erro ao consagrar auxiliares:", error);
    }
  };

  return (
    <div className="space-y-6">
      <UserSelectForm
        initialUsers={initialUsers}
        currentMinisterialLevel="Supervisor"
        targetMinisterialLevel="Separado a Pastorado"
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
        tempList={auxiliaresTempList}
        churchId={churchId}
      />
      <Button
        onClick={handleConsagrarAuxiliares}
        className="w-full mt-6 md:w-auto"
        disabled={auxiliaresTempList.length === 0}
      >
        Separar para Supervisão
      </Button>
      <p className="mt-2 text-sm text-gray-500">
        Ao clicar, os usuários selecionados serão promovidos a Auxiliar.
      </p>
    </div>
  );
}
