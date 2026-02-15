/**
 * WebAuthn Configuration and Helper Functions
 * Handles biometric authentication (FaceID, TouchID, fingerprint)
 */

export const rpName = process.env.NEXT_PUBLIC_RP_NAME || "Avivamento em Cristo";
export const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
export const origin = process.env.NEXT_PUBLIC_ORIGIN || `http://localhost:3000`;

/**
 * Get expected origin based on environment
 */
export function getExpectedOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_ORIGIN || "https://yourdomain.com";
  }
  return "http://localhost:3000";
}

/**
 * Get RP ID (Relying Party Identifier)
 */
export function getRPID(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_RP_ID || "yourdomain.com";
  }
  return "localhost";
}

/**
 * Convert base64url to Buffer (returns Uint8Array for WebAuthn compatibility)
 */
export function base64URLToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(base64, "base64");
  return new Uint8Array(buffer);
}

/**
 * Convert Buffer to base64url
 */
export function bufferToBase64URL(buffer: Buffer | Uint8Array): string {
  let buf: Buffer;
  if (Buffer.isBuffer(buffer)) {
    buf = buffer;
  } else {
    buf = Buffer.from(buffer);
  }
  const base64 = buf.toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
