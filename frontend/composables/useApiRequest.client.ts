/*
File Name: useApiRequest.client.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Brief description of the contents of this file.

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import type { FetchRequest, FetchOptions, FetchResponse } from "ofetch";
import { ofetch } from "ofetch";
import { IUserCookie } from "~/types/IUserCookie";

/* Custom fetcher to handle token refresh
* Nuxt 3 useFetch() wrapper seems to not
* handle multiple fetch requests used for
* token refreshing. See https://github.com/unjs/ofetch/issues/79
* for further infos. Gwenaël HUBLER */


export const useApiRequest = async <T>(request: FetchRequest, options?: FetchOptions) => {
    const fetcher = ofetch.create({
        baseURL: useRuntimeConfig().public.API_BASE_URL,
        async onRequest({ options }) {
            const userCookie = useCookie<IUserCookie>("user");
            const user: IUserCookie = userCookie.value;
            const accessToken: string = user?.accessToken;
    
            if (accessToken) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                };
            }
        },
        async onResponse({ response }) {
            if (response.status === 403 && useCookie<IUserCookie>("user").value.refreshToken) {
                const { accessToken } = await ofetch("/auth/refresh-access", {
                    baseURL: useRuntimeConfig().public.API_AUTH_BASE_URL + "/api",
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${useCookie<IUserCookie>("user").value.refreshToken}`,
                    },
                });
                if (!accessToken) {
                    await useRouter().push("/auth/sign-in");
                    useToast().add({
                        color: "red",
                        icon: "i-heroicons-exclamation-triangle",
                        title: "Session expired",
                        description: "Your session has expired. Please log in again.",
                    });
                }
                useCookie<IUserCookie>("user").value.accessToken = accessToken;
            }
        },
    });

    try {
        const response = await fetcher.raw(request, options);
        return response as FetchResponse<T>;
    } catch (error: any) {
        if (error.response?.status === 403 && useCookie<IUserCookie>("user").value.refreshToken) {
            const response = await fetcher.raw(request, options);
            return response as FetchResponse<T>;
        }
        throw error;
    }
};
