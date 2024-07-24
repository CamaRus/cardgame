<template>
  <div class="scroll">
    <v-app>
      <!-- <NuxtWelcome /> -->
      <NuxtPage :page-key="(route) => route.fullPath" />
      <!-- <auth-reg></auth-reg> -->
      <!-- <div>{{}}</div> -->
      <!-- <header-menu></header-menu> -->
      <!-- {{ valid }} -->
      <!-- {{ userdata }} -->
      <!-- {{ localStorageData }} -->
      <!-- <exit-button></exit-button> -->
    </v-app>
  </div>
</template>

<script setup lang="ts">
import Parse from "parse";
import { ref, onMounted, onBeforeMount } from "vue";

import { useSessionStore } from "./store/session";
import { useGameStore } from "./store/game";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { isValid } = sessionStore;
// const { userf } = sessionStore;
const { userdata } = storeToRefs(sessionStore);
const { valid } = storeToRefs(sessionStore);
// const valid = sessionStore.valid;

Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

useHead({
  title: "Cardgame",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
  script: [{ innerHTML: "console.log('Hello world')" }],
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
      crossorigin: "",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css",
      crossorigin: "",
    },
  ],
});

// Создаем реактивную переменную для хранения данных localStorage
const localStorageData = ref<string[]>([]);

// Функция для получения и вывода данных из localStorage
const getAllLocalStorageData = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log("Key:", key, "Value:", value);
    localStorageData.value.push(`Key: ${key}, Value: ${value}`);
  }
  // console.log(valid);

  // if (
  //   localStorage.getItem(
  //     "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
  //   )
  // ) {
  //   isValid(true);
  // }
};

// const validFunc = () => {
//   isValid("100");
// };

// Вызываем функцию при монтировании компонента
// onMounted(isValid);
onBeforeMount(getAllLocalStorageData);
// onBeforeMount(userf);
// console.log(
//   "local: ",
//   localStorage.getItem(
//     "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/installationId"
//   )
// )
</script>

<!-- <script setup>
import { useSessionStore } from "./store/session";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const isValid = sessionStore;
const valid = storeToRefs(sessionStore);
</script> -->

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
