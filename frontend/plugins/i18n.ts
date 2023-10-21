import { createI18n } from "vue-i18n";
import en from "~/locales/en.json";
import fr from "~/locales/fr.json";

export default defineNuxtPlugin(({ vueApp }) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        warnHtmlMessage: false,
        locale: "en",
        messages: {
            en,
            fr,
        },
    });
    vueApp.use(i18n);
});
