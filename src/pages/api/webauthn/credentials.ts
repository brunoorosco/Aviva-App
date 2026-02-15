/**
 * WebAuthn Credentials Management API
 * Get and delete user's biometric credentials
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { UsersMongoRepository } from "@/infra/db/repositories/mongo/users";

const userRepository = new UsersMongoRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await userRepository.getByEmail(session.user.email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    // Get user's credentials
    const credentials = (user.webAuthnCredentials || []).map((cred: any) => ({
      credentialID: cred.credentialID,
      deviceName: cred.deviceName,
      createdAt: cred.createdAt,
      lastUsedAt: cred.lastUsedAt,
    }));

    return res.status(200).json({ credentials });
  }

  if (req.method === "DELETE") {
    // Delete a credential
    const { credentialID } = req.body;

    if (!credentialID) {
      return res.status(400).json({ error: "Credential ID is required" });
    }

    const updatedCredentials = (user.webAuthnCredentials || []).filter(
      (cred: any) => cred.credentialID !== credentialID
    );

    await userRepository.updateUser(user._id.toString(), {
      webAuthnCredentials: updatedCredentials,
    });

    return res.status(200).json({ success: true, message: "Credential deleted successfully" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
