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
  const username = ref<string | null>(null);
  const email = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const avatar = ref<Parse.File | null>(null);
  const avatarProfile = ref<Parse.File | null>(null);
  const svg = ref(false);
  const clearAvatar = ref(false);
  const imgDataUrl = ref<string | null>(null);
  const showCropper = ref(false);

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

  async function fetchUserData() {
    if (userId.value) {
      try {
        // Создаем новый объект Parse.Query для класса "_User"
        const query = new Parse.Query(Parse.User);

        // Ищем пользователя по objectId
        const user = await query.get(userId.value);

        // Получаем имя пользователя
        username.value = user.get("username");
        email.value = user.get("email");
        avatar.value = user.get("avatar");
      } catch (error) {
        console.error("Error while fetching user:", error);
      }
    } else {
      console.error("User ID is required");
    }
  }

  function isValid() {
    if (process.client) {
      let token = localStorage.getItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      );
      let sessionToken = localStorage.getItem("sessionToken");
      username.value = getUsernameFromLocalStorage();
      email.value = getEmailFromLocalStorage();
      userId.value = getUserIdFromLocalStorage();
      avatar.value = getAvatarFromLocalStorage();

      if (sessionToken) {
        valid.value = true;
      }
      console.log("token: ", token);
      console.log("sessionToken: ", sessionToken);
    }
  }

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
    svg,
    clearAvatar,
    imgDataUrl,
    showCropper,
    fetchUserData,
  };
});
