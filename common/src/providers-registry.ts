/**
 * Providers known by the platform, and the NATS subjects they may receive from
 * user-controlled input (flow steps, webhook routes). Everything else is rejected:
 * a flow step name or a URL parameter must never be able to reach an internal
 * subject such as `auth.jwt.verify` or `providers.*.getTokens`.
 */
export const PROVIDER_NAMES = ["google", "github", "microsoft"] as const;
export type ProviderName = (typeof PROVIDER_NAMES)[number];

export function isProviderName(value: unknown): value is ProviderName {
    return typeof value === "string" && (PROVIDER_NAMES as readonly string[]).includes(value);
}

/** `provider.<name>.<action|reaction>.<segment>[.<segment>...]`, lowercase segments only. */
export const PROVIDER_STEP_NAME = /^provider\.(google|github|microsoft)\.(action|reaction)\.[a-z0-9]+(\.[a-z0-9]+)*$/;

/** True when `name` is a provider action or reaction subject (optionally of the given type). */
export function isProviderStepName(name: unknown, type?: "action" | "reaction"): name is string {
    if (typeof name !== "string") return false;
    const match = PROVIDER_STEP_NAME.exec(name);
    return match !== null && (type === undefined || match[2] === type);
}

/** Webhook scopes accepted on `POST /providers/:provider/action/:scope`. */
export const WEBHOOK_SCOPES: Readonly<Record<ProviderName, readonly string[]>> = {
    google: ["gmail.receive"],
    microsoft: ["outlook", "todo"],
    github: [],
};

export function isWebhookScope(provider: unknown, scope: unknown): boolean {
    return isProviderName(provider) && typeof scope === "string" && WEBHOOK_SCOPES[provider].includes(scope);
}
