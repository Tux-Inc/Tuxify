import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/** Constant-time comparison of two strings (false when either is missing). */
export function safeEqual(a: string | undefined | null, b: string | undefined | null): boolean {
    if (typeof a !== "string" || typeof b !== "string") return false;
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: string, secret: string): string {
    return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Builds an opaque value carrying a user id, signed with `secret`
 * (`<userId>.<nonce>.<signature>`, under 70 characters). Used where a third party
 * echoes a value back to us, e.g. the Microsoft Graph `clientState`.
 */
export function signUserState(userId: number, secret: string): string {
    if (!secret) throw new Error("A secret is required to sign a user state");
    if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("Invalid user id");
    const payload = `${userId}.${randomBytes(12).toString("base64url")}`;
    return `${payload}.${sign(payload, secret)}`;
}

/** Returns the user id of a value built by `signUserState`, or null if it was not signed with `secret`. */
export function verifyUserState(state: unknown, secret: string): number | null {
    if (!secret || typeof state !== "string") return null;
    const parts = state.split(".");
    if (parts.length !== 3) return null;
    const [id, nonce, signature] = parts;
    if (!/^\d+$/.test(id) || !nonce) return null;
    if (!safeEqual(signature, sign(`${id}.${nonce}`, secret))) return null;
    const userId = Number(id);
    return Number.isSafeInteger(userId) ? userId : null;
}

/**
 * Like signUserState, with an expiry (`<userId>.<expiresAt>.<nonce>.<signature>`,
 * expiresAt in seconds). Used for the OAuth `state` of provider linking.
 */
export function signExpiringUserState(
    userId: number,
    secret: string,
    ttlSeconds: number,
    now: number = Date.now(),
): string {
    if (!secret) throw new Error("A secret is required to sign a user state");
    if (!Number.isSafeInteger(userId) || userId < 0) throw new Error("Invalid user id");
    const expiresAt = Math.floor(now / 1000) + ttlSeconds;
    const payload = `${userId}.${expiresAt}.${randomBytes(16).toString("base64url")}`;
    return `${payload}.${sign(payload, secret)}`;
}

/** Returns the user id of a valid, unexpired value built by signExpiringUserState, or null. */
export function verifyExpiringUserState(
    state: unknown,
    secret: string,
    now: number = Date.now(),
): number | null {
    if (!secret || typeof state !== "string") return null;
    const parts = state.split(".");
    if (parts.length !== 4) return null;
    const [id, expiresAt, nonce, signature] = parts;
    if (!/^\d+$/.test(id) || !/^\d+$/.test(expiresAt) || !nonce) return null;
    if (!safeEqual(signature, sign(`${id}.${expiresAt}.${nonce}`, secret))) return null;
    if (Number(expiresAt) * 1000 < now) return null;
    const userId = Number(id);
    return Number.isSafeInteger(userId) ? userId : null;
}
