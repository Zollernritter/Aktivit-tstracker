
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    base: "/Aktivit-tstracker/",

    build: {
        rollupOptions: {
            input: {
                index: resolve(process.cwd(), "index.html"),
                login: resolve(process.cwd(), "login.html"),
                auswertung: resolve(process.cwd(), "auswertung.html")
            }
        }
    }
});