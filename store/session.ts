import { defineStore } from "pinia";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export const useSessionStore = defineStore("sessionStore", () => {
  const valid = ref(false);
  const userdata = ref(false);
  const username = ref();
  // let valid = "34";

  // function isValid(value: boolean) {
  //   valid.value = value;
  //   // console.log(valid);
  // }

  function isValid() {
    if (process.client) {
      let token = localStorage.getItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      );
      username.value = localStorage.getItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      );
      if (token) {
        valid.value = true;
      }
      // valid.value =
      //   localStorage.getItem(
      //     "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      //   ) || false;
      // console.log("valid: ", valid);
      console.log("token: ", token);
    }
    //   // valid.value = value;
  }

  // function userf() {
  //   const currentUser = Parse.User.current();
  //   if (currentUser) {
  //     // do stuff with the user
  //     userdata.value = true;
  //   } else {
  //     // show the signup or login page
  //     userdata.value = false;
  //   }
  // }

  // if (process.client) {
  //   const valid =
  //     localStorage.getItem(
  //       "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
  //     ) || "no";
  // }

  // return { isValid, valid };
  return { valid, isValid, userdata };
});
