import { signExpiringUserState, safeEqual, verifyExpiringUserState } from "@tuxify/common";

/**
 * OAuth `state` of provider linking.
 *
 * The state carries the user id, signed with PROVIDER_STATE_SECRET and valid for
 * 10 minutes, and is also stored in an httpOnly cookie scoped to the callback
 * route. The callback only accepts a state that is validly signed AND equal to the
 * cookie, so a linking started by someone else (sent to a victim as a link) is
 * rejected, and the user id never comes from the URL.
 */
export const LINK_STATE_COOKIE = "tuxify_link_state";
export const LINK_STATE_TTL_SECONDS = 600;

const secret = (): string => process.env.PROVIDER_STATE_SECRET ?? "";

export const isLinkStateConfigured = (): boolean => secret().length > 0;

export function createLinkState(userId: number): string {
    return signExpiringUserState(userId, secret(), LINK_STATE_TTL_SECONDS);
}

export function callbackPath(provider: string): string {
    return `/providers/${provider}/callback`;
}

/** Reads one cookie from a raw Cookie header. */
export function readCookie(header: string | undefined, name: string): string | undefined {
    for (const part of (header ?? "").split(";")) {
        const index = part.indexOf("=");
        if (index > 0 && part.slice(0, index).trim() === name) {
            try {
                return decodeURIComponent(part.slice(index + 1).trim());
            } catch {
                return undefined;
            }
        }
    }
    return undefined;
}

/** Returns the user id when `state` is validly signed, unexpired and equal to the cookie. */
export function checkLinkState(state: unknown, cookie: string | undefined): number | null {
    if (typeof state !== "string" || !safeEqual(state, cookie)) return null;
    return verifyExpiringUserState(state, secret());
}
