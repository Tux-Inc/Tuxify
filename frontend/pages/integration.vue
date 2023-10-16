<script lang="ts" setup xmlns="http://www.w3.org/1999/html">
import { useI18n } from "vue-i18n";
import { IIntegrationList } from "~/types/IIntegrationList";

definePageMeta({
    layout: "navigation",
});

const i18n = useI18n();
let integrations = ref<IIntegrationList[]>(i18n.tm<IIntegrationList[]>("landing.integration.services") as IIntegrationList[]);
onUpdated(() => {
    integrations.value = i18n.tm<IIntegrationList[]>("landing.integration.services") as IIntegrationList[];
});

function checkIntegration(integration: IIntegrationList[], index: number) {
    if (index === integration.length - 1 && integration.length % 3 === 0) {
        return "";
    } else if (index === integration.length - 2 && integration.length % 2 === 0 && integration.length % 3 !== 0) {
        return "md:col-start-2";
    } else if (index === integration.length - 1 && integration.length % 3 === 0) {
        return "md:col-start-2";
    } else if (index === integration.length - 1 && (integration.length + 1) % 3 !== 0) {
        return "md:col-start-3";
    }
}

</script>

<template>
    <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div class="relative z-[1] text-center">
                <h1 class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                    v-html="i18n.t('landing.integration.title')" />
                <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                    {{ i18n.t("landing.integration.description") }}
                </p>
            </div>
        </div>
        <div
            class="mt-10 flex flex-wrap justify-centermax text-center mx-auto my-auto grid sm:grid-cols-1 gap-8 md:grid-cols-6 text-5xl md:text-6xl">
            <IntegrationList
                v-for="(integration, index) in integrations"
                :class="`${checkIntegration(integrations, index)}`"
                :description="integration.description"
                :icon="integration.icon"
                :title="integration.title"
                class="md:col-span-2 flex flex-col justify-center"
            />
        </div>
    </div>
</template>
