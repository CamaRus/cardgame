<template>
  <v-btn type="submit" color="primary" text="Выйти" @click="logout"></v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default defineComponent({
  setup() {
    const router = useRouter();

    const logout = () => {
      //   Parse.User.logOut().then(() => {
      //     const currentUser = Parse.User.current();
      //     console.log("current user: ", currentUser);
      //   });

      // Удаляем определенные значения из localStorage
      localStorage.removeItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      ); // Замените 'token' на ключ, который вы хотите удалить
      localStorage.removeItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
      ); // Замените 'user' на ключ, который вы хотите удалить
      // Перенаправляем пользователя на страницу авторизации
      router.push("/auth"); // Замените '/login' на путь к вашей странице авторизации
    };

    return { logout };
  },
});
</script>
