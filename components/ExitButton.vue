<template>
  <v-btn class="ma-2" @click="logout">
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <!-- <title>выйти</title> -->
      <path
        fill="black"
        d="M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z"
      />
    </svg>
    <span>Выйти</span>
  </v-btn>
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
      localStorage.removeItem("sessionToken");
      // Удаляем определенные значения из localStorage
      localStorage.removeItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
      ); // Замените 'token' на ключ, который вы хотите удалить
      localStorage.removeItem(
        "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
      );
      // Перенаправляем пользователя на страницу авторизации
      router.push("/auth");
    };

    return { logout };
  },
});
</script>

<style scoped>
span {
  padding-left: 5px;
}
</style>
