// OAuth login state (RAPPORT S5): a new random state per login, bound to the
// browser by a signed cookie, single use. Runs the real controller in a Fastify
// app with @fastify/cookie, like main.ts; the OAuth provider calls are faked.
import fastifyCookie from "@fastify/cookie";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Oauth2Controller } from "../oauth2.controller";
import { Oauth2Service } from "../oauth2.service";

const COOKIE_SECRET = "cookie-secret-for-tests";

/** The oauth_state Set-Cookie header of a response, if any. */
const stateCookieOf = (res: { headers: Record<string, unknown> }): string | undefined =>
    ([res.headers["set-cookie"]].flat().filter(Boolean) as string[]).find((c) =>
        c.startsWith("oauth_state="),
    );

describe("OAuth login state", () => {
    let app: NestFastifyApplication;
    const getUserData = jest.fn(async () => ({
        name: "Jane",
        email: "jane@example.com",
        tokens: { accessToken: "a", refreshToken: "r" },
    }));
    const oauth2Service = {
        getAuthorizationUrl: (_provider: string, state: string) =>
            `https://accounts.example.com/authorize?state=${encodeURIComponent(state)}`,
        getUserData,
        login: jest.fn(async () => ["access-token", "refresh-token"]),
    };
    const config: Record<string, unknown> = {
        domain: "http://localhost:8080",
        REFRESH_COOKIE: "rf",
        "jwt.refresh.time": 604800,
        testing: true,
        "oauth2.google": { id: "id", secret: "secret" },
        "oauth2.github": { id: "id", secret: "secret" },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [Oauth2Controller],
            providers: [
                { provide: Oauth2Service, useValue: oauth2Service },
                { provide: ConfigService, useValue: { get: (key: string) => config[key] ?? null } },
            ],
        }).compile();
        app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.register(fastifyCookie as any, { secret: COOKIE_SECRET });
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => getUserData.mockClear());

    /** Starts a login and returns the state sent to the provider and the cookie set. */
    async function start(provider = "google") {
        const res = await app.inject({ method: "GET", url: `/api/auth/ext/${provider}` });
        expect(res.statusCode).toBe(307);
        const state = new URL(res.headers.location as string).searchParams.get("state");
        const setCookie = stateCookieOf(res);
        return { state, setCookie, cookie: setCookie?.split(";")[0] };
    }

    const callback = (state: string, cookie?: string, provider = "google") =>
        app.inject({
            method: "GET",
            url: `/api/auth/ext/${provider}/callback?code=the-code&state=${encodeURIComponent(state)}`,
            headers: cookie ? { cookie } : {},
        });

    it("uses a new random state for every login", async () => {
        const first = await start();
        const second = await start();
        expect(first.state).toHaveLength(43);
        expect(first.state).not.toBe(second.state);
    });

    it("sets a signed, httpOnly, SameSite=Lax cookie scoped to the callback", async () => {
        const { setCookie, state } = await start();
        expect(setCookie).toMatch(/HttpOnly/i);
        expect(setCookie).toMatch(/SameSite=Lax/i);
        expect(setCookie).toMatch(/Path=\/api\/auth\/ext\/google\/callback/);
        expect(setCookie).toMatch(/Max-Age=600/);
        // signed: the cookie value is not the raw state
        expect(setCookie).not.toContain(`oauth_state=${state};`);
    });

    it("accepts the callback in the browser that started the login", async () => {
        const { state, cookie } = await start();
        const res = await callback(state, cookie);
        expect(res.statusCode).toBe(308);
        expect(getUserData).toHaveBeenCalledTimes(1);
        const cleared = stateCookieOf(res);
        expect(cleared).toMatch(/Expires=Thu, 01 Jan 1970/);
    });

    it("rejects a callback without the cookie (login started by someone else)", async () => {
        const { state } = await start();
        expect((await callback(state)).statusCode).toBe(401);
        expect(getUserData).not.toHaveBeenCalled();
    });

    it("rejects a state that does not match the cookie", async () => {
        const { cookie } = await start();
        const other = await start();
        expect((await callback(other.state, cookie)).statusCode).toBe(401);
        expect(getUserData).not.toHaveBeenCalled();
    });

    it("rejects a cookie that was not signed by the server", async () => {
        const { state } = await start();
        expect((await callback(state, `oauth_state=${state}`)).statusCode).toBe(401);
        expect(getUserData).not.toHaveBeenCalled();
    });
});
