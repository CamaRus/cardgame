<template>
  <div class="main">
    <v-row justify="center">
      <v-card
        v-if="matchGame && !loading"
        style="margin-top: 65px"
        :style="{ width: xs ? '90%' : '400px' }"
      >
        <div class="animation">ИГРА НА СОВПАДЕНИЕ!</div>
        <!-- {{ useDisplay().md }} -->
        <!-- {{ useDisplay() }} -->
        <!-- {{ mobile }} -->
        <!-- <v-alert :title="gameTheme" style="justify-content: center"></v-alert> -->
        <v-alert
          v-if="clickItem == '1' || clickItem == '3'"
          style="justify-content: center"
          :title="gameTheme"
        ></v-alert>
        <v-alert
          v-else
          style="justify-content: center"
          :title="randomTopicMatch"
        ></v-alert>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            style="padding: 10px"
            v-model="firstmatch"
            hide-details="auto"
            label="Введите первое значение"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="secondmatch"
            hide-details="auto"
            label="Введите второе значение"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="thirdmatch"
            hide-details="auto"
            label="Введите третье значение"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="fourthmatch"
            hide-details="auto"
            label="Введите четвертое значение"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="fifthmatch"
            hide-details="auto"
            label="Введите пятое значение"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="sixthmatch"
            hide-details="auto"
            label="Введите шестое значение"
            required
          ></v-text-field>
        </v-form>
        <div
          v-if="showError"
          style="padding-left: 2%; color: red; text-align: center"
        >
          Введите все значения!
        </div>
        <template v-slot:actions>
          <v-btn
            :disabled="showError"
            class="ms-auto"
            type="submit"
            text="Закончить!"
            @click="createMatchValues()"
            block
          ></v-btn>
        </template>
      </v-card>
      <!-- -------------------------------Несовпадение------------------------------------- -->
      <v-dialog
        v-if="dialog && !loading && clickItem == '1'"
        v-model="dialog"
        persistent
        :style="{ width: xs ? '100%' : '400px' }"
      >
        <v-card style="margin-top: 5%">
          <v-text-field
            v-model="mismatchTheme"
            hide-details="auto"
            label="Введите тему (несовпадение)"
          ></v-text-field>
          <template v-slot:actions>
            <v-btn
              :disabled="!mismatchTheme"
              class="ms-auto"
              text="Ok"
              @click="(dialog = false), createMismatchTheme()"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>

      <v-expand-x-transition>
        <v-card
          v-show="expand && !loading"
          style="margin-top: 65px"
          :style="{ width: xs ? '90%' : '400px' }"
        >
          <div class="animation">ИГРА НА НЕСОВПАДЕНИЕ!</div>
          <v-alert
            v-if="clickItem == '1'"
            style="justify-content: center"
            :title="mismatchTheme"
          ></v-alert>
          <v-alert
            v-else-if="clickItem == '3'"
            style="justify-content: center"
            :title="gameMismatchTheme"
          ></v-alert>
          <v-alert
            v-else
            style="justify-content: center"
            :title="randomTopicMismatch"
          ></v-alert>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              style="padding: 10px"
              v-model="firstmismatch"
              hide-details="auto"
              label="Введите первое значение"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="secondmismatch"
              hide-details="auto"
              label="Введите второе значение"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="thirdmismatch"
              hide-details="auto"
              label="Введите третье значение"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="fourthmismatch"
              hide-details="auto"
              label="Введите четвертое значение"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="fifthmismatch"
              hide-details="auto"
              label="Введите пятое значение"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="sixthmismatch"
              hide-details="auto"
              label="Введите шестое значение"
              required
            ></v-text-field>
          </v-form>
          <div
            v-if="showErrorMismatch"
            style="padding-left: 2%; color: red; text-align: center"
          >
            Введите все значения!
          </div>
          <template v-slot:actions>
            <v-btn
              v-if="clickItem == '3'"
              :disabled="showErrorMismatch"
              class="ms-auto"
              type="submit"
              text="Закончить!"
              @click="createEnemyData()"
              block
            ></v-btn>
            <v-btn
              v-else
              :disabled="showErrorMismatch"
              class="ms-auto"
              type="submit"
              text="Закончить!"
              @click="createMismatchValues()"
              block
            ></v-btn>
          </template>
        </v-card>
      </v-expand-x-transition>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

import { ref, computed } from "vue";

import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { useWindowSize } from "@vueuse/core";

const { mobile } = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;
const { width: windowWidth, height: windowHeight } = useWindowSize();

const bottomNavHeight = computed(() => {
  return windowHeight.value - 55;
});

const gameStore = useGameStore();
const {
  clickItem,
  start,
  gameTheme,
  loading,
  randomTopicMatch,
  randomTopicMismatch,
  gameMismatchTheme,
  matchValues,
  mismatchValues,
  gameId,
  maxPlayers,
} = storeToRefs(gameStore);
const {
  setClickItem,
  setGameTheme,
  setStartValue,
  setLoadingValue,
  setMatchValues,
  setMismatchValues,
  setGameMismatchTheme,
  createGame,
  fetchGames,
  setRandomTopicMatch,
  setRandomTopicMismatch,
} = gameStore;

