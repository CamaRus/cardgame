<template>
  <v-dialog v-model="duel" width="auto" @update:modelValue="onDuelMenuClose">
    <v-card width="100%" style="padding: 15px; text-align: center">
      {{ selectedGame?.objectId }}
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
          v-if="selectedGame.GameCreator === userId"
          class="ms-auto"
          text="Ok"
          @click="duelMenu(false, selectedGame), saveDuelRates()"
        ></v-btn>
        <v-btn
          v-else
          class="ms-auto"
          text="Ok (дуэль)"
          @click="duelMenu(false, selectedGame), saveDuelRatesAndFinish()"
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
import { useSessionStore } from "../store/session";

const sessionStore = useSessionStore();
const { userId } = storeToRefs(sessionStore);

const gameStore = useGameStore();
const {
  start,
  loading,
  gamesData,
  finishMatchGame,
  tooltipText,
  duel,
  selectedGame,
  strangersData,
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
  getGamesByEnemy,
  mergeGameData,
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
    await fetchGames();
    await getGamesByEnemy(userId.value);
    await mergeGameData(gamesData.value, strangersData.value);
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}

async function saveDuelRatesAndFinish() {
  setLoadingValue(true);
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  //   Ищем объект по id
  // const gameObject = await query.get(selectedGame.value.objectId);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MatchRateEnemy", matchRate.value);
    gameObject.set("MismatchRateEnemy", mismatchRate.value);
    // gameObject.set("Duel", true);
    console.log("MatchScoreDuel: ", selectedGame.value.MatchScoreDuel);
    console.log("MismatchScoreDuel: ", selectedGame.value.MismatchScoreDuel);
    let GameCreatorPointsMatch = 0;
    let GameCreatorPointsMismatch = 0;
    let EnemyPointsMatch = 0;
    let EnemyPointsMismatch = 0;

    ///For Game Creator
    if (selectedGame.value.MatchRate < selectedGame.value.MatchScoreDuel) {
      GameCreatorPointsMatch += selectedGame.value.MatchRate;
    } else if (
      selectedGame.value.MatchRate == selectedGame.value.MatchScoreDuel
    ) {
      GameCreatorPointsMatch += selectedGame.value.MatchScoreDuel;
    } else {
      GameCreatorPointsMatch += 0;
    }

    if (
      selectedGame.value.MismatchRate < selectedGame.value.MismatchScoreDuel
    ) {
      GameCreatorPointsMismatch += selectedGame.value.MismatchRate;
    } else if (
      selectedGame.value.MismatchRate == selectedGame.value.MismatchScoreDuel
    ) {
      GameCreatorPointsMismatch += selectedGame.value.MismatchScoreDuel;
    } else {
      GameCreatorPointsMismatch += 0;
    }

    ///For Enemy
    if (matchRate.value < selectedGame.value.MatchScoreDuel) {
      EnemyPointsMatch += matchRate.value;
    } else if (matchRate.value == selectedGame.value.MatchScoreDuel) {
      EnemyPointsMatch += selectedGame.value.MatchScoreDuel;
    } else {
      EnemyPointsMatch += 0;
    }

    if (mismatchRate.value < selectedGame.value.MismatchScoreDuel) {
      EnemyPointsMismatch += mismatchRate.value;
    } else if (mismatchRate.value == selectedGame.value.MismatchScoreDuel) {
      EnemyPointsMismatch += selectedGame.value.MismatchScoreDuel;
    } else {
      EnemyPointsMismatch += 0;
    }
    ////////////////////////////////////////////////////////////////////////////
    const GameCreatorPoints =
      GameCreatorPointsMatch + GameCreatorPointsMismatch;
    const EnemyPoints = EnemyPointsMatch + EnemyPointsMismatch;
    console.log("GameCreatorPoints: ", GameCreatorPoints);
    console.log("EnemyPoints: ", EnemyPoints);
    // console.log("GameCreator: ", selectedGame.value.GameCreator.objectId);
    // console.log("My Id: ", userId.value);
    if (GameCreatorPoints > EnemyPoints) {
      // console.log(selectedGame.value.GameCreator.objectId);
      // gameObject.set("Winners", topScorers);

      // Добавляем условие, чтобы получить пользователей, чьи objectId находятся в массиве
      // queryUser.containedIn(
      //   "objectId",
      //   selectedGame.value.GameCreator.objectId
      // );
      const queryUser = new Parse.Query(Parse.User);
      queryUser.equalTo("objectId", selectedGame.value.GameCreator.objectId);
      const user = await queryUser.find();
      const relation = gameObject.relation("Winners");
      relation.add(user);
    } else if (EnemyPoints > GameCreatorPoints) {
      // console.log(userId.value);
      // const queryUser = new Parse.Query(Parse.User);

      // Добавляем условие, чтобы получить пользователей, чьи objectId находятся в массиве
      // queryUser.containedIn("objectId", userId.value);
      const queryUser = new Parse.Query(Parse.User);
      queryUser.equalTo("objectId", userId.value);
      const user = await queryUser.find();
      const relation = gameObject.relation("Winners");
      relation.add(user);
    } else {
      console.log("Ничья!");
      // let winners = [selectedGame.value.GameCreator.objectId, userId.value];
      // const queryUsers = new Parse.Query(Parse.User);
      // queryUsers.containedIn("objectId", winners);
      // const users = await queryUsers.find();
      // const relation = gameObject.relation("Winners");
      // relation.add(users);
    }
    gameObject.set("Finish", true);
    gameObject.set("WaitEnemy", false);
    // Сохраняем изменения
    await gameObject.save();
    // console.log("Score successfully saved!");
    matchRate.value = 1;
    mismatchRate.value = 1;
    await fetchGames();
    await getGamesByEnemy(userId.value);
    await mergeGameData(gamesData.value, strangersData.value);
  } catch (error) {
    console.error("Error while saving Score:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function calculationOfDuelResults() {
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);
  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    // gameObject.set("Duel", true);

    // Сохраняем изменения
    // await gameObject.save();
    // console.log("Score successfully saved!");
    // matchRate.value = 1;
    // mismatchRate.value = 1;
    // fetchGames();
    // getGamesByEnemy(userId.value);
    // mergeGameData(gamesData.value, strangersData.value);
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}
</script>
