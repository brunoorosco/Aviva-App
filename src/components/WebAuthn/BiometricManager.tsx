/**
 * Biometric Manager Component
 * Displays and manages registered biometric credentials
 */

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { BiometricRegister } from "./BiometricRegister";
import { Fingerprint, Smartphone, Trash2, Shield, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface Credential {
  credentialID: string;
  deviceName: string;
  createdAt: string;
  lastUsedAt?: string;
}

export function BiometricManager() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/webauthn/credentials");
      
      if (response.ok) {
        const data = await response.json();
        setCredentials(data.credentials || []);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadCredentials();
    }
  }, [session]);

  const handleDelete = async (credentialID: string) => {
    if (!confirm("Tem certeza que deseja remover esta biometria?")) {
      return;
    }

    try {
      const response = await fetch("/api/webauthn/credentials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialID }),
      });

      if (response.ok) {
        toast.success("Biometria removida com sucesso!");
        loadCredentials();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao remover biometria");
      }
    } catch (error) {
      console.error("Error deleting credential:", error);
      toast.error("Erro ao remover biometria");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Autenticação Biométrica
        </CardTitle>
        <CardDescription>
          Gerencie seus dispositivos com acesso biométrico (FaceID, TouchID, impressão digital)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando credenciais...
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <Fingerprint className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhuma biometria registrada</p>
              <p className="text-sm text-muted-foreground">
                Registre sua biometria para fazer login mais rápido
              </p>
            </div>
            <BiometricRegister onSuccess={loadCredentials} />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {credentials.map((credential) => (
                <div
                  key={credential.credentialID}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{credential.deviceName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Criado em{" "}
                          {format(new Date(credential.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        {credential.lastUsedAt && (
                          <span>
                            Último uso:{" "}
                            {format(new Date(credential.lastUsedAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(credential.credentialID)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <BiometricRegister
                onSuccess={loadCredentials}
                triggerButton={
                  <Button variant="outline" className="w-full">
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Adicionar Novo Dispositivo
                  </Button>
                }
              />
            </div>
          </>
        )}

        <Alert>
          <p className="text-sm">
            <strong>Dica de segurança:</strong> Mantenha apenas dispositivos que você usa
            regularmente. Remova dispositivos perdidos ou que você não usa mais.
          </p>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default BiometricManager;
