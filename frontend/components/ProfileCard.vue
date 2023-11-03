<script setup lang="ts">
import md5 from "md5";
import { User } from "~/types/IUser";
import { useI18n } from "vue-i18n";

const userCookie = useCookie("user");
const user: User = toRaw(userCookie.value?.user);

const i18n = useI18n();
</script>

<template>
    <div>
        <span class="text-dark dark:text-light font-bold text-2xl">
            {{ i18n.t("app.settings.profile.title") }}
        </span>
        <div class="flex justify-center items-center gap-2">
            <div>
                <NuxtImg
                    quality="100"
                    format="png"
                    :src="`https://www.gravatar.com/avatar/${md5(
                        user.email.trim().toLowerCase(),
                    )}`"
                    class="w-16 h-16 rounded-full"
                />
            </div>
            <div class="flex flex-col">
                <span class="text-dark dark:text-light font-bold text-xl">
                    {{ user.name }}
                </span>
                <span class="text-dark dark:text-light">
                    {{ user.email }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
