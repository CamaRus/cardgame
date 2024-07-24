<template>
  <!-- <div class="games-list"> -->
  <div class="d-inline">
    <v-card justify="center" style="margin-top: 5%">
      <h2 style="text-align: center">Текущие игры</h2>
      <!-- <ul> -->
      <!-- <li v-for="game in games" :key="game.objectId">
          {{ game.CoincidenceTheme }}
        </li> -->
      <v-list v-for="game in games" :key="game.objectId">
        <v-card
          class="mx-auto"
          max-width="400"
          subtitle="Same looks, no anchor"
          :title="game.objectId"
          link
        ></v-card>
        <!-- <div>Совпадение: {{ game.CoincidenceTheme }}</div> -->
        <!-- <div>Несовпадение: {{ game.MismatchTheme }}</div> -->
      </v-list>
      <!-- </ul> -->
    </v-card>
  </div>
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
const { start, loading } = storeToRefs(gameStore);
const { setStartValue, setLoadingValue } = gameStore;

// Создание реактивного состояния для хранения данных
const games = ref<any[]>([]);

// Функция для получения данных игр текущего пользователя
const fetchGames = async () => {
  setLoadingValue(true);
  const currentUser = Parse.User.current();

  if (!currentUser) {
    console.error("No user is currently logged in");
    return;
  }

  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  // Добавляем условие, чтобы получать только игры текущего пользователя
  query.equalTo("GameCreator", currentUser);

  try {
    const results = await query.find();
    games.value = results.map((result) => result.toJSON());
    // const mismatches = results.get("MismatchTheme");
    console.log(results.length);
  } catch (error) {
    console.error("Error while fetching games:", error);
  } finally {
    setLoadingValue(false);
  }
};

// Используем onMounted для выполнения запроса при монтировании компонента
onMounted(() => {
  fetchGames();
});
</script>

<style scoped>
.games-list {
  margin-top: 20px;
}
</style>
