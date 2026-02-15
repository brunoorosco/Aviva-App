/**
 * WebAuthn Authentication Verification API
 * Verifies biometric login and creates session
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server/script/deps";
import { getRPID, getExpectedOrigin, base64URLToBuffer } from "@/lib/webauthn";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userRepository = new UsersMongoRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { credential, challenge, email } = req.body as {
      credential: AuthenticationResponseJSON;
      challenge: string;
      email: string;
    };

    if (!credential || !challenge || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get user from database
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the credential being used
    const userCredential = user.webAuthnCredentials?.find(
      (cred: any) => cred.credentialID === credential.id
    );

    if (!userCredential) {
      return res.status(400).json({ error: "Credential not found" });
    }

    // Verify the authentication response
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: getExpectedOrigin(),
      expectedRPID: getRPID(),
      authenticator: {
        credentialID: base64URLToBuffer(userCredential.credentialID),
        credentialPublicKey: base64URLToBuffer(userCredential.credentialPublicKey),
        counter: userCredential.counter,
        transports: userCredential.transports,
      },
    });

    if (!verification.verified) {
      return res.status(400).json({ error: "Verification failed" });
    }

    // Update credential counter and last used timestamp
    const updatedCredentials = user.webAuthnCredentials.map((cred: any) => {
      if (cred.credentialID === userCredential.credentialID) {
        return {
          ...cred,
          counter: verification.authenticationInfo.newCounter,
          lastUsedAt: new Date().toISOString(),
        };
      }
      return cred;
    });

    await userRepository.updateUser(user._id.toString(), {
      webAuthnCredentials: updatedCredentials,
    });

    // Return user data for session creation
    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        churchId: user.churchId,
        role: user.role,
        permission: user.permission,
        cem: user.cem,
      },
    });
  } catch (error) {
    console.error("WebAuthn authentication verification error:", error);
    return res.status(500).json({ error: "Failed to verify authentication" });
  }
}
