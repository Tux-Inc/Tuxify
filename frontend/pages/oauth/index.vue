<script setup lang="ts">
import { IUserCookie } from "~/types/IUserCookie";
import { User } from "~/types/IUser";

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const toast = useToast();
const userCookie = useCookie("user");
const accessToken = useRoute().query.access_token as string;
const refreshToken = useRoute().query.refresh_token as string;

async function getUser() {
    const { data, error } = await useFetch(`${runtimeConfig.public.API_AUTH_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${accessToken}`, }, });
    if (error.value) {
        toast.add({
            color: "red",
            title: `Error ${error.value.statusCode}`,
            description: error.value.message,
        });
        await router.push("/auth/sign-in");
    } else {
        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: "Success",
            description: "You are now logged in",
        });
        const user: User = Object.assign({}, data.value) as User;
        const userObject: IUserCookie = {
            user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        userCookie.value = JSON.stringify(userObject);
        await router.push("/app");
    }
}
getUser();
</script>

<style scoped>
.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite
}
.loader::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #FFF;
    animation: prixClipFix 2s linear infinite ;
}

@keyframes rotate {
    100%   {transform: rotate(360deg)}
}

@keyframes prixClipFix {
    0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
    25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
    75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
    100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
}
</style>

<template>
    <div class="h-screen w-full flex flex-col items-center justify-center">
        <span class="loader"></span>
    </div>
</template>