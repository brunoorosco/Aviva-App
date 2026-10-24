"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Baby, KeyRound } from "lucide-react";
import Toast from "@/components/Toast";

export default function UpdateUsersPage() {
  const [emails, setEmails] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("");
  const [loading, setLoading] = useState(false);

  // Novo card: permissão "apresentacao_crianca"
  const [permEmails, setPermEmails] = useState("");
  const [permAction, setPermAction] = useState<"grant" | "revoke">("grant");
  const [permLoading, setPermLoading] = useState(false);

  const handleClear = () => {
    setEmails("");
    setPassword("");
    setPermission("");
  };

  const handleSave = async () => {
    if (!emails || !password || !permission) {
      Toast.showError("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/protected/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, password, permission }),
      });
      const data = await res.json();
      if (res.ok) Toast.showSuccess(data.message);
      else Toast.showError(data.message);
    } catch (err) {
      Toast.showError("Erro ao atualizar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handlePermSave = async () => {
    if (!permEmails) {
      Toast.showError("Informe ao menos um email.");
      return;
    }

    setPermLoading(true);
    try {
      const res = await fetch("/api/protected/users/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: permEmails,
          permission: "apresentacao_crianca",
          action: permAction,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Toast.showSuccess(data.message);
        setPermEmails("");
      } else {
        Toast.showError(data.message);
      }
    } catch (err) {
      Toast.showError("Erro ao altera a permissão.");
    } finally {
      setPermLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Atualizar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Emails (separados por vírgula)</Label>
              <Input
                placeholder="exemplo1@email.com, exemplo2@email.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="text"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissão</Label>
              <Input
                placeholder="ex: admin, suporte"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleClear}>
                Limpar
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Baby className="w-5 h-5 text-orange-500" />
              Responsáveis por Apresentação de Crianças
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Concede ou revoga a permissão{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-xs">
                apresentacao_crianca
              </code>{" "}
              para usuários específicos (sem mexer na senha ou nas outras
              permissões).
            </p>

            <div className="space-y-2">
              <Label>Emails (separados por vírgula)</Label>
              <Input
                placeholder="exemplo1@email.com, exemplo2@email.com"
                value={permEmails}
                onChange={(e) => setPermEmails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ação</Label>
              <Select value={permAction} onValueChange={(v) => setPermAction(v as "grant" | "revoke")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grant">Conceder acesso</SelectItem>
                  <SelectItem value="revoke">Revogar acesso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPermEmails("")}
                disabled={permLoading}
              >
                Limpar
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handlePermSave}
                disabled={permLoading}
              >
                {permLoading
                  ? "Salvando..."
                  : permAction === "grant"
                    ? "Conceder"
                    : "Revogar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}