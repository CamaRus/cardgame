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
  // const userdata = ref<string | null>(null);
  const username = ref<string | null>(null);
  const email = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const avatar = ref<Parse.File | null>(null);
  // const avatarProfile = ref<string | null>(null);
  const avatarProfile = ref<Parse.File | null>(null);

  // function isValid(value: boolean) {
  //   valid.value = value;
  //   // console.log(valid);
  // }

  function getUsernameFromLocalStorage() {
    const currentUserString = localStorage.getItem(
      "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
    );
    if (currentUserString) {
      try {
        const currentUser = JSON.parse(currentUserString);
        return currentUser.username;
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return null;
      }
    }
    return null;
  }

  function getEmailFromLocalStorage() {
    const currentUserString = localStorage.getItem(
      "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
    );
    if (currentUserString) {
      try {
        const currentUser = JSON.parse(currentUserString);
        return currentUser.email;
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return null;
      }
    }
    return null;
  }

  function getUserIdFromLocalStorage() {
    const currentUserString = localStorage.getItem(
      "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
    );
    if (currentUserString) {
      try {
        const currentUser = JSON.parse(currentUserString);
        return currentUser.objectId;
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return null;
      }
    }
    return null;
  }

  function getAvatarFromLocalStorage() {
    const currentUserString = localStorage.getItem(
      "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
    );
    if (currentUserString) {
      try {
        const currentUser = JSON.parse(currentUserString);
        return currentUser.avatar;
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return null;
      }
    }
    return null;
  }

  function setAvatar(newAvatar: Parse.File | null) {
    avatarProfile.value = newAvatar;
    console.log(avatarProfile);
    console.log("Set Avatar!");
  }

  // function getDataUser() {
  //   const user = Parse.Object.extend("User");
  //   const query = new Parse.Query(user);
  //   query.get(this.userId).then(
  //     (userdata) => {
  //       // The object was retrieved successfully.
  //       const username = userdata.get("username");
  //       const avatar = userdata.get("avatar");
  //       console.log("User: ", username);
  //       console.log("Avatar: ", avatar);
  //     },
  //     (error) => {
  //       // The object was not retrieved successfully.
  //       // error is a Parse.Error with an error code and message.
  //     }
  //   );
  // }

  async function fetchUsername() {
    if (userId.value) {
      try {
        // Создаем новый объект Parse.Query для класса "_User"
        const query = new Parse.Query(Parse.User);

        // Ищем пользователя по objectId
        const user = await query.get(userId.value);

        // Получаем имя пользователя
        username.value = user.get("username");
      } catch (error) {
        console.error("Error while fetching user:", error);
      }
    } else {
      console.error("User ID is required");
    }
  }

  // function fetchUsername() {
  //   console.log("fetchUsername");
  // }

  function isValid() {
    if (process.client) {
      let token = localStorage.getItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      );
      // username.value = localStorage.getItem(
      //   "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
      // );
      username.value = getUsernameFromLocalStorage();
      // username.value = fetchUsername();
      email.value = getEmailFromLocalStorage();
      userId.value = getUserIdFromLocalStorage();
      avatar.value = getAvatarFromLocalStorage();

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
  return {
    valid,
    isValid,
    userdata,
    username,
    email,
    userId,
    avatar,
    setAvatar,
    avatarProfile,
    fetchUsername,
  };
});
