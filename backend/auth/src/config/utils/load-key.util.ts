import { existsSync, readFileSync } from "fs";

const PEM_HEADER = "-----BEGIN";

/**
 * Normalises a key given through an environment variable.
 * Accepts a PEM string (real or escaped `\n` line breaks) or a base64-encoded
 * PEM, which is easier to store as a single-line CI secret.
 */
function decodeKey(value: string): string {
    const trimmed = value.trim();
    if (trimmed.startsWith(PEM_HEADER)) {
        return trimmed.replace(/\\n/g, "\n");
    }
    const decoded = Buffer.from(trimmed, "base64").toString("utf-8").trim();
    if (!decoded.startsWith(PEM_HEADER)) {
        throw new Error("value is neither a PEM key nor a base64-encoded PEM key");
    }
    return decoded;
}

/**
 * Loads a PEM key, in order of precedence, from:
 * 1. the `<envName>` environment variable (PEM or base64-encoded PEM);
 * 2. the file whose path is in `<envName>_FILE` (e.g. a mounted Kubernetes Secret);
 * 3. `defaultPath`, a local file used in development (see scripts/generate-keys.sh).
 */
export function loadKey(
    envName: string,
    defaultPath: string,
    env: NodeJS.ProcessEnv = process.env,
): string {
    const inline = env[envName];
    if (inline) {
        try {
            return decodeKey(inline);
        } catch (error) {
            throw new Error(`Invalid ${envName}: ${error.message}`);
        }
    }

    const filePath = env[`${envName}_FILE`] || defaultPath;
    if (!existsSync(filePath)) {
        throw new Error(
            `Missing ${envName}: set ${envName} or ${envName}_FILE, ` +
                `or generate a local key pair with scripts/generate-keys.sh ` +
                `(expected file: ${filePath})`,
        );
    }
    return readFileSync(filePath, "utf-8");
}
