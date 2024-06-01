import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:loading:start", () => {
    const sessionStore = useSessionStore();
    const { isValid } = sessionStore;
    const { userf } = sessionStore;
    const { userdata } = storeToRefs(sessionStore);
    const { valid } = storeToRefs(sessionStore);
    const router = useRouter();

    isValid();
    // if (valid.value == false) {
    //   router.push("/auth");
    // }
    console.log("test.ts: ", valid.value);

    addRouteMiddleware((to, from) => {
      if (to.path === "/" || to.path === "/about") {
        if (valid.value == false) {
          console.log("valid.value: ", valid.value);
          return navigateTo("/auth");
          // return abortNavigation();
        }
        //   return false;
      }
    });
  });
});
