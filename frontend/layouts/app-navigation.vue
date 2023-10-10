<script setup lang="ts">
const toast = useToast();
const router = useRouter();
const commandPaletteRef = ref();
const { metaSymbol } = useShortcuts();
const isNewFlowModalOpen = ref(false);
const isCommandPaletteOpen = ref(false);
const { $listen, $event } = useNuxtApp();

const sendEvent = (event: string) => {
    isCommandPaletteOpen.value = false;
    $event(event);
};

defineShortcuts({
    meta_k: {
        usingInput: true,
        handler: () => {
            isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
        },
    },
    meta_shift_f: {
        usingInput: true,
        handler: () => {
            isNewFlowModalOpen.value = !isNewFlowModalOpen.value;
        },
    },
});

$listen("app:newFlow", () => {
    isNewFlowModalOpen.value = !isNewFlowModalOpen.value;
});

$listen("app:commandPalette", () => {
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
});

const users = [
    {
        id: "benjamincanac",
        label: "benjamincanac",
        href: "https://github.com/benjamincanac",
        target: "_blank",
        avatar: { src: "https://avatars.githubusercontent.com/u/739984?v=4" },
    },
    {
        id: "Atinux",
        label: "Atinux",
        href: "https://github.com/Atinux",
        target: "_blank",
        avatar: { src: "https://avatars.githubusercontent.com/u/904724?v=4" },
    },
    {
        id: "smarroufin",
        label: "smarroufin",
        href: "https://github.com/smarroufin",
        target: "_blank",
        avatar: { src: "https://avatars.githubusercontent.com/u/7547335?v=4" },
    },
];
const actions = [
    {
        id: "new-flow",
        label: "Create a new flow",
        icon: "i-heroicons-link",
        click: () => sendEvent("app:newFlow"),
        shortcuts: [metaSymbol, "shift", "F"],
    },
    {
        id: "new-team",
        label: "Create a new team",
        icon: "i-heroicons-user-group",
        click: () => toast.add({ title: "New team added!" }),
        shortcuts: [metaSymbol, "shift", "T"],
    },
    {
        id: "report",
        label: "Report a bug",
        icon: "i-heroicons-bug-ant",
        click: () => toast.add({ title: "Bug reported!" }),
        shortcuts: ["⌘", "R"],
    },
];

const groups = computed(() =>
    [commandPaletteRef.value?.query ? {
        key: "users",
        commands: users,
    } : {
        key: "recent",
        label: "Recent searches",
        commands: users.slice(0, 1),
    }, {
        key: "actions",
        commands: actions,
    }].filter(Boolean));

function onSelect(option: any) {
    if (option.click) {
        option.click();
    } else if (option.to) {
        router.push(option.to);
    } else if (option.href) {
        window.open(option.href, "_blank");
    }
}

const route = useRoute();

const pages = [
    {
        path: "app",
        name: "Home",
    },
    {
        path: "app-flows",
        name: "Flows",
    },
    {
        path: "app-services",
        name: "Services",
    },
    {
        path: "app-settings",
        name: "Settings",
    },
];

const getHeaderTitle = (routeName: string): string => {
    let title = "Home";
    pages.forEach(page => {
        if (page.path === routeName) {
            title = page.name;
        }
    });
    return title;
};

</script>

<template>
    <div class="antialiased min-h-screen bg-base-light dark:bg-base-dark">
        <div class="md:hidden">
            <MobileHeaderBar :title="getHeaderTitle(String(route.name))" />
            <div class="p-4 my-[calc((var(--mobile-menu-height)))]">
                <slot />
            </div>
            <MobileNavigator />
        </div>
        <div class="hidden md:block">
            <AppNavbar />
            <div class="flex flex-row items-start justify-start">
                <AppSidebar />
                <div class="w-full h-full overflow-y-auto ml-[--sidebar-width] mt-[--header-height] p-6">
                    <slot />
                </div>
            </div>
        </div>
        <UModal v-model="isCommandPaletteOpen">
            <UCommandPalette ref="commandPaletteRef" :groups="groups" @update:model-value="onSelect" />
        </UModal>
        <UModal v-model="isNewFlowModalOpen">
            <AppFlowNewForm />
        </UModal>
    </div>
</template>
