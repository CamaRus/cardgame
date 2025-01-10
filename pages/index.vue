<template>
  <div>
    <header-menu></header-menu>
    <Loader v-if="loading" />
    <start-game v-if="!start"></start-game>

    <v-expand-x-transition>
      <v-card v-show="start">
        <gameplay v-if="start"> </gameplay>
      </v-card>
    </v-expand-x-transition>
    <v-expand-x-transition
      ><games v-show="!start" v-if="!start"></games
    ></v-expand-x-transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { fetchUsername } = sessionStore;
const { loading } = storeToRefs(gameStore);
const { start } = storeToRefs(gameStore);

onMounted(fetchUsername);

definePageMeta({
  key: (route) => route.fullPath,
});
</script>

<style>
.default-layout {
  color: red;
}
.d-flex {
  justify-content: space-between;
  align-items: center;
}
</style>
