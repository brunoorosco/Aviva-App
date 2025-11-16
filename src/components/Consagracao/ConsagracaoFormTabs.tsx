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

export function ConsagracaoFormTabs() {
  const { data: session } = useSession();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Tabs defaultValue={ministerialLevels[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
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

        {/* <TabsContent value="SEPARADO_PARA_SUPERVISAO">
          <ConsagracaoSeparadoParaSupervisaoTab
            churchId={session?.user.churchId!}
          />
        </TabsContent>

        <TabsContent value="SUPERVISOR">
          <ConsagracaoSupervisorTab churchId={session?.user.churchId!} />
        </TabsContent>

        <TabsContent value="SEPARADO_PARA_PASTORADO">
          <ConsagracaoSeparadoParaPastoradoTab
            churchId={session?.user.churchId!}
          />
        </TabsContent>

        <TabsContent value="PASTOR">
          <ConsagracaoPastorTab churchId={session?.user.churchId!} />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
