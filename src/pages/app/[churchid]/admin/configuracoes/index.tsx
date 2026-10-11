"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCheck, Sun, Moon, SunMoon, Loader, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { isAdminUser } from "@/lib/isAdminUser";
import { useCultoSettings } from "@/hooks/useCultoSettings";
import { CultoDomingo, DEFAULT_CULTO_DOMINGO } from "@/domain/models/cultoSettings";

type Option = {
  value: CultoDomingo;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const OPTIONS: Option[] = [
  {
    value: "manha",
    label: "Manhã",
    description: "Só há culto no período da manhã.",
    icon: <Sun className="h-5 w-5 text-amber-500" />,
  },
  {
    value: "noite",
    label: "Noite",
    description: "Só há culto no período da noite.",
    icon: <Moon className="h-5 w-5 text-indigo-500" />,
  },
  {
    value: "manha_e_noite",
    label: "Manhã e noite",
    description: "Há culto nos dois períodos.",
    icon: <SunMoon className="h-5 w-5 text-orange-500" />,
  },
];

export default function ConfiguracoesPage() {
  const router = useRouter();
  const churchid = router.query.churchid as string | undefined;
  const { data: session } = useSession();
  const isAdmin = isAdminUser(session);

  const { cultoDomingo, loading, save } = useCultoSettings(isAdmin ? churchid : undefined);

  const [selected, setSelected] = useState<CultoDomingo>(DEFAULT_CULTO_DOMINGO);
  const [saving, setSaving] = useState(false);

  // Quando o valor real vier do hook, sincroniza o state local.
  useEffect(() => {
    if (!loading && isAdmin) {
      setSelected(cultoDomingo);
    }
  }, [loading, cultoDomingo]);

  const dirty = selected !== cultoDomingo;

  const handleSave = async () => {
    if (!churchid || !isAdmin) return;
    setSaving(true);
    await save(selected);
    setSaving(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex-1 w-full">
        <main className="w-full max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Acesso restrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta página é exclusiva para administradores (admin/bispo).
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex-1 w-full">
      <main className="w-full max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-[Montserrat] text-foreground mb-2">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Ajustes que afetam o fluxo de uso desta igreja.
        </p>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader className="h-6 w-6 animate-spin mr-2" />
              Carregando configurações...
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SunMoon className="h-5 w-5 text-orange-500" />
                  Culto de domingo
                </CardTitle>
                <CardDescription>
                  Informe como o(s) culto(s) de domingo acontecem nesta
                  igreja. Quando um único período é marcado, o campo
                  &ldquo;Horário do Culto&rdquo; nas apresentações passa a ser
                  fixo/desabilitado nesse dia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selected}
                  onValueChange={(v) => setSelected(v as CultoDomingo)}
                  className="grid gap-4"
                >
                  {OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer"
                    >
                      <RadioGroupItem
                        value={opt.value}
                        id={`culto-${opt.value}`}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {opt.icon}
                          <Label
                            htmlFor={`culto-${opt.value}`}
                            className="font-semibold text-foreground cursor-pointer"
                          >
                            {opt.label}
                          </Label>
                          {selected === opt.value && (
                            <CheckCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCheck className="h-4 w-4" />
                    )}
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}