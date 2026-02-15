/**
 * Biometric Registration Component
 * Allows users to register their biometric credentials
 */

import React, { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fingerprint, Loader2, CheckCircle, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

interface BiometricRegisterProps {
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function BiometricRegister({ onSuccess, triggerButton }: BiometricRegisterProps) {
  const [open, setOpen] = useState(false);
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
            "Seu dispositivo não suporta autenticação biométrica. Certifique-se de que você tem FaceID, TouchID ou impressão digital configurado."
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
          setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full">
            <Fingerprint className="mr-2 h-4 w-4" />
            Registrar Biometria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Registrar Biometria
          </DialogTitle>
          <DialogDescription>
            Configure seu FaceID, TouchID ou impressão digital para acesso rápido
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium">Biometria registrada!</p>
            <p className="text-sm text-muted-foreground">
              Agora você pode fazer login usando sua biometria
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
                Ex: iPhone Pessoal, Laptop Trabalho
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <p className="text-sm">{error}</p>
              </Alert>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Como funciona:</strong>
                <br />
                Ao clicar em registrar, você será solicitado a usar sua biometria (FaceID,
                TouchID ou impressão digital) para confirmar sua identidade.
              </p>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
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
                  Registrar
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BiometricRegister;
