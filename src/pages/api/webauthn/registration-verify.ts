/**
 * WebAuthn Registration Verification API
 * Verifies and stores biometric credentials
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server/script/deps";
import { getRPID, getExpectedOrigin, bufferToBase64URL } from "@/lib/webauthn";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userRepository = new UsersMongoRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { credential, challenge, deviceName } = req.body as {
      credential: RegistrationResponseJSON;
      challenge: string;
      deviceName?: string;
    };

    if (!credential || !challenge) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get user from database
    const user = await userRepository.getByEmail(session.user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the registration response
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: getExpectedOrigin(),
      expectedRPID: getRPID(),
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: "Verification failed" });
    }

    const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    // Store the credential in the database
    const newCredential = {
      credentialID: bufferToBase64URL(credentialID),
      credentialPublicKey: bufferToBase64URL(credentialPublicKey),
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: credential.response.transports,
      deviceName: deviceName || "Dispositivo biométrico",
      createdAt: new Date().toISOString(),
    };

    // Add credential to user
    await userRepository.updateUser(user._id.toString(), {
      $push: { webAuthnCredentials: newCredential },
    } as any);

    return res.status(200).json({
      success: true,
      message: "Biometria registrada com sucesso!",
      credential: {
        id: newCredential.credentialID,
        deviceName: newCredential.deviceName,
        createdAt: newCredential.createdAt,
      },
    });
  } catch (error) {
    console.error("WebAuthn registration verification error:", error);
    return res.status(500).json({ error: "Failed to verify registration" });
  }
}
