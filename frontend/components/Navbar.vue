<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const colorMode = useColorMode();

const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set() {
        colorMode.value = colorMode.value === "dark" ? "light" : "dark";
    },
});

const i18n = useI18n();
let availableLocales = computed(() => i18n.availableLocales);

const localesItems = [];
for (const locale of availableLocales.value) {
    localesItems.push([{
        label: i18n.t(`locales.${locale}`),
        icon: "i-heroicons-globe-alt",
        click: () => i18n.locale.value = locale,
    }]);
}
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
        <div class="flex items-center justify-between gap-3 h-[--header-height] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div class="flex items-center justify-start gap-4">
                <NuxtLink to="/">
                    <svg class="h-8 fill-primary dark:fill-base-light" viewBox="0 0 2262 782" aria-label="Tuxify Logo"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M198.863 302.876C164.945 208.09 49.406 202.205 0 208.09C11.8797 194.451 47.4614 175.075 82.2401 142.113C111.209 114.658 137.202 75.4932 170.985 43.61C222.095 0.86487 272.275 -2.19441 308.981 0.864822C370.313 5.97645 469.279 31.9951 469.279 147.224C464.633 302.876 377.747 351.727 353.586 426.468C329.425 501.209 353.586 554.307 353.586 554.307C353.586 554.307 357.767 473.991 422.816 450.229C487.865 426.468 541.298 366.131 541.298 366.131C564.065 506.915 436.526 516.607 400.514 652.28C380.535 727.55 431.18 781.554 422.816 778.195C198.863 688.258 243.932 466.891 252.76 426.468C267.981 356.773 389.363 88.115 222.095 90.0737C164.599 90.7469 131.956 113.77 136.602 152.334C141.248 190.899 185.573 211.66 198.863 242.473C214.695 279.179 198.863 302.876 198.863 302.876Z" />
                        <path
                            d="M186.319 127.71V148.618H161.229C161.229 148.618 161.228 186.718 190.036 186.718C210.944 186.718 221.631 177.954 221.631 156.581C221.631 137.996 210.014 127.71 186.319 127.71Z" />
                        <path
                            d="M750.6 621V208.2H832.8V621H750.6ZM616.2 271.8V199.2H967.2V271.8H616.2ZM1080.15 627C1054.55 627 1031.75 621.6 1011.75 610.8C992.15 600 976.75 585 965.55 565.8C954.35 546.6 948.75 524.4 948.75 499.2V331.2H1027.95V497.4C1027.95 509.4 1029.95 519.8 1033.95 528.6C1037.95 537 1043.95 543.4 1051.95 547.8C1059.95 552.2 1069.35 554.4 1080.15 554.4C1096.55 554.4 1109.35 549.4 1118.55 539.4C1127.75 529.4 1132.35 515.4 1132.35 497.4V331.2H1210.95V499.2C1210.95 524.8 1205.35 547.2 1194.15 566.4C1183.35 585.6 1167.95 600.6 1147.95 611.4C1128.35 621.8 1105.75 627 1080.15 627ZM1454.74 621L1378.54 503.4L1362.34 491.4L1249.54 331.2H1342.54L1412.74 437.4L1427.74 448.8L1547.14 621H1454.74ZM1243.54 621L1361.74 455.4L1406.74 508.8L1332.34 621H1243.54ZM1430.74 490.8L1384.54 438L1453.54 331.2H1541.74L1430.74 490.8ZM1587.6 621V331.2H1666.8V621H1587.6ZM1627.2 284.4C1614.4 284.4 1603.8 280.2 1595.4 271.8C1587 263 1582.8 252.2 1582.8 239.4C1582.8 227 1587 216.4 1595.4 207.6C1603.8 198.8 1614.4 194.4 1627.2 194.4C1640.4 194.4 1651 198.8 1659 207.6C1667.4 216.4 1671.6 227 1671.6 239.4C1671.6 252.2 1667.4 263 1659 271.8C1651 280.2 1640.4 284.4 1627.2 284.4ZM1774.83 621V300C1774.83 276.8 1779.83 256.4 1789.83 238.8C1799.83 220.8 1814.03 206.6 1832.43 196.2C1850.83 185.8 1872.43 180.6 1897.23 180.6C1916.03 180.6 1932.23 183.8 1945.83 190.2C1959.43 196.6 1971.63 205.4 1982.43 216.6L1932.63 267C1928.23 262.6 1923.43 259.2 1918.23 256.8C1913.03 254.4 1906.43 253.2 1898.43 253.2C1884.03 253.2 1872.83 257.2 1864.83 265.2C1857.23 272.8 1853.43 283.8 1853.43 298.2V621H1774.83ZM1707.63 400.2V331.2H1939.23V400.2H1707.63ZM2071.97 623.4L1950.77 331.2H2035.97L2116.37 554.4H2087.57L2170.97 331.2H2256.77L2127.77 622.8L2071.97 623.4ZM1991.57 742.2L2079.77 555.6L2127.77 622.8L2074.97 742.2H1991.57Z" />
                    </svg>
                </NuxtLink>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <UButton to="/" size="lg" color="gray" variant="ghost" :label="i18n.t('landing.navbar.home')" />
                <UButton to="/pricing" size="lg" color="gray" variant="ghost">{{
                        i18n.t("landing.navbar.pricing")
                    }}
                </UButton>
                <UButton to="/about-us" size="lg" color="gray" variant="ghost">{{
                        i18n.t("landing.navbar.aboutUs")
                    }}
                </UButton>
                <UButton to="https://github.com/tux-inc/Tuxify/releases" size="lg" color="gray" variant="ghost">
                    {{ i18n.t("landing.navbar.changelog") }}
                </UButton>
                <UButton to="https://github.com/tux-inc/Tuxify/wiki" size="lg" color="gray" variant="ghost">
                    {{ i18n.t("landing.navbar.documentation") }}
                </UButton>
                <UButton to="/integration" size="lg" color="gray" variant="ghost">{{
                        i18n.t("landing.navbar.integration")
                    }}
                </UButton>
                <UButton to="/contact" size="lg" color="gray" variant="ghost"
                         :label="i18n.t('landing.navbar.contact')" />
            </div>
            <div class="flex gap-2 items-center">
                <ClientOnly>
                    <UButton
                        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                        color="gray"
                        variant="ghost"
                        aria-label="Theme"
                        @click="isDark = !isDark"
                    />
                    <UDropdown class="ml-2.5" :items="localesItems"
                               :ui="{ item: { disabled: 'cursor-text select-text' } }"
                               :popper="{ placement: 'bottom-start' }">
                        <UButton
                            icon="i-heroicons-language"
                            color="gray"
                            variant="ghost"
                            aria-label="Language"
                        />
                    </UDropdown>
                </ClientOnly>
                <UButton
                    icon="i-heroicons-arrow-right-on-rectangle"
                    to="/auth/sign-in"
                    color="primary"
                    variant="solid"
                    :aria-label="i18n.t('auth.signIn')"
                    :label="i18n.t('auth.signIn')"
                />
            </div>
        </div>
    </header>
</template>