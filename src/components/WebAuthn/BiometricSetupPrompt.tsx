/**
 * Biometric Setup Prompt
 * Automatically shows after successful password login if user doesn't have biometrics registered
 */

import React, { useEffect, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fingerprint, Loader2, CheckCircle, Smartphone, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface BiometricSetupPromptProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BiometricSetupPrompt({ 
  open, 
  onClose, 
  onSuccess 
}: BiometricSetupPromptProps) {
  const [deviceName, setDeviceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Step 1: Get registration options from server
      const optionsResponse = await fetch("/api/webauthn/registration-options", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || "Erro ao iniciar registro");
      }

      const { options } = await optionsResponse.json();

      // Step 2: Start browser registration
      let registrationResponse;
      try {
        registrationResponse = await startRegistration(options);
      } catch (regError: any) {
        if (regError.name === "NotAllowedError") {
          throw new Error("Registro cancelado");
        }
        if (regError.name === "NotSupportedError") {
          throw new Error(
            "Seu dispositivo não suporta autenticação biométrica"
          );
        }
        throw new Error("Erro ao registrar biometria. Tente novamente.");
      }

      // Step 3: Verify registration on server
      const verifyResponse = await fetch("/api/webauthn/registration-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: registrationResponse,
          challenge: options.challenge,
          deviceName: deviceName || getDefaultDeviceName(),
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Falha na verificação");
      }

      const { success: verified, message } = await verifyResponse.json();

      if (verified) {
        setSuccess(true);
        toast.success(message || "Biometria registrada com sucesso!");
        
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setDeviceName("");
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("Biometric registration error:", err);
      setError(err.message || "Erro ao registrar biometria");
      toast.error(err.message || "Erro ao registrar biometria");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDeviceName = () => {
    const userAgent = navigator.userAgent;
    if (/iPhone/i.test(userAgent)) return "iPhone";
    if (/iPad/i.test(userAgent)) return "iPad";
    if (/Android/i.test(userAgent)) return "Android";
    if (/Mac/i.test(userAgent)) return "Mac";
    if (/Windows/i.test(userAgent)) return "Windows";
    return "Meu Dispositivo";
  };

  const resetState = () => {
    setError("");
    setSuccess(false);
    setDeviceName("");
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Biometria Configurada!
              </DialogTitle>
              <DialogDescription>
                Seu dispositivo foi cadastrado com sucesso
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <p className="text-lg font-medium text-center">
                Tudo pronto!
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Agora você pode fazer login usando sua biometria.<br />
                Nos próximos acessos, basta usar seu{" "}
                {/iPhone|iPad/i.test(navigator.userAgent) 
                  ? "Face ID ou Touch ID" 
                  : "impressão digital ou reconhecimento facial"}
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Ativar Login Rápido com Biometria
              </DialogTitle>
              <DialogDescription>
                Configure seu dispositivo para fazer login de forma rápida e segura
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Benefícios */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg space-y-3">
                <p className="font-semibold text-sm">✨ Benefícios:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">⚡</span>
                    <span>Login em apenas 2 segundos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">🔒</span>
                    <span>Mais seguro que senhas tradicionais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">🎯</span>
                    <span>Sem risco de esquecer a senha</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">📱</span>
                    <span>Use Face ID, Touch ID ou impressão digital</span>
                  </li>
                </ul>
              </div>

              {/* Nome do dispositivo */}
              <div className="space-y-2">
                <Label htmlFor="device-name">Nome do dispositivo (opcional)</Label>
                <Input
                  id="device-name"
                  type="text"
                  placeholder={getDefaultDeviceName()}
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Ex: iPhone Pessoal, MacBook Trabalho
                </p>
              </div>

              {/* Erro */}
              {error && (
                <Alert variant="destructive">
                  <p className="text-sm">{error}</p>
                </Alert>
              )}

              {/* Instruções */}
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  <strong>ℹ️ Como funciona:</strong>
                  <br />
                  Ao clicar em "Configurar", você será solicitado a confirmar sua identidade
                  usando a biometria do seu dispositivo (Face ID, Touch ID ou impressão digital).
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Agora não
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="mr-2 h-5 w-5" />
                      Configurar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
