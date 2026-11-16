// Security checks of the gateway HTTP surface (RAPPORT step 2a).
// The app is configured exactly like main.ts; NATS is replaced by a fake client
// that records every message the gateway would send.
process.env.NODE_ENV = "production"; // no Devtools HTTP server during the tests
process.env.GMAIL_PUSH_TOKEN = "gmail-push-token";
process.env.PROVIDER_STATE_SECRET = "provider-state-secret";

import * as request from "supertest";
import { Observable, of, throwError } from "rxjs";
import { Test } from "@nestjs/testing";
import { RpcException } from "@nestjs/microservices";
import { signExpiringUserState, verifyExpiringUserState } from "@tuxify/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { configureApp } from "../src/app.setup";
import { GatewayModule } from "../src/gateway.module";

const USER_ID = 42;
const TOKEN = "valid-token";
const FLOW_ID = "0b7f5c2e-4f6e-4c8a-9a39-2f1d7f1d2a10";

type Message = { pattern: string; data: any };

class FakeNatsClient {
    sent: Message[] = [];
    emitted: Message[] = [];

    send(pattern: string, data: any): Observable<any> {
        if (pattern === "auth.jwt.verify") {
            return data === TOKEN
                ? of(USER_ID)
                : throwError(() => new RpcException("Invalid token"));
        }
        this.sent.push({ pattern, data });
        return of(pattern === "providers.google.add.callback" ? "https://tuxify.fr/app/services" : { ok: true });
    }

    emit(pattern: string, data: any): Observable<any> {
        this.emitted.push({ pattern, data });
        return of(undefined);
    }

    connect = async () => undefined;
    close = async () => undefined;
}

const step = (name: string, type: "action" | "reaction") => ({
    uuid: "s1",
    type,
    name,
    title: "Step",
    service: { name: "google", image: "https://example.com/g.svg" },
    inputs: [{ name: "to", title: "To", value: "a@b.c" }],
    outputs: [{ name: "id", title: "Id" }],
});

