import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ministerialLevels, TempUserToAdd } from "@/domain/models/ministerial";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ConsagracaoAuxiliarTab } from "./ConsagracaoAuxiliarTab";
import { ConsagracaoLiderTab } from "./ConsagracaoLiderTab";
import { ConsagracaoPastorTab } from "./ConsagracaoPastorTab";
import { ConsagracaoSeparadoPastoradoTab } from "./ConsagracaoSeparadoPastoradoTab";
import { ConsagracaoSeparadoSupervisorTab } from "./ConsagracaoSeparadoSupervidorTab";
import { ConsagracaoSupervisorTab } from "./ConsagracaoSupervisorTab";

type ConsagracaoLists = Record<string, TempUserToAdd[]>;

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function ConsagracaoFormTabs({ onDataChange }: any) {
  const { data: session } = useSession();
  const route = useRouter();
  const { id } = route.query;
  const consagracaoId = id as string;

  // État global: guarda a lista por cargo (o estado "fonte da verdade")
  const [localLists, setLocalLists] = useState<ConsagracaoLists>({});
  const [listsInited, setListsInited] = useState(false);

  const { data } = useHttpGet(
    session?.user.churchId && consagracaoId
      ? `/api/protected/churches/${session.user.churchId}/consagracao/${consagracaoId}`
      : null,
  );

  //@ts-ignore
  const consagracao = data?.data?.consagracao?.[0];
  const users = consagracao?.users ?? {};
  const date = consagracao?.date;
  const concluedAt = consagracao?.concluedAt;

  // Inicializa as listas APENAS quando o fetch pela primeira vez chega
  useEffect(() => {
    if (listsInited || !data) return;
    const initial: ConsagracaoLists = {};
    for (const [key, value] of Object.entries(users)) {
      if (Array.isArray(value)) initial[normalize(key)] = value as TempUserToAdd[];
    }
    setLocalLists(initial);
    setListsInited(true);
  }, [users, data, listsInited]);

  // ✅ Passa para o parent os dados (desta vez, os LOCAIS — não o array novo do fetch)
  useEffect(() => {
    if (onDataChange && listsInited) {
      onDataChange({
        users: localLists,
        date,
        concluedAt,
      });
    }
  }, [localLists, date, concluedAt, onDataChange, listsInited]);

  const getRoleList = useCallback(
    (role: string): TempUserToAdd[] => localLists[normalize(role)] ?? [],
    [localLists],
  );

  const setRoleList = useCallback((role: string, list: TempUserToAdd[]) => {
    setLocalLists((prev) => ({ ...prev, [normalize(role)]: list }));
  }, []);

  return (
    <div className="p-3 sm:p-4 bg-card text-card-foreground rounded-lg shadow-sm">
      <Tabs defaultValue={ministerialLevels[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1 mb-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {ministerialLevels.map((level) => (
            <TabsTrigger key={level} value={level} className="h-auto min-h-9 text-xs px-2 sm:text-sm">
              {level.replace(/_/g, " ").split(" ").pop()}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Auxiliar">
          <ConsagracaoAuxiliarTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Auxiliar")}
            onListChange={(list) => setRoleList("Auxiliar", list)}
          />
        </TabsContent>

        <TabsContent value="Lider">
          <ConsagracaoLiderTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Lider")}
            onListChange={(list) => setRoleList("Lider", list)}
          />
        </TabsContent>

        <TabsContent value="Separado a Supervisão">
          <ConsagracaoSeparadoSupervisorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Separado a Supervisao")}
            onListChange={(list: TempUserToAdd[]) => setRoleList("Separado a Supervisao", list)}
          />
        </TabsContent>

        <TabsContent value="Supervisor">
          <ConsagracaoSupervisorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Supervisor")}
            onListChange={(list) => setRoleList("Supervisor", list)}
          />
        </TabsContent>

        <TabsContent value="Separado a Pastorado">
          <ConsagracaoSeparadoPastoradoTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Separado a Pastorado")}
            onListChange={(list) => setRoleList("Separado a Pastorado", list)}
          />
        </TabsContent>

        <TabsContent value="Pastor">
          <ConsagracaoPastorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagracaoId}
            initialUsers={getRoleList("Pastor")}
            onListChange={(list) => setRoleList("Pastor", list)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}