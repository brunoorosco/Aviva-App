import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ministerialLevels } from "@/domain/models/ministerial";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { ConsagracaoAuxiliarTab } from "./ConsagracaoAuxiliarTab";
import { ConsagracaoLiderTab } from "./ConsagracaoLiderTab";
import { ConsagracaoPastorTab } from "./ConsagracaoPastorTab";
import { ConsagracaoSeparadoPastoradoTab } from "./ConsagracaoSeparadoPastoradoTab";
import { ConsagracaoSeparadoSupervisorTab } from "./ConsagracaoSeparadoSupervidorTab";
import { ConsagracaoSupervisorTab } from "./ConsagracaoSupervisorTab";

export function ConsagracaoFormTabs() {
  const { data: session } = useSession();
  const route = useRouter();
  const { id } = route.query;
  const consagrationId = id as string;

  const { data } = useHttpGet(
    session?.user.churchId && consagrationId
      ? `/api/protected/churches/${session.user.churchId}/consagracao/${consagrationId}`
      : null
  );

  //@ts-ignore
  const users = data?.data?.consagracao?.[0]?.users ?? [];
  console.log(users);

  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const getUsersByRole = (role: string) => {
    const normalizedRole = normalize(role);

    // encontra a chave correta no objeto musers
    const key = Object.keys(users).find((k) => normalize(k) === normalizedRole);

    if (!key) return [];

    return users[key];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <Tabs defaultValue={ministerialLevels[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 md:grid-cols-3 lg:grid-cols-6">
          {ministerialLevels.map((level) => (
            <TabsTrigger key={level} value={level}>
              {level.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Auxiliar */}
        <TabsContent value="Auxiliar">
          <ConsagracaoAuxiliarTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Auxiliar")}
          />
        </TabsContent>

        {/* Líder */}
        <TabsContent value="Lider">
          <ConsagracaoLiderTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Lider")}
          />
        </TabsContent>

        {/* Separado a Supervisão */}
        <TabsContent value="Separado a Supervisão">
          <ConsagracaoSeparadoSupervisorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Separado a Supervisao")}
          />
        </TabsContent>

        {/* Supervisor */}
        <TabsContent value="Supervisor">
          <ConsagracaoSupervisorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Supervisor")}
          />
        </TabsContent>

        {/* Separado a Pastorado */}
        <TabsContent value="Separado a Pastorado">
          <ConsagracaoSeparadoPastoradoTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Separado a Pastorado")}
          />
        </TabsContent>

        {/* Pastor */}
        <TabsContent value="Pastor">
          <ConsagracaoPastorTab
            churchId={session?.user.churchId!}
            consagracaoId={consagrationId}
            initialUsers={getUsersByRole("Pastor")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
