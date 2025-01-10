import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:loading:start", () => {
    const sessionStore = useSessionStore();
    const { isValid } = sessionStore;
    const { valid } = storeToRefs(sessionStore);
    const router = useRouter();
    isValid();
    addRouteMiddleware((to, from) => {
      if (to.path === "/" || to.path === "/about") {
        if (valid.value == false) {
          console.log("valid.value: ", valid.value);
          return navigateTo("/auth");
        }
      }
    });
  });
});
