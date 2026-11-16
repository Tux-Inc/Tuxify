import { test } from "node:test";
import assert from "node:assert/strict";
import { safeEqual, signUserState, verifyUserState } from "./security";

const secret = "test-secret";

test("a signed state gives back its user id", () => {
    const state = signUserState(42, secret);
    assert.equal(verifyUserState(state, secret), 42);
    assert.ok(state.length < 128, "Microsoft Graph limits clientState to 128 characters");
});

test("two states for the same user differ", () => {
    assert.notEqual(signUserState(42, secret), signUserState(42, secret));
});

test("a state signed with another secret is rejected", () => {
    assert.equal(verifyUserState(signUserState(42, "other"), secret), null);
});

test("a forged or tampered state is rejected", () => {
    const [, nonce, signature] = signUserState(42, secret).split(".");
    assert.equal(verifyUserState(`43.${nonce}.${signature}`, secret), null);
    assert.equal(verifyUserState("42.abc", secret), null);
    assert.equal(verifyUserState("x.42", secret), null);
    assert.equal(verifyUserState(undefined, secret), null);
    assert.equal(verifyUserState(signUserState(42, secret), ""), null);
});

test("signing requires a secret and a valid user id", () => {
    assert.throws(() => signUserState(42, ""));
    assert.throws(() => signUserState(-1, secret));
    assert.throws(() => signUserState(1.5, secret));
});

test("safeEqual compares strings", () => {
    assert.equal(safeEqual("abc", "abc"), true);
    assert.equal(safeEqual("abc", "abd"), false);
    assert.equal(safeEqual("abc", "abcd"), false);
    assert.equal(safeEqual(undefined, "abc"), false);
    assert.equal(safeEqual("", ""), true);
});
