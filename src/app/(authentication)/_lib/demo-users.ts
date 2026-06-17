import "server-only";

import { demoUsers } from "../_constants/demo-users";

export function isPrototypeAuthEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_PROTOTYPE_AUTH === "true";
}

export function findDemoUserByIdentifier(identifier: string) {
  if (!isPrototypeAuthEnabled()) {
    return null;
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  return demoUsers.find((user) => user.identifier.toLowerCase() === normalizedIdentifier) ?? null;
}

export function findDemoUserById(userId: string) {
  if (!isPrototypeAuthEnabled()) {
    return null;
  }

  return demoUsers.find((user) => user.id === userId) ?? null;
}
