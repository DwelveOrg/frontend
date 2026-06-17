import { EncryptJWT, jwtDecrypt } from "jose";

import { DEVELOPMENT_SESSION_SECRET } from "../_constants/session";
import type { SessionPayload } from "../_types/auth";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set before auth sessions can run in production.");
  }

  return DEVELOPMENT_SESSION_SECRET;
}

async function getSessionKey() {
  const keyMaterial = new TextEncoder().encode(getSessionSecret());
  return new Uint8Array(await crypto.subtle.digest("SHA-256", keyMaterial));
}

export async function encryptSession(payload: SessionPayload) {
  return new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .encrypt(await getSessionKey());
}

export async function decryptSession(session: string | undefined = "") {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtDecrypt(session, await getSessionKey());
    return payload as SessionPayload;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Invalid or expired session cookie.");
    }

    return null;
  }
}
