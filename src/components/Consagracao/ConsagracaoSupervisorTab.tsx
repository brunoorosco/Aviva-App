import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserSelectForm } from "./UserSelectForm";
import Toast from "../Toast";
import { TempUserToAdd, TMinisterialLevel } from "@/domain/models/ministerial";
import { useHttpPut } from "@/hooks/api";

export function ConsagracaoSupervisorTab({
  churchId,
  consagracaoId,
  initialUsers,
}: {
  churchId: string;
  consagracaoId: string;
  initialUsers: any;
}) {
  const [auxiliaresTempList, setAuxiliaresTempList] = useState<TempUserToAdd[]>([]);
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
      role: "Separado a Supervisão" as TMinisterialLevel,
      nextRole: "Supervisor" as TMinisterialLevel,
    }));

    try {
      const response = useHttpPut({
        url: `/api/protected/churches/${churchId}/consagracao/${consagracaoId}`,
        data: payload,
      });

      if (!response) {
        throw new Error("Falha ao consagrar auxiliares.");
      }

      Toast.showSuccess("Supervisores consagrados com sucesso!");
    } catch (error: any) {
      Toast.showError(`Erro ao consagrar auxiliares: ${error.message}`);
      console.error("Erro ao consagrar auxiliares:", error);
    }
  };

  return (
    <div className="space-y-6">
      <UserSelectForm
        initialUsers={initialUsers}
        currentMinisterialLevel="Separado a Supervisão"
        targetMinisterialLevel="Supervisor"
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
        Consagrar para Supervisor(a)
      </Button>
      <p className="mt-2 text-sm text-gray-500">
        Ao clicar, os usuários selecionados serão promovidos a Auxiliar.
      </p>
    </div>
  );
}
