import { useSessionStore } from "~/store/session";
import { storeToRefs } from "pinia";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

const sessionStore = useSessionStore();
const { isValid } = sessionStore;
const { valid } = storeToRefs(sessionStore);
const { userdata } = storeToRefs(sessionStore);

// const valid = sessionStore.valid;
// let validValue = null;
// if (process.client) {
//   validValue = localStorage.getItem(
//     "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
//   );
// }

// const storedValue = ref(
//   localStorage.getItem(
//     "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
//   ) || 'no'
// );

// let userLog = false;

// userLog = Parse.User.current();

export default defineNuxtRouteMiddleware((to, from) => {
  // isValid();
  // const currentUser = Parse.User.current();
  // if (userdata.value == false) {
  //   console.log("userlog: ", userdata.value);
  //   return navigateTo("/auth");
  // } else {
  //   console.log("userlog: ", userdata.value);
  // }

  if (valid.value == false) {
    return navigateTo("/auth");
    // return abortNavigation();
  }
});
