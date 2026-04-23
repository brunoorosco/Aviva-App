import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Save, Loader2, ArrowLeft, Lock } from "lucide-react";
import Toast from "@/components/Toast";
import { ROLES, hasPermission } from "@/lib/permissions";

const MODULES = [
  { id: "dashboard", name: "Dashboard" },
  { id: "encontroComDeus", name: "Encontro com Deus" },
  { id: "reencontroComDeus", name: "Reencontro com Deus" },
  { id: "cems", name: "Células (CEMs)" },
  { id: "users", name: "Membros / Usuários" },
  { id: "agenda", name: "Agenda" },
  { id: "batismo", name: "Batismos" },
  { id: "ministerios", name: "Ministérios" },
  { id: "discipulado", name: "Discipulado" },
  { id: "financeiro", name: "Financeiro / Relatórios" },
];

const PERMISSIONS = [
  { id: "read", name: "Leitura" },
  { id: "write", name: "Escrita" },
  { id: "edit", name: "Edição" },
  { id: "delete", name: "Exclusão" },
];

export default function PermissionsPage() {
  const router = useRouter();
  const { churchid } = router.query;
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rolesPermissions, setRolesPermissions] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<string>(ROLES.PASTOR);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(`/api/protected/churches/${churchid}/admin/permissions`);
        if (res.ok) {
          const data = await res.json();
          setRolesPermissions(data);
        }
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
        Toast.showError("Erro ao carregar permissões");
      } finally {
        setLoading(false);
      }
    };

    if (churchid) fetchPermissions();
  }, [churchid]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdminOrSecretary = session?.user && hasPermission(session.user.permission || [], [ROLES.ADMIN, ROLES.SECRETARIA]);

  if (!isAdminOrSecretary) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
          <Lock className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Negado</h1>
        <p className="text-gray-500">Você não tem permissão para acessar esta página.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  const getRoleData = (role: string) => {
    return rolesPermissions.find(p => p.role === role) || { role, modules: [] };
  };

  const handleTogglePermission = (role: string, moduleId: string, permissionType: string) => {
    setRolesPermissions(prev => {
      const roleIndex = prev.findIndex(p => p.role === role);
      let newPermissions = [...prev];

      if (roleIndex === -1) {
        newPermissions.push({
          role,
          modules: [{ name: moduleId, [permissionType]: true }]
        });
      } else {
        const roleData = { ...newPermissions[roleIndex] };
        const moduleIndex = roleData.modules.findIndex((m: any) => m.name === moduleId);

        if (moduleIndex === -1) {
          roleData.modules.push({
            name: moduleId,
            read: false,
            write: false,
            edit: false,
            delete: false,
            [permissionType]: true
          });
        } else {
          roleData.modules[moduleIndex] = {
            ...roleData.modules[moduleIndex],
            [permissionType]: !roleData.modules[moduleIndex][permissionType]
          };
        }
        newPermissions[roleIndex] = roleData;
      }
      return newPermissions;
    });
  };

  const isChecked = (role: string, moduleId: string, permissionType: string) => {
    const roleData = rolesPermissions.find(p => p.role === role);
    if (!roleData) return false;
    const moduleData = roleData.modules.find((m: any) => m.name === moduleId);
    return moduleData ? !!moduleData[permissionType] : false;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentRoleData = getRoleData(activeRole);
      const res = await fetch(`/api/protected/churches/${churchid}/admin/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentRoleData),
      });

      if (res.ok) {
        Toast.showSuccess(`Permissões de ${activeRole} atualizadas!`);
      } else {
        Toast.showError("Erro ao salvar permissões");
      }
    } catch (error) {
      Toast.showError("Erro na conexão");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Gestão de Permissões
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure o acesso por módulo para cada nível ministerial.
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue={ROLES.PASTOR} value={activeRole} onValueChange={setActiveRole} className="space-y-6">
        <div className="bg-card/50 backdrop-blur-sm p-1 rounded-xl border border-border shadow-sm overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0 flex flex-nowrap sm:flex-wrap">
            {Object.entries(ROLES).map(([key, value]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize whitespace-nowrap"
              >
                {value.replace("-", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.values(ROLES).map((role) => (
          <TabsContent key={role} value={role} className="mt-0">
            <Card className="border-border/50 shadow-xl overflow-hidden bg-card/80 backdrop-blur-md">
              <CardHeader className="bg-secondary/20 border-b border-border/50">
                <CardTitle className="text-xl capitalize flex items-center gap-2">
                  Permissões para: {role.replace("-", " ")}
                </CardTitle>
                <CardDescription>
                  Marque as ações permitidas para este papel em cada módulo do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-secondary/30 text-muted-foreground border-b border-border/50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">Módulo</th>
                        {PERMISSIONS.map(p => (
                          <th key={p.id} className="px-6 py-4 text-center">{p.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {MODULES.map((module) => (
                        <tr key={module.id} className="hover:bg-secondary/10 transition-colors group">
                          <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                            {module.name}
                          </td>
                          {PERMISSIONS.map(p => (
                            <td key={p.id} className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={isChecked(role, module.id, p.id)}
                                  onCheckedChange={() => handleTogglePermission(role, module.id, p.id)}
                                  disabled={role === ROLES.ADMIN} // Admin sempre tem tudo
                                  className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {activeRole === ROLES.ADMIN && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200 flex items-start gap-3">
          <Shield className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm italic">
            O papel <strong>Admin</strong> possui permissões totais por padrão e não pode ser editado.
          </p>
        </div>
      )}
    </div>
  );
}
