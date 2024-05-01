import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.tuxinc.tuxify",
    appName: "Tuxify",
    webDir: "dist",
    server: {
        url: "https://tuxify.fr",
        cleartext: true,
        androidScheme: "https",
    },
}

export default config;