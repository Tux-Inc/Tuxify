
export default defineNuxtRouteMiddleware(async (context) => {
    const router = useRouter();
    const config = useRuntimeConfig();
    if (context.path === "/") {
        if (config.public.NUXT_IS_CAPACITOR === "true") {
            await router.push("/app");
        }
    }
});
