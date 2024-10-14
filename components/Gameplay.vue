<template>
  <div class="main">
    <v-row justify="center">
      <!-- {{ matchGame }} -->
      <v-card width="400" v-if="matchGame && !loading">
        <div class="animation">ИГРА НА СОВПАДЕНИЕ!</div>
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
            :rules="rules"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="secondmatch"
            hide-details="auto"
            label="Введите второе значение"
            :rules="rules"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="thirdmatch"
            hide-details="auto"
            label="Введите третье значение"
            :rules="rules"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="fourthmatch"
            hide-details="auto"
            label="Введите четвертое значение"
            :rules="rules"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="fifthmatch"
            hide-details="auto"
            label="Введите пятое значение"
            :rules="rules"
            required
          ></v-text-field>

          <v-text-field
            style="padding: 10px"
            v-model="sixthmatch"
            hide-details="auto"
            label="Введите шестое значение"
            :rules="rules"
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
        width="auto"
      >
        <v-card width="400">
          <v-text-field
            v-model="mismatchTheme"
            hide-details="auto"
            label="Введите тему (несовпадение)"
          ></v-text-field>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Ok"
              @click="(dialog = false), createMismatchTheme()"
            ></v-btn>
            <!-- <v-btn
              class="ms-auto"
              text="Ok"
              @click="(dialog = false), setGameMismatchTheme(mismatchTheme)"
            ></v-btn> -->
          </template>
        </v-card>
      </v-dialog>

      <v-expand-x-transition>
        <v-card width="400" v-show="expand && !loading">
          <div class="animation">ИГРА НА НЕСОВПАДЕНИЕ!</div>
          <!-- <v-alert
            :title="mismatchTheme"
            style="justify-content: center"
          ></v-alert> -->
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
              :rules="rules"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="secondmismatch"
              hide-details="auto"
              label="Введите второе значение"
              :rules="rules"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="thirdmismatch"
              hide-details="auto"
              label="Введите третье значение"
              :rules="rules"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="fourthmismatch"
              hide-details="auto"
              label="Введите четвертое значение"
              :rules="rules"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="fifthmismatch"
              hide-details="auto"
              label="Введите пятое значение"
              :rules="rules"
              required
            ></v-text-field>

            <v-text-field
              style="padding: 10px"
              v-model="sixthmismatch"
              hide-details="auto"
              label="Введите шестое значение"
              :rules="rules"
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
} = gameStore;

const firstmatch = ref<string | null>(null);
const secondmatch = ref<string | null>(null);
const thirdmatch = ref<string | null>(null);
const fourthmatch = ref<string | null>(null);
const fifthmatch = ref<string | null>(null);
const sixthmatch = ref<string | null>(null);
let matchGame = ref(true);

const mismatchTheme = ref<string | null>(null);
const firstmismatch = ref<string | null>(null);
const secondmismatch = ref<string | null>(null);
const thirdmismatch = ref<string | null>(null);
const fourthmismatch = ref<string | null>(null);
const fifthmismatch = ref<string | null>(null);
const sixthmismatch = ref<string | null>(null);
let dialog = ref(false);
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
    // Добавьте здесь вашу логику для отправки данных или выполнения других действий
  }
}

