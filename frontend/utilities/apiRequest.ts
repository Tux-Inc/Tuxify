import type { FetchRequest, FetchOptions, FetchResponse } from "ofetch";
import { ofetch } from "ofetch";
import { IUserCookie } from "~/types/IUserCookie";

/* Custom fetcher to handle token refresh
* Nuxt 3 useFetch() wrapper seems to not
* handle multiple fetch requests used for
* token refreshing. See https://github.com/unjs/ofetch/issues/79
* for further infos. Gwenaël HUBLER */

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

export default async <T>(request: FetchRequest, options?: FetchOptions) => {
    try {
        const response = await fetcher.raw(request, options);
        return response as FetchResponse<T>;
        console.log(response);
    } catch (error: any) {
        if (error.response?.status === 403 && useCookie<IUserCookie>("user").value.refreshToken) {
            const response = await fetcher.raw(request, options);
            return response as FetchResponse<T>;
        }
        throw error;
    }
};