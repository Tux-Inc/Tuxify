import { join } from "path";
import { tmpdir } from "os";
import { generateKeyPairSync } from "crypto";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { loadKey } from "../utils/load-key.util";

describe("loadKey", () => {
    const { privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
        publicKeyEncoding: { type: "spki", format: "pem" },
    });
    const pem = privateKey.trim();
    let dir: string;

    beforeEach(() => {
        dir = mkdtempSync(join(tmpdir(), "load-key-"));
    });

    afterEach(() => {
        rmSync(dir, { recursive: true, force: true });
    });

    it("reads a PEM key from the environment variable", () => {
        expect(loadKey("KEY", "/missing", { KEY: pem })).toBe(pem);
    });

    it("accepts a PEM key with escaped line breaks", () => {
        const escaped = pem.replace(/\n/g, "\\n");
        expect(loadKey("KEY", "/missing", { KEY: escaped })).toBe(pem);
    });

    it("accepts a base64-encoded PEM key", () => {
        const b64 = Buffer.from(pem).toString("base64");
        expect(loadKey("KEY", "/missing", { KEY: b64 })).toBe(pem);
    });

    it("rejects a value that is not a key", () => {
        expect(() => loadKey("KEY", "/missing", { KEY: "not-a-key" })).toThrow(
            /Invalid KEY/,
        );
    });

    it("reads the file given by <name>_FILE before the default path", () => {
        const file = join(dir, "mounted.key");
        writeFileSync(file, pem);
        expect(
            loadKey("KEY", join(dir, "default.key"), { KEY_FILE: file }),
        ).toBe(pem);
    });

    it("falls back to the default path", () => {
        const file = join(dir, "default.key");
        writeFileSync(file, pem);
        expect(loadKey("KEY", file, {})).toBe(pem);
    });

    it("explains how to fix a missing key", () => {
        expect(() => loadKey("KEY", join(dir, "none.key"), {})).toThrow(
            /generate-keys\.sh/,
        );
    });
});
