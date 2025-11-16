import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ministerialLevels } from "@/domain/models/ministerial";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { InputLider } from "../Input/SelectLider";
import { Button } from "../ui/button";
import { ConsagracaoAuxiliarTab } from "./ConsagracaoAuxiliarTab";
import { ConsagracaoLiderTab } from "./ConsagracaoLiderTab";
import { ConsagracaoPastorTab } from "./ConsagracaoPastorTab";
import { ConsagracaoSeparadoPastoradoTab } from "./ConsagracaoSeparadoPastoradoTab";
import { ConsagracaoSeparadoSupervisorTab } from "./ConsagracaoSeparadoSupervidorTab";
import { ConsagracaoSupervisorTab } from "./ConsagracaoSupervisorTab";

export function ConsagracaoFormTabs() {
  const { data: session } = useSession();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Tabs defaultValue={ministerialLevels[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 md:grid-cols-3 lg:grid-cols-6">
          {ministerialLevels.map((level) => (
            <TabsTrigger key={level} value={level}>
              {level.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Auxiliar">
          <ConsagracaoAuxiliarTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="Lider">
          <ConsagracaoLiderTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="Separado a Supervisão">
          <ConsagracaoSeparadoSupervisorTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="Supervisor">
          <ConsagracaoSupervisorTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="Separado a Pastorado">
          <ConsagracaoSeparadoPastoradoTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="Pastor">
          <ConsagracaoPastorTab churchId={session?.user.churchId!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
