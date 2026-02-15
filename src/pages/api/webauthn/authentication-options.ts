/**
 * WebAuthn Authentication Options API
 * Generates challenge for biometric login
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getRPID } from "@/lib/webauthn";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userRepository = new UsersMongoRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Get user from database
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has registered credentials
    if (!user.webAuthnCredentials || user.webAuthnCredentials.length === 0) {
      return res.status(400).json({ 
        error: "No biometric credentials registered",
        code: "NO_CREDENTIALS"
      });
    }

    // Get user's credentials
    const allowCredentials = user.webAuthnCredentials.map((cred: any) => ({
      id: cred.credentialID,
      type: "public-key" as const,
      transports: cred.transports,
    }));

    // Generate authentication options
    const options = await generateAuthenticationOptions({
      rpID: getRPID(),
      allowCredentials,
      userVerification: "preferred",
    });

    // Store challenge temporarily
    // In production, use Redis or session storage
    
    return res.status(200).json({
      options,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("WebAuthn authentication options error:", error);
    return res.status(500).json({ error: "Failed to generate authentication options" });
  }
}
