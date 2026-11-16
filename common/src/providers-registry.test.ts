import { test } from "node:test";
import assert from "node:assert/strict";
import { isProviderName, isProviderStepName, isWebhookScope } from "./providers-registry";

test("known provider step names are accepted", () => {
    for (const name of [
        "provider.google.action.gmail.receive",
        "provider.github.reaction.issue.comment.reaction.create",
        "provider.microsoft.reaction.tasks.list.create",
        "provider.microsoft.action.outlook",
    ]) assert.equal(isProviderStepName(name), true, name);
});

test("internal or malformed subjects are rejected", () => {
    for (const name of [
        "auth.jwt.verify",
        "providers.google.getTokens",
        "providers.*.getAllTokens",
        "flows.actions",
        "provider.google.action",
        "provider.unknown.action.x",
        "provider.google.action.>",
        "provider.google.action.*",
        "provider.google.action.gmail receive",
        "provider.google.action.gmail..receive",
        "",
        42,
    ]) assert.equal(isProviderStepName(name), false, String(name));
});

test("the step type must match the subject", () => {
    assert.equal(isProviderStepName("provider.google.reaction.gmail.send", "reaction"), true);
    assert.equal(isProviderStepName("provider.google.reaction.gmail.send", "action"), false);
});

test("provider names and webhook scopes are whitelisted", () => {
    assert.equal(isProviderName("google"), true);
    assert.equal(isProviderName("google.add"), false);
    assert.equal(isWebhookScope("google", "gmail.receive"), true);
    assert.equal(isWebhookScope("microsoft", "outlook"), true);
    assert.equal(isWebhookScope("github", "issue.create"), false);
    assert.equal(isWebhookScope("microsoft", "outlook.>"), false);
});
