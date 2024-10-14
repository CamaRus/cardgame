<template>
  <v-dialog v-model="duel" width="auto" @update:modelValue="onDuelMenuClose">
    <v-card width="100%" style="padding: 15px; text-align: center">
      <h3>Тема игры на совпадение:</h3>
      {{ selectedGame?.CoincidenceTheme }}
      <v-select
        width="300"
        v-model="matchRate"
        label="Сделайте ставку (количество совпадений)"
        :items="[1, 2, 3, 4, 5, 6]"
      ></v-select>
      <h3>Тема игры на несовпадение:</h3>
      {{ selectedGame?.MismatchTheme }}
      <v-select
        v-model="mismatchRate"
        label="Сделайте ставку (количество несовпадений)"
        :items="[1, 2, 3, 4, 5, 6]"
      ></v-select>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Ok"
          @click="duelMenu(false), saveDuelRates()"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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
  start,
  loading,
  gamesData,
  finishMatchGame,
  tooltipText,
  duel,
  selectedGame,
} = storeToRefs(gameStore);
const {
  setStartValue,
  setLoadingValue,
  openGame,
  setGames,
  fetchGames,
  copyGameId,
  confirmationWindow,
  confirmationArray,
  duelMenu,
} = gameStore;

// const matchRate = [1, 2, 3, 4, 5, 6];
const matchRate = ref<number | null>(1);
const mismatchRate = ref<number | null>(1);

const onDuelMenuClose = (isOpen: boolean) => {
  if (!isOpen) {
    matchRate.value = 1;
    mismatchRate.value = 1;
  }
};

async function saveDuelRates() {
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);
  console.log("Object Id: ", selectedGame.value.objectId);
  console.log("Match Rate: ", matchRate.value);
  console.log("Mismatch Rate: ", mismatchRate.value);
  //   Ищем объект по id
  const gameObject = await query.get(selectedGame.value.objectId);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MatchRate", matchRate.value);
    gameObject.set("MismatchRate", mismatchRate.value);
    gameObject.set("Duel", true);

    // Сохраняем изменения
    await gameObject.save();
    console.log("Score successfully saved!");
    matchRate.value = 1;
    mismatchRate.value = 1;
    fetchGames();
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}
</script>
