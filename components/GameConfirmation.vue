<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Parse from "parse";

// Инициализация Parse SDK (добавьте ваши ключи и URL)
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

const gameStore = useGameStore();
const {
  loading,
  selectedGame,
  gameVisible,
  relatedEnemies,
  enemiesData,
  gamesData,
  matches,
  selectedMatchIndex,
  matchScore,
  finishMatchGame,
  finishMatchGameArray,
} = storeToRefs(gameStore);
const {
  setLoadingValue,
  openGame,
  closeGame,
  addMatch,
  resetMatches,
  // selectMatch,
  removeSelectedMatch,
  setMatchScore,
  setFinishMatchGame,
  addFinishMatchGame,
  fetchGames,
} = gameStore;
</script>

<style scoped></style>