const firstmatch = ref<string | null>(null);
const secondmatch = ref<string | null>(null);
const thirdmatch = ref<string | null>(null);
const fourthmatch = ref<string | null>(null);
const fifthmatch = ref<string | null>(null);
const sixthmatch = ref<string | null>(null);

const firstmismatch = ref<string | null>(null);
const secondmismatch = ref<string | null>(null);
const thirdmismatch = ref<string | null>(null);
const fourthmismatch = ref<string | null>(null);
const fifthmismatch = ref<string | null>(null);
const sixthmismatch = ref<string | null>(null);

let dialog = ref(false);
const mismatchTheme = ref<string | null>(null);
let matchGame = ref(true);
let mismatchGame = ref(false);
const expand = ref(false);

const showError = computed(() => {
  return (
    !firstmatch.value ||
    !secondmatch.value ||
    !thirdmatch.value ||
    !fourthmatch.value ||
    !fifthmatch.value ||
    !sixthmatch.value
  );
});

const showErrorMismatch = computed(() => {
  return (
    !firstmismatch.value ||
    !secondmismatch.value ||
    !thirdmismatch.value ||
    !fourthmismatch.value ||
    !fifthmismatch.value ||
    !sixthmismatch.value
  );
});

function handleSubmit() {
  if (showError.value) {
    console.log("Пожалуйста, заполните все поля.");
  } else {
    console.log("Все поля заполнены.");
  }
}

async function createMatchValues() {
  setLoadingValue(true);
  const matchValues = [
    firstmatch.value,
    secondmatch.value,
    thirdmatch.value,
    fourthmatch.value,
    fifthmatch.value,
    sixthmatch.value,
  ];

  try {
    setMatchValues(matchValues);
    matchGame.value = false;
    dialog.value = true;

    //   console.log("Game updated successfully with new array column.");
    console.log("Dialog: ", dialog);
    console.log("Match Game: ", matchGame);
    console.log("Click Item: ", clickItem.value);
    if (clickItem.value == "2" || clickItem.value == "3") {
      dialog.value = false;
      mismatchGame.value = true;
      expand.value = !expand.value;
      window.scrollTo({
        top: 0,
      });
    }
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMismatchTheme() {
  setLoadingValue(true);
  try {
    setGameMismatchTheme(mismatchTheme.value);
    dialog.value = false;
    mismatchGame.value = true;
    expand.value = !expand.value;
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMismatchValues() {
  setLoadingValue(true);
  const mismatchValues = [
    firstmismatch.value,
    secondmismatch.value,
    thirdmismatch.value,
    fourthmismatch.value,
    fifthmismatch.value,
    sixthmismatch.value,
  ];

  try {
    setMismatchValues(mismatchValues);
    setStartValue(false);
    await createGame();
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createEnemyData() {
  setLoadingValue(true);
  const mismatchValues = [
    firstmismatch.value,
    secondmismatch.value,
    thirdmismatch.value,
    fourthmismatch.value,
    fifthmismatch.value,
    sixthmismatch.value,
  ];
  setMismatchValues(mismatchValues);
  const currentUser = Parse.User.current();
  const Game = Parse.Object.extend("Games");
  const query1 = new Parse.Query(Game);

  // Ищем объект по id
  const gameObject = await query1.get(gameId.value);
  const currentPlayers = gameObject.get("Players");
  gameObject.set("Opponent", true);
  gameObject.set("Players", currentPlayers + 1);

  const Enemy = Parse.Object.extend("EnemyData");
  // Создаём новый объект этого класса
  const newEnemy = new Enemy();

  // Устанавливаем значения полей
  newEnemy.set("MatchValues", matchValues.value);
  newEnemy.set("MissmatchValues", mismatchValues);
  newEnemy.set("Enemy", currentUser);
  try {
    if (currentPlayers > 3) {
      throw new Error("Достигнуто максимальное количество игроков!");
    }
    const result = await newEnemy.save();
    console.log("New Enemy Data created successfully");
    const objectId = result.id;
    console.log("New Enemy Data created successfully with objectId:", objectId);
    const query2 = new Parse.Query(Enemy);
    const enemyObject = await query2.get(objectId);
    const relation = gameObject.relation("EnemyData");
    relation.add(enemyObject);
    gameObject.save();
    setStartValue(false);
    await fetchGames();
  } catch (error) {
    maxPlayers.value = true;
    throw new Error(error.message);
  } finally {
    setStartValue(false);
    setGameTheme(null);
    setGameMismatchTheme(null);
    setRandomTopicMatch(null);
    setRandomTopicMismatch(null);
    setLoadingValue(false);
  }
}
</script>

<style scoped>
.main {
  margin-top: 20px;
  margin-block-end: 5%;
}

.animation {
  background: linear-gradient(180deg, #fafafa, #ddf810, #8f4ff4);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
  text-align: center;
  padding: 10px;
}

@keyframes gradient {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
