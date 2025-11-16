// components/consagracoes/ConsagracaoAuxiliarTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserSelectForm } from "./UserSelectForm";
import Toast from "../Toast";
import { ConsagracaoPayload, TempUserToAdd, TMinisterialLevel } from "@/domain/models/ministerial";
import { useForm } from "react-hook-form";

export function ConsagracaoSeparadoSupervisorTab({ churchId }: { churchId: string }) {
  const { control } = useForm();
  const [auxiliaresTempList, setAuxiliaresTempList] = useState<TempUserToAdd[]>([]);

  const handleAddUser = (user: TempUserToAdd) => {
    setAuxiliaresTempList((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId: string) => {
    setAuxiliaresTempList((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleConsagrarAuxiliares = async () => {
    if (auxiliaresTempList.length === 0) {
      Toast.showError("Nenhum auxiliar selecionado para consagrar.");
      return;
    }

    const payload: ConsagracaoPayload[] = auxiliaresTempList.map((user) => ({
      userId: user._id,
      targetRole: "Auxiliar" as TMinisterialLevel,
    }));

    try {
      const response = await fetch("/api/consagracao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao consagrar auxiliares.");
      }

      const result = await response.json();
      Toast.showSuccess("Auxiliares consagrados com sucesso!");
      console.log("Consagração de Auxiliares realizada:", result);
      setAuxiliaresTempList([]); // Limpa a lista após consagração
    } catch (error: any) {
      Toast.showError(`Erro ao consagrar auxiliares: ${error.message}`);
      console.error("Erro ao consagrar auxiliares:", error);
    }
  };

  return (
    <div className="space-y-6">
      <UserSelectForm
        currentMinisterialLevel="Lider"
        targetMinisterialLevel="Separado a Supervisão"
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
