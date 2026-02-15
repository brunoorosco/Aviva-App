/**
 * Biometric Login Component
 * Allows users to login with FaceID, TouchID, or fingerprint
 */

import React, { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Fingerprint, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface BiometricLoginProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function BiometricLogin({ onSuccess, redirectUrl = "/app" }: BiometricLoginProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBiometricLogin = async () => {
    if (!email) {
      setError("Por favor, insira seu email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Get authentication options from server
      const optionsResponse = await fetch("/api/webauthn/authentication-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        
        if (errorData.code === "NO_CREDENTIALS") {
          setError("Você ainda não registrou sua biometria. Faça login com senha primeiro.");
          setLoading(false);
          return;
        }
        
        throw new Error(errorData.error || "Erro ao iniciar autenticação");
      }

      const { options } = await optionsResponse.json();

      // Step 2: Start browser authentication
      let authenticationResponse;
      try {
        authenticationResponse = await startAuthentication(options);
      } catch (authError: any) {
        if (authError.name === "NotAllowedError") {
          throw new Error("Autenticação cancelada");
        }
        throw new Error("Erro ao acessar biometria. Certifique-se de que seu dispositivo suporta.");
      }

      // Step 3: Verify authentication on server
      const verifyResponse = await fetch("/api/webauthn/authentication-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: authenticationResponse,
          challenge: options.challenge,
          email,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Falha na verificação");
      }

      const { success } = await verifyResponse.json();

      if (success) {
        // Step 4: Sign in with NextAuth using webauthn provider
        const result = await signIn("webauthn", {
          email,
          webauthn: "verified",
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Erro ao criar sessão");
        }

        toast.success("Login realizado com sucesso!");
        
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = redirectUrl;
        }
      }
    } catch (err: any) {
      console.error("Biometric login error:", err);
      setError(err.message || "Erro ao fazer login com biometria");
      toast.error(err.message || "Erro ao fazer login com biometria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="biometric-email">Email</Label>
        <Input
          id="biometric-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBiometricLogin();
            }
          }}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      <Button
        onClick={handleBiometricLogin}
        disabled={loading || !email}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Autenticando...
          </>
        ) : (
          <>
            <Fingerprint className="mr-2 h-5 w-5" />
            Entrar com Biometria
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Use FaceID, TouchID ou impressão digital para acessar
      </p>
    </div>
  );
}

export default BiometricLogin;