describe("Gateway security (e2e)", () => {
    let app: NestExpressApplication;
    let nats: FakeNatsClient;
    const auth = { Authorization: `Bearer ${TOKEN}` };

    beforeAll(async () => {
        nats = new FakeNatsClient();
        const moduleRef = await Test.createTestingModule({ imports: [GatewayModule] })
            .overrideProvider("NATS_CLIENT")
            .useValue(nats)
            .compile();
        app = moduleRef.createNestApplication<NestExpressApplication>();
        configureApp(app);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        nats.sent = [];
        nats.emitted = [];
    });

    describe("flows", () => {
        it("requires a valid bearer token", async () => {
            await request(app.getHttpServer()).get("/flows").expect(401);
            await request(app.getHttpServer())
                .get("/flows")
                .set("Authorization", "Bearer forged")
                .expect(403);
            expect(nats.sent).toHaveLength(0);
        });

        it("rejects a step whose name is an internal NATS subject", async () => {
            for (const name of ["auth.jwt.verify", "providers.google.getTokens", "provider.google.action.>"]) {
                await request(app.getHttpServer())
                    .post("/flows")
                    .set(auth)
                    .send({ name: "evil", data: [step(name, "reaction")] })
                    .expect(400);
            }
            expect(nats.sent).toHaveLength(0);
        });

        it("rejects a step whose type does not match its name", async () => {
            await request(app.getHttpServer())
                .post("/flows")
                .set(auth)
                .send({ name: "f", data: [step("provider.google.reaction.gmail.send", "action")] })
                .expect(400);
        });

        it("creates a flow for the authenticated user only, without client-set fields", async () => {
            await request(app.getHttpServer())
                .post("/flows")
                .set(auth)
                .send({
                    name: "My flow",
                    userId: 1,
                    _id: "forced-id",
                    lastRun: "2020-01-01",
                    data: [
                        step("provider.google.action.gmail.receive", "action"),
                        step("provider.google.reaction.gmail.send", "reaction"),
                    ],
                })
                .expect(201);
            expect(nats.sent).toHaveLength(1);
            const { pattern, data } = nats.sent[0];
            expect(pattern).toBe("flow.create");
            expect(data.userId).toBe(USER_ID);
            expect(data._id).toBeUndefined();
            expect(data.lastRun).toBeUndefined();
            expect(data.data[0].service).toEqual({ name: "google", image: "https://example.com/g.svg" });
            expect(data.data[1].inputs[0]).toEqual({ name: "to", title: "To", value: "a@b.c" });
        });

        it("updates a flow with the id from the URL and the authenticated user", async () => {
            await request(app.getHttpServer())
                .put(`/flows/${FLOW_ID}`)
                .set(auth)
                .send({ name: "Renamed", _id: "other", userId: 1, enabled: true })
                .expect(200);
            expect(nats.sent[0]).toEqual({
                pattern: "flow.update",
                data: { name: "Renamed", enabled: true, _id: FLOW_ID, userId: USER_ID },
            });
        });

        it("rejects flow ids that are not UUIDs", async () => {
            await request(app.getHttpServer()).get("/flows/not-a-uuid").set(auth).expect(400);
            await request(app.getHttpServer()).delete("/flows/1;drop").set(auth).expect(400);
            expect(nats.sent).toHaveLength(0);
        });

        it("only triggers provider actions manually", async () => {
            await request(app.getHttpServer())
                .post("/flows/actions/providers.google.getTokens")
                .set(auth)
                .send({})
                .expect(400);
            await request(app.getHttpServer())
                .post("/flows/actions/provider.google.action.gmail.receive")
                .set(auth)
                .send({ subject: "hi" })
                .expect(201);
            expect(nats.sent).toEqual([
                {
                    pattern: "flows.actions",
                    data: { userId: USER_ID, actionName: "provider.google.action.gmail.receive", data: { subject: "hi" } },
                },
            ]);
        });
    });

    describe("providers", () => {
        it("only accepts registered providers in subjects", async () => {
            for (const provider of ["evil", "google.add", "*", "%3E"]) {
                await request(app.getHttpServer()).get(`/providers/${provider}/add`).set(auth).expect(404);
            }
            expect(nats.sent).toHaveLength(0);
        });
    });

    describe("provider linking (OAuth state)", () => {
        const SECRET = "provider-state-secret";
        const linkCookieOf = (res: request.Response): string | undefined =>
            ([res.headers["set-cookie"]].flat().filter(Boolean) as string[]).find((c) =>
                c.startsWith("tuxify_link_state="),
            );

        /** Starts a linking as USER_ID and returns the state sent to the provider and the cookie. */
        async function startLinking(provider = "google") {
            const res = await request(app.getHttpServer()).get(`/providers/${provider}/add`).set(auth).expect(200);
            const message = nats.sent.find((m) => m.pattern === `providers.${provider}.add`);
            const setCookie = linkCookieOf(res);
            return { state: message?.data.state as string, setCookie, cookie: setCookie?.split(";")[0], message };
        }

        const callback = (state: string, cookie?: string, provider = "google") => {
            const req = request(app.getHttpServer()).get(
                `/providers/${provider}/callback?code=abc&state=${encodeURIComponent(state)}`,
            );
            return cookie ? req.set("Cookie", cookie) : req;
        };

        it("creates a signed state for the authenticated user and sets it as an httpOnly cookie", async () => {
            const { state, setCookie, message } = await startLinking();
            expect(message?.data).toEqual({ provider: "google", userId: USER_ID, state });
            expect(verifyExpiringUserState(state, SECRET)).toBe(USER_ID);
            expect(setCookie).toMatch(/HttpOnly/i);
            expect(setCookie).toMatch(/SameSite=Lax/i);
            expect(setCookie).toMatch(/Path=\/providers\/google\/callback/);
        });

        it("links the account of the user who started it, taken from the verified state", async () => {
            const { state, cookie } = await startLinking();
            nats.sent = [];
            await callback(state, cookie).expect(302).expect("Location", "https://tuxify.fr/app/services");
            expect(nats.sent).toEqual([
                {
                    pattern: "providers.google.add.callback",
                    data: { provider: "google", code: "abc", state, userId: USER_ID },
                },
            ]);
        });

        it("rejects a callback opened in another browser (no cookie)", async () => {
            const { state } = await startLinking();
            nats.sent = [];
            await callback(state).expect(403);
            expect(nats.sent).toHaveLength(0);
        });

        it("rejects a linking link started by someone else", async () => {
            // the attacker starts a linking for their own account and sends the URL to a victim
            const attackerState = signExpiringUserState(666, SECRET, 600);
            const { cookie: victimCookie } = await startLinking();
            nats.sent = [];
            await callback(attackerState, victimCookie).expect(403);
            expect(nats.sent).toHaveLength(0);
        });

        it("rejects forged, tampered or expired states even with a matching cookie", async () => {
            const forged = "deadbeef-42";
            const [, exp, nonce, signature] = signExpiringUserState(USER_ID, SECRET, 600).split(".");
            const tampered = `666.${exp}.${nonce}.${signature}`;
            const expired = signExpiringUserState(USER_ID, SECRET, 600, Date.now() - 3600_000);
            const otherSecret = signExpiringUserState(USER_ID, "other", 600);
            for (const state of [forged, tampered, expired, otherSecret]) {
                await callback(state, `tuxify_link_state=${encodeURIComponent(state)}`).expect(403);
            }
            expect(nats.sent).toHaveLength(0);
        });

        it("refuses to start a linking when PROVIDER_STATE_SECRET is not set", async () => {
            delete process.env.PROVIDER_STATE_SECRET;
            try {
                await request(app.getHttpServer()).get("/providers/google/add").set(auth).expect(503);
                expect(nats.sent).toHaveLength(0);
            } finally {
                process.env.PROVIDER_STATE_SECRET = SECRET;
            }
        });

        it("lets the frontend send credentials (cookie) to the API", async () => {
            const res = await request(app.getHttpServer())
                .get("/providers/infos")
                .set("Origin", "http://localhost:8080");
            expect(res.headers["access-control-allow-credentials"]).toBe("true");
        });
    });

    describe("webhooks", () => {
        it("rejects unknown webhooks", async () => {
            for (const path of ["github/action/issue.create", "google/action/gmail.>", "microsoft/action/outlook.x", "evil/action/x"]) {
                await request(app.getHttpServer()).post(`/providers/${path}`).send({}).expect(404);
            }
            expect(nats.emitted).toHaveLength(0);
        });

        it("authenticates Gmail push notifications with GMAIL_PUSH_TOKEN", async () => {
            await request(app.getHttpServer()).post("/providers/google/action/gmail.receive").send({}).expect(401);
            await request(app.getHttpServer())
                .post("/providers/google/action/gmail.receive?token=wrong")
                .send({})
                .expect(401);
            expect(nats.emitted).toHaveLength(0);
            await request(app.getHttpServer())
                .post("/providers/google/action/gmail.receive?token=gmail-push-token")
                .send({ message: { data: "e30=" } })
                .expect(202);
            expect(nats.emitted).toEqual([
                { pattern: "provider.google.action.gmail.receive", data: { message: { data: "e30=" } } },
            ]);
        });

        it("answers the Microsoft Graph validation handshake without forwarding it", async () => {
            const res = await request(app.getHttpServer())
                .post("/providers/microsoft/action/outlook?validationToken=Validation%3A%20abc")
                .expect(200);
            expect(res.text).toBe("Validation: abc");
            expect(res.headers["content-type"]).toMatch(/^text\/plain/);
            expect(nats.emitted).toHaveLength(0);
        });

        it("forwards Microsoft notifications for the Microsoft service to verify", async () => {
            await request(app.getHttpServer())
                .post("/providers/microsoft/action/todo")
                .send({ value: [{ clientState: "x" }] })
                .expect(202);
            expect(nats.emitted).toEqual([
                { pattern: "provider.microsoft.action.todo", data: { value: [{ clientState: "x" }] } },
            ]);
        });
    });

    describe("HTTP hardening", () => {
        it("sets security headers", async () => {
            const res = await request(app.getHttpServer()).get("/providers/infos").expect(200);
            expect(res.headers["x-content-type-options"]).toBe("nosniff");
            expect(res.headers["x-powered-by"]).toBeUndefined();
        });

        it("only allows the configured CORS origins", async () => {
            const allowed = await request(app.getHttpServer())
                .get("/providers/infos")
                .set("Origin", "http://localhost:8080");
            expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:8080");
            const denied = await request(app.getHttpServer())
                .get("/providers/infos")
                .set("Origin", "https://evil.example");
            expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
        });
    });
});
