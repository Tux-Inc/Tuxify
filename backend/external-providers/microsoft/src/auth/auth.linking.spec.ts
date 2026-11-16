import { of } from "rxjs";
import { AuthService } from "./auth.service";

describe("Microsoft provider linking (state from the gateway)", () => {
    const posted: string[] = [];
    const http = {
        post: (_url: string, body: string) => {
            posted.push(body);
            return { toPromise: async () => ({ data: { access_token: "a", refresh_token: "r" } }) };
        },
    };
    const service = new AuthService(http as any);

    beforeEach(() => {
        posted.length = 0;
        process.env.MICROSOFT_CLIENT_ID = "client-id";
        process.env.API_BASE_URL = "https://api.example.com";
    });

    it("puts the gateway state in the authorisation URL", async () => {
        const url = new URL(await service.addProvider({ provider: "microsoft", userId: 7, state: "gateway-state" }));
        expect(url.searchParams.get("state")).toBe("gateway-state");
    });

    it("refuses to build a URL without a state", async () => {
        await expect(service.addProvider({ provider: "microsoft", userId: 7 } as any)).rejects.toThrow();
    });

    it("links the tokens to the user verified by the gateway, whatever the state says", async () => {
        // before: the user id was read from "<nonce>.<userId>" in the state, unchecked
        const added = await service.addProviderCallback({
            provider: "microsoft",
            code: "the-code",
            state: "anything.42",
            userId: 7,
        });
        expect(added).toEqual({ userId: 7, accessToken: "a", refreshToken: "r" });
        expect(posted[0]).toContain("code=the-code");
    });

    it("rejects a callback without a verified user", async () => {
        await expect(
            service.addProviderCallback({ provider: "microsoft", code: "c", state: "anything.42" } as any),
        ).rejects.toThrow();
        expect(posted).toHaveLength(0);
    });
});
