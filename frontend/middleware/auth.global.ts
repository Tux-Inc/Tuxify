export default defineNuxtRouteMiddleware(async (context) => {
    const userCookie = useCookie('user');
    const router = useRouter();
    if (context.path.startsWith('/app')) {
        if (!toRaw(userCookie.value)) {
            console.log('User not logged in');
            await router.push('/auth/sign-in');
        }
        // TODO: check if the access token is expired
    }
})