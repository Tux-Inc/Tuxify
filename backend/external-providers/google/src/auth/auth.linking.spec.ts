import { of } from "rxjs";
import { AuthService } from "./auth.service";
import { OAuthClass } from "./classes/oauth.class";

describe("Google provider linking (state from the gateway)", () => {
    const service = new AuthService({ post: () => of({ data: {} }) } as any);

    beforeEach(() => {
        process.env.GOOGLE_CLIENT_ID = "client-id";
        process.env.API_BASE_URL = "https://api.example.com";
    });

    afterEach(() => jest.restoreAllMocks());

    it("puts the gateway state in the authorisation URL, for each user independently", async () => {
        const first = new URL(await service.addProvider({ provider: "google", userId: 1, state: "state-of-user-1" }));
        const second = new URL(await service.addProvider({ provider: "google", userId: 2, state: "state-of-user-2" }));
        expect(first.searchParams.get("state")).toBe("state-of-user-1");
        expect(second.searchParams.get("state")).toBe("state-of-user-2");
        expect(first.searchParams.get("redirect_uri")).toBe("https://api.example.com/providers/google/callback");
    });

    it("refuses to build a URL without a state", async () => {
        await expect(service.addProvider({ provider: "google", userId: 1 } as any)).rejects.toThrow();
    });

    it("links the tokens to the user given by the gateway, not to the state", async () => {
        const getToken = jest
            .spyOn(OAuthClass.prototype, "getToken")
            .mockImplementation(async (_code: string, userId: number) => ({ accessToken: "a", refreshToken: "r", userId }));
        // a linking started by user 1 no longer breaks when user 2 starts one in between
        await service.addProvider({ provider: "google", userId: 1, state: "s1" });
        await service.addProvider({ provider: "google", userId: 2, state: "s2" });
        const added = await service.addProviderCallback({ provider: "google", code: "c", state: "1-anything", userId: 1 });
        expect(added.userId).toBe(1);
        expect(getToken).toHaveBeenCalledWith("c", 1);
    });

    it("rejects a callback without a verified user", async () => {
        await expect(
            service.addProviderCallback({ provider: "google", code: "c", state: "x-42" } as any),
        ).rejects.toThrow();
    });
});
