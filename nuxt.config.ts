import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  hooks: {},
  ssr: false,
  css: ["@/assets/css/global.css"],
  build: {
    transpile: ["vuetify"],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  plugins: [
    "~/plugins/vuetify",
    "~/plugins/test",
    // { src: "~/plugins/back4app.js", mode: "client" },
    // "~/plugins/back4app",
  ],
  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  // },
});
