/**
 * WebAuthn Registration Options API
 * Generates challenge for registering biometric credentials
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getRPID, rpName } from "@/lib/webauthn";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userRepository = new UsersMongoRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user from database
    const user = await userRepository.getByEmail(session.user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get existing credentials for this user
    const existingCredentials = (user.webAuthnCredentials || []).map((cred: any) => ({
      id: cred.credentialID,
      type: "public-key" as const,
      transports: cred.transports,
    }));

    // Generate registration options
    const options = await generateRegistrationOptions({
      rpName,
      rpID: getRPID(),
      userID: user._id.toString(),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: "none",
      excludeCredentials: existingCredentials,
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Prefer platform authenticators (biometrics)
      },
    });

    // Store challenge in session or temporary storage
    // For simplicity, we'll return it to be stored client-side
    // In production, consider storing in Redis or session

    return res.status(200).json({
      options,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("WebAuthn registration options error:", error);
    return res.status(500).json({ error: "Failed to generate registration options" });
  }
}
