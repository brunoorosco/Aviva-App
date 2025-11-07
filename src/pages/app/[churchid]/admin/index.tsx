"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Toast from "@/components/Toast";

export default function UpdateUsersPage() {
  const [emails, setEmails] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">Atualizar Usuários</CardTitle>
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
              type="password"
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
    </div>
  );
}
