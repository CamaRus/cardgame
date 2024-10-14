<template>
  <div>
    <!-- <h1>Default Layout</h1> -->
    <!-- <div class="d-flex pa-2 bg-deep-purple">
      Привет, {{ username }}!
      <exit-button></exit-button>
    </div>
    <slot /> -->
    <header-menu></header-menu>
    <Loader v-if="loading" />
    <start-game v-if="!start"></start-game>
    <!-- <gameplay v-if="clickItem == '1'"></gameplay> -->

    <v-expand-x-transition>
      <v-card v-show="start">
        <gameplay v-if="start"> </gameplay>
      </v-card>
    </v-expand-x-transition>
    <v-expand-x-transition
      ><games v-show="!start" v-if="!start"></games
    ></v-expand-x-transition>

    <!-- <exit-button></exit-button> -->
    <!-- {{ gameTheme }} -->
    <!-- {{ clickItem }} -->
    Start: {{ start }} Loading: {{ loading }} Finish Game:
    {{ finishMatchGameArray }}
  </div>
</template>

<style>
.default-layout {
  color: red;
}
.d-flex {
  justify-content: space-between;
  align-items: center;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
// import { loading } from '../components/Loader.vue';
// import { useSessionStore } from "~/store/session";
// import { storeToRefs } from "pinia";

// const sessionStore = useSessionStore();
// const { addValueToSessionToken } = sessionStore;
// const { sessionToken } = storeToRefs(sessionStore);

import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { isValid, fetchUsername } = sessionStore;
const { valid } = storeToRefs(sessionStore);
const { username } = storeToRefs(sessionStore);
const { clickItem, gameTheme, loading, finishMatchGameArray } =
  storeToRefs(gameStore);
const { start } = storeToRefs(gameStore);
const { setStartValue } = gameStore;
// const valid = sessionStore.valid;

const { userf } = sessionStore;
const { userdata } = storeToRefs(sessionStore);

const router = useRouter();

// async function fetchData() {
//   // loading.value = true; // Показываем загрузчик
//   setStartValue(true); // Показываем загрузчик
//   try {
//     // Ваш код для получения данных с сервера
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
//   } catch (error) {
//     console.error(error);
//   } finally {
//     setStartValue(false); // Скрываем загрузчик
//   }
// }

// const checkValid = () => {
//   // Удаляем определенные значения из localStorage
//   isValid();
//   if (valid.value == false) {
//     router.push("/auth");
//   }
// };

// onBeforeMount(userf);
// onBeforeMount(isValid);
// Created(checkValid);

onMounted(fetchUsername);

definePageMeta({
  key: (route) => route.fullPath,
  // middleware: ["auth"],
  // or middleware: 'auth'
});
</script>
