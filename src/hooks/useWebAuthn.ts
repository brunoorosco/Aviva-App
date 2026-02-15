import { useState } from 'react';
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';

export const useWebAuthn = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica suporte do navegador
  const checkSupport = () => {
    const supported = browserSupportsWebAuthn();
    setIsSupported(supported);
    return supported;
  };

  // Registra nova credencial biométrica
  const registerCredential = async (deviceName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!browserSupportsWebAuthn()) {
        throw new Error('Seu navegador não suporta WebAuthn');
      }

      // 1. Obter opções do servidor
      const optionsResponse = await fetch('/api/webauthn/registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName }),
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Erro ao gerar opções de registro');
      }

      const options = await optionsResponse.json();

      // 2. Iniciar registro no navegador
      const credential = await startRegistration(options);

      // 3. Verificar credencial no servidor
      const verifyResponse = await fetch('/api/webauthn/registration-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, deviceName }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Erro ao verificar credencial');
      }

      const result = await verifyResponse.json();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar biometria');
      setIsLoading(false);
      throw err;
    }
  };

  // Autentica com credencial biométrica
  const authenticate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!browserSupportsWebAuthn()) {
        throw new Error('Seu navegador não suporta WebAuthn');
      }

      // 1. Obter opções do servidor
      const optionsResponse = await fetch('/api/webauthn/authentication-options');

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Erro ao gerar opções de autenticação');
      }

      const options = await optionsResponse.json();

      // 2. Iniciar autenticação no navegador
      const credential = await startAuthentication(options);

      // 3. Verificar credencial no servidor
      const verifyResponse = await fetch('/api/webauthn/authentication-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Erro ao verificar autenticação');
      }

      const result = await verifyResponse.json();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar com biometria');
      setIsLoading(false);
      throw err;
    }
  };

  return {
    isSupported,
    isLoading,
    error,
    checkSupport,
    registerCredential,
    authenticate,
  };
};
