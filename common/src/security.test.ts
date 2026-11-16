import { test } from "node:test";
import assert from "node:assert/strict";
import {
    safeEqual,
    signExpiringUserState,
    signUserState,
    verifyExpiringUserState,
    verifyUserState,
} from "./security";

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

test("an expiring state gives back its user id until it expires", () => {
    const now = 1_700_000_000_000;
    const state = signExpiringUserState(7, secret, 600, now);
    assert.equal(verifyExpiringUserState(state, secret, now), 7);
    assert.equal(verifyExpiringUserState(state, secret, now + 599_000), 7);
    assert.equal(verifyExpiringUserState(state, secret, now + 601_000), null);
});

test("an expiring state cannot be tampered with", () => {
    const now = 1_700_000_000_000;
    const [id, exp, nonce, signature] = signExpiringUserState(7, secret, 600, now).split(".");
    assert.equal(verifyExpiringUserState(`8.${exp}.${nonce}.${signature}`, secret, now), null);
    assert.equal(verifyExpiringUserState(`${id}.${Number(exp) + 3600}.${nonce}.${signature}`, secret, now), null);
    assert.equal(verifyExpiringUserState(signExpiringUserState(7, "other", 600, now), secret, now), null);
    assert.equal(verifyExpiringUserState(signUserState(7, secret), secret, now), null);
    assert.equal(verifyExpiringUserState("7-abcdef", secret, now), null);
});
