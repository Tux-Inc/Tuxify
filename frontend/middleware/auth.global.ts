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