async function createMatchValuesRezerv() {
  setLoadingValue(true);
  // Получаем текущего пользователя
  const currentUser = Parse.User.current();

  if (!currentUser) {
    console.error("No user is currently logged in");
    return;
  }
  const gameId = localStorage.getItem("gameId");

  const Game = Parse.Object.extend("Games");
  // Создаем новый объект для поиска по id
  const query = new Parse.Query(Game);
  const matchValues = [
    firstmatch.value,
    secondmatch.value,
    thirdmatch.value,
    fourthmatch.value,
    fifthmatch.value,
    sixthmatch.value,
  ];

  try {
    // Ищем объект по id
    const gameObject = await query.get(gameId);

    if (gameObject) {
      console.log("Game found:", gameObject);

      // Создаем новую колонку с типом массив и записываем туда данные
      gameObject.set("MatchValues", matchValues);

      // Сохраняем изменения
      await gameObject.save();
      matchGame.value = false;
      dialog.value = true;

      //   console.log("Game updated successfully with new array column.");
      console.log("Dialog: ", dialog);
      console.log("Match Game: ", matchGame);
    } else {
      console.error("No game found with the given id.");
    }
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMatchValues() {
  setLoadingValue(true);
  // Получаем текущего пользователя
  // const currentUser = Parse.User.current();

  // if (!currentUser) {
  //   console.error("No user is currently logged in");
  //   return;
  // }
  // const gameId = localStorage.getItem("gameId");

  // const Game = Parse.Object.extend("Games");
  // // Создаем новый объект для поиска по id
  // const query = new Parse.Query(Game);
  const matchValues = [
    firstmatch.value,
    secondmatch.value,
    thirdmatch.value,
    fourthmatch.value,
    fifthmatch.value,
    sixthmatch.value,
  ];

  try {
    // Ищем объект по id
    // const gameObject = await query.get(gameId);

    // if (gameObject) {
    // console.log("Game found:", gameObject);

    // Создаем новую колонку с типом массив и записываем туда данные
    // gameObject.set("MatchValues", matchValues);

    // Сохраняем изменения
    // await gameObject.save();
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
    }
    // } else {
    // console.error("No game found with the given id.");
    // }
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMismatchTheme() {
  setLoadingValue(true);
  // Получаем текущего пользователя
  // const currentUser = Parse.User.current();

  // if (!currentUser) {
  //   console.error("No user is currently logged in");
  //   return;
  // }
  // const gameId = localStorage.getItem("gameId");

  // const Game = Parse.Object.extend("Games");
  // // Создаем новый объект для поиска по id
  // const query = new Parse.Query(Game);

  try {
    // Ищем объект по id
    // const gameObject = await query.get(gameId);

    // if (gameObject) {
    // console.log("Game found:", gameObject);

    // gameObject.set("MismatchTheme", mismatchTheme.value);

    // Сохраняем изменения
    // await gameObject.save();
    setGameMismatchTheme(mismatchTheme.value);
    dialog.value = false;
    mismatchGame.value = true;
    expand.value = !expand.value;
    // } else {
    // console.error("No game found with the given id.");
    // }
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMismatchValuesRezerv() {
  setLoadingValue(true);
  // Получаем текущего пользователя
  const currentUser = Parse.User.current();

  if (!currentUser) {
    console.error("No user is currently logged in");
    return;
  }
  const gameId = localStorage.getItem("gameId");

  const Game = Parse.Object.extend("Games");
  // Создаем новый объект для поиска по id
  const query = new Parse.Query(Game);
  const mismatchValues = [
    firstmismatch.value,
    secondmismatch.value,
    thirdmismatch.value,
    fourthmismatch.value,
    fifthmismatch.value,
    sixthmismatch.value,
  ];

  try {
    // Ищем объект по id
    const gameObject = await query.get(gameId);

    if (gameObject) {
      console.log("Game found:", gameObject);

      // Создаем новую колонку с типом массив и записываем туда данные
      gameObject.set("MissmatchValues", mismatchValues);

      // Сохраняем изменения
      await gameObject.save();
      setStartValue(false);
      // matchGame.value = false;
      // dialog.value = true;

      //   console.log("Game updated successfully with new array column.");
      // console.log("Dialog: ", dialog);
      // console.log("Match Game: ", matchGame);
    } else {
      console.error("No game found with the given id.");
    }
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createMismatchValues() {
  setLoadingValue(true);
  // Получаем текущего пользователя
  // const currentUser = Parse.User.current();

  // if (!currentUser) {
  //   console.error("No user is currently logged in");
  //   return;
  // }
  // const gameId = localStorage.getItem("gameId");

  // const Game = Parse.Object.extend("Games");
  // Создаем новый объект для поиска по id
  // const query = new Parse.Query(Game);
  const mismatchValues = [
    firstmismatch.value,
    secondmismatch.value,
    thirdmismatch.value,
    fourthmismatch.value,
    fifthmismatch.value,
    sixthmismatch.value,
  ];

  try {
    // Ищем объект по id
    // const gameObject = await query.get(gameId);

    // console.log("Game found:", gameObject);

    // Создаем новую колонку с типом массив и записываем туда данные
    // gameObject.set("MissmatchValues", mismatchValues);

    // Сохраняем изменения
    // await gameObject.save();
    setMismatchValues(mismatchValues);
    setStartValue(false);
    await createGame();
    // matchGame.value = false;
    // dialog.value = true;

    //   console.log("Game updated successfully with new array column.");
    // console.log("Dialog: ", dialog);
    // console.log("Match Game: ", matchGame);
  } catch (error) {
    console.error("Error while updating game:", error);
  } finally {
    setLoadingValue(false);
  }
}

async function createEnemyData() {
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

  // Устанавливаем значение столбца Score
  gameObject.set("Opponent", true);

  const Enemy = Parse.Object.extend("EnemyData");
  // Создаём новый объект этого класса
  const newEnemy = new Enemy();

  // Устанавливаем значения полей
  newEnemy.set("MatchValues", matchValues.value);
  newEnemy.set("MissmatchValues", mismatchValues);
  newEnemy.set("Enemy", currentUser);
  try {
    // Сохраняем объект
    const result = await newEnemy.save();
    // this.setClickItem(this.clickedItem);
    console.log("New Enemy Data created successfully");

    // Сохранение id игры в localStorage
    // localStorage.setItem("gameId", result.id);
    // console.log("Game ID saved to localStorage:", result.get("GameCreator"));
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
    // const enemyId = await result.get("objectId");
    // console.log(enemyId);
    // Получаем objectId из результата
    const objectId = result.id;
    console.log("New Enemy Data created successfully with objectId:", objectId);
    const query2 = new Parse.Query(Enemy);
    const enemyObject = await query2.get(objectId);
    const relation = gameObject.relation("EnemyData");
    relation.add(enemyObject);
    gameObject.save();
    // console.log(result.get("objectId"))
  } catch (error) {
    console.error("Error while creating new game:", error);
  } finally {
    // setLoadingValue(false); // Скрываем загрузчик
  }

  // const query2 = new Parse.Query(Enemy);
  // const enemyObject = await query2.get("R6Hby7Qgmi");
  // console.log(newEnemy.objectId);

  // if (gameObject) {
  // console.log("Game found: ", gameObject);
  // console.log("Enemy found: ", enemyObject);
  // const relation = gameObject.relation("EnemyData");
  // relation.add(enemyObject);
  // gameObject.save();

  // Создаем новую колонку с типом массив и записываем туда данные
  // gameObject.set("MatchValues", matchValues);

  // Сохраняем изменения
  // await gameObject.save();
  // matchGame.value = false;
  // dialog.value = true;

  //   console.log("Game updated successfully with new array column.");
  // console.log("Dialog: ", dialog);
  // console.log("Match Game: ", matchGame);
  // }
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
