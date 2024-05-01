/*
File Name: 02.auth.global.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Middleware to redirect to /auth/sign-in if the user is not logged in

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { IUserCookie } from "~/types/IUserCookie";
import { CookieRef } from "#app";

export default defineNuxtRouteMiddleware(async (context) => {
    const userCookie: CookieRef<IUserCookie> = useCookie<IUserCookie>("user");
    const router = useRouter();
    if (context.path.startsWith("/app")) {
        if (!userCookie.value) {
            await router.push("/auth/sign-in");
        }
        // TODO: check if the access token is expired
    }
    if (context.path.startsWith("/auth")) {
        if (userCookie.value) {
            await router.push("/app");
        }
    }
});
