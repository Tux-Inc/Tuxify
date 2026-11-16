import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

const DEFAULT_CORS_ORIGINS = "http://localhost:8080,https://tuxify.fr";

/** TRUST_PROXY: number of proxies in front of the gateway, "true", or a list of addresses. */
function trustProxy(value: string | undefined): boolean | number | string | undefined {
    if (!value) return undefined;
    if (/^\d+$/.test(value)) return Number(value);
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

/** HTTP hardening shared by main.ts and the e2e tests. */
export function configureApp(app: NestExpressApplication): void {
    const proxy = trustProxy(process.env.TRUST_PROXY);
    if (proxy !== undefined) app.set("trust proxy", proxy);

    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            // Undeclared fields are stripped, so clients cannot set userId, _id...
            whitelist: true,
            transform: true,
        }),
    );
    app.enableCors({
        // Needed for the provider linking cookie (see providers/link-state).
        credentials: true,
        origin: (process.env.CORS_ORIGINS || DEFAULT_CORS_ORIGINS)
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean),
    });
}
