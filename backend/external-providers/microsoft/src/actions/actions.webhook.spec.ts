import { of } from "rxjs";
import { signUserState } from "@tuxify/common";
import { ActionsService } from "./actions.service";

describe("ActionsService webhooks (signed clientState)", () => {
    const secret = "webhook-secret";
    let emitted: { pattern: string; data: any }[];
    let service: ActionsService;
    const getEmail = jest.fn(() => of({ subject: "Hello" }));
    const getTask = jest.fn(() => of({ title: "Task" }));

    beforeEach(() => {
        process.env.MICROSOFT_WEBHOOK_SECRET = secret;
        emitted = [];
        getEmail.mockClear();
        getTask.mockClear();
        const nats = { emit: (pattern: string, data: any) => emitted.push({ pattern, data }) };
        service = new ActionsService(
            nats as any,
            { getEmail, getTask } as any,
            {} as any,
            {} as any,
        );
    });

    const outlook = (clientState: string) => ({
        value: [{ clientState, resourceData: { id: "msg-1" } }],
    });

    it("triggers the flows of the user carried by a valid clientState", async () => {
        await service.receiveEmail(outlook(signUserState(7, secret)) as any);
        expect(getEmail).toHaveBeenCalledWith({ userId: 7, input: { messageId: "msg-1" } });
        expect(emitted).toEqual([
            {
                pattern: "flows.actions",
                data: { userId: 7, actionName: "provider.microsoft.action.outlook", data: { subject: "Hello" } },
            },
        ]);
    });

    it("ignores forged clientStates, including the old <random>.<userId> format", async () => {
        for (const state of ["deadbeef.7", signUserState(7, "other-secret"), "", "7"]) {
            await service.receiveEmail(outlook(state) as any);
        }
        expect(getEmail).not.toHaveBeenCalled();
        expect(emitted).toHaveLength(0);
    });

    it("rejects every notification when no secret is configured", async () => {
        const state = signUserState(7, secret);
        delete process.env.MICROSOFT_WEBHOOK_SECRET;
        await service.receiveEmail(outlook(state) as any);
        expect(emitted).toHaveLength(0);
    });

    it("handles To Do notifications sent as { value: [...] }", async () => {
        await service.receiveTodo({
            value: [
                { clientState: "forged.3", resourceData: { id: "t0" } },
                { clientState: signUserState(3, secret), resourceData: { id: "t1" } },
            ],
        } as any);
        expect(getTask).toHaveBeenCalledTimes(1);
        expect(emitted.map((e) => e.data.userId)).toEqual([3]);
    });

    it("ignores malformed payloads", async () => {
        await service.receiveEmail({} as any);
        await service.receiveTodo(undefined as any);
        expect(emitted).toHaveLength(0);
    });
});
