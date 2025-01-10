<template>
  <v-card>
    <v-toolbar>
      <!-- <v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title> -->
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" @click="closeGame"></v-btn>
    </v-toolbar>
    <v-card-text>
      <h2 class="animation" style="text-align: center">Игра на несовпадение</h2>
      <h3 style="text-align: center">{{ selectedGame?.MismatchTheme }}</h3>
    </v-card-text>
    <!-- <div>MismatchRate: {{ selectedGame?.MismatchRate }}</div> -->
    <v-row no-gutters :style="{ display: xs ? 'contents' : 'flex' }">
      <v-col>
        <v-sheet class="pa-2 ma-2">
          <v-card color="indigo" style="text-align: center">
            <v-avatar
              v-if="!avatar?.url"
              color="info"
              size="50"
              style="margin-top: 5px"
            >
              <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
            </v-avatar>
            <v-avatar v-else size="50" style="margin-top: 5px">
              <v-img alt="Avatar" :src="avatar?.url"></v-img>
            </v-avatar>
            <p><strong>Мои значения</strong></p></v-card
          >
          <v-radio-group
            v-model="selectedGame.MissmatchValue"
            @change="handleChange"
          >
            <v-radio
              v-for="(MissmatchValue, index) in selectedGame.MissmatchValues"
              :label="MissmatchValue"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
            ></v-radio>
            <hr />
            <!-- Добавляем опцию для снятия выбора -->
            <!-- <v-radio :label="'Нет совпадений'" :value="null"></v-radio> -->
          </v-radio-group>
        </v-sheet>
      </v-col>
      <v-col
        v-for="Enemy in selectedGame.EnemyData"
        :key="Enemy.Enemy.username"
      >
        <v-sheet class="pa-2 ma-2">
          <v-card color="indigo" style="text-align: center">
            <v-avatar
              v-if="Enemy.Enemy.avatar === undefined"
              color="info"
              size="50"
              style="margin-top: 5px"
            >
              <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
            </v-avatar>
            <v-avatar v-else size="50" style="margin-top: 5px">
              <v-img alt="Avatar" :src="Enemy.Enemy.avatar.url"></v-img>
            </v-avatar>
            <p>
              <strong>{{ Enemy.Enemy.username }}</strong>
            </p>
          </v-card>
          <v-radio-group v-model="Enemy.MissmatchValue" @change="handleChange">
            <v-radio
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :label="MissmatchValue"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
            ></v-radio>
            <hr />
            <!-- Добавляем опцию для снятия выбора -->
            <!-- <v-radio :label="'Нет совпадений'" :value="null"></v-radio> -->
          </v-radio-group>
        </v-sheet>
      </v-col>
      <v-container v-if="mismatches.length > 0">
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-row
                  class="hover"
                  v-for="(mismatch, index) in mismatches"
                  :key="index"
                  :class="{ selected: selectedMismatchIndex === index }"
                  @click="toggleSelectMatch(index)"
                >
                  <v-col v-for="(value, key) in mismatch" :key="key">
                    {{ value }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-card-actions style="justify-content: center">
          <v-btn
            v-if="selectedMismatchIndex !== null"
            color="error"
            @click="removeSelectedMismatch"
          >
            Удалить выбранное совпадение
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-row>
    <v-btn class="ma-2" color="primary" @click="fixMismatch">
      Зафиксировать совпадение
    </v-btn>
    <v-card-actions>
      <v-btn
        v-if="!selectedGame.Duel"
        color="primary"
        @click="countEmptyValues(mismatches), saveScore()"
        >Закончить</v-btn
      >
      <v-btn
        v-else
        color="primary"
        @click="mismatchScoreDuel(mismatches), enemyMove()"
        >Закончить</v-btn
      >
    </v-card-actions>
    <!-- Score: {{ score }} -->
  </v-card>
</template>

<script setup lang="ts">
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";
import { ref } from "vue";

import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

const sessionStore = useSessionStore();
const { userId } = storeToRefs(sessionStore);

const gameStore = useGameStore();
const {
  loading,
  selectedGame,
  gameVisible,
  relatedEnemies,
  enemiesData,
  gamesData,
  matches,
  mismatches,
  selectedMismatchIndex,
  matchScore,
  mismatchScore,
  score,
  strangersData,
  duel,
} = storeToRefs(gameStore);
const {
  setLoadingValue,
  openGame,
  closeGame,
  addMatch,
  addMismatch,
  // resetMatches,
  // selectMatch,
  // selectMismatch,
  // removeSelectedMismatch,
  removeSelectedMismatch,
  setMatchScore,
  setMismatchScore,
  scoring,
  setScore,
  fetchGames,
  getGamesByEnemy,
  mergeGameData,
} = gameStore;

const fixClick = ref(false);

const { mobile } = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;

const handleChange = (value) => {
  if (value === null) {
    selectedGame.value.MissmatchValue = null;
  }
};

const fixMismatch = () => {
  fixClick.value = true;
  const matchObject = {};

  // Добавляем собственное значение
  if (selectedGame.value.MissmatchValue !== null) {
    matchObject[selectedGame.value.GameCreator.objectId] =
      selectedGame.value.MissmatchValue;
  } else {
    matchObject[selectedGame.value.GameCreator.objectId] = null;
  }

  // Добавляем значения соперников
  selectedGame.value.EnemyData.forEach((enemy) => {
    matchObject[enemy.Enemy.objectId] = enemy.MissmatchValue;
  });

  addMismatch(matchObject);

  console.log(mismatches.value);
};

// Функция переключения выделения строки
const toggleSelectMatch = (index) => {
  if (selectedMismatchIndex.value === index) {
    selectedMismatchIndex.value = null; // Снять выделение, если строка уже выбрана
  } else {
    selectedMismatchIndex.value = index; // Выделить строку
  }
};

// Функция для подсчета непустых значений
async function countEmptyValues(mismatches) {
  const counts = {};

  // Проход по каждому объекту в массиве совпадений
  mismatches.forEach((mismatch) => {
    for (const user in mismatch) {
      if (mismatch.hasOwnProperty(user)) {
        // Если значение не пустое (не null и не undefined), увеличиваем счетчик
        if (mismatch[user] !== null && mismatch[user] !== undefined) {
          if (!counts[user]) {
            counts[user] = 0;
          }
          counts[user]++;
        } else {
          // Если значение null или undefined, создаем ключ с нулевым значением, если его еще нет
          if (!counts[user]) {
            counts[user] = 0;
          }
        }
      }
    }
  });

  // Преобразование объекта в массив объектов
  const result = Object.keys(counts).map((user) => ({
    [user]: counts[user],
  }));
  console.log("Mismatch Score: ", result);
  setMismatchScore(result);
  // Считаем общее количество очков
  scoring(matchScore.value, mismatchScore.value);

  const transformedArray = result.map((item) => {
    const key = Object.keys(item)[0];
    return [key, item[key]];
  });

  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MismatchScore", transformedArray);
    // Сохраняем изменения
    await gameObject.save();
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
  // return result;
}

async function mismatchScoreDuel(mismatches) {
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MismatchScoreDuel", 6 - mismatches.length);
    // Сохраняем изменения
    await gameObject.save();
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}

async function saveScore() {
  setLoadingValue(true);
  // Находим максимальное количество очков
  const maxScore = Math.max(...score.value.map((item) => item[1]));

  // Находим всех пользователей, у которых очки равны maxScore
  const topScorers = score.value
    .filter((item) => item[1] === maxScore)
    .map((item) => item[0]);

  console.log(topScorers);

  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);
  console.log("Object Id: ", selectedGame.value.objectId);

  const queryUsers = new Parse.Query(Parse.User);

  // Добавляем условие, чтобы получить пользователей, чьи objectId находятся в массиве
  queryUsers.containedIn("objectId", topScorers);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId); // замените OBJECT_ID на ID нужного объекта
    const users = await queryUsers.find();

    // Устанавливаем значение столбца Score
    gameObject.set("Score", score.value);
    gameObject.set("Finish", true);
    const relation = gameObject.relation("Winners");
    relation.add(users);

    closeGame();
    // Сохраняем изменения
    await gameObject.save();
    await fetchGames();
    await getGamesByEnemy(userId.value);
    await mergeGameData(gamesData.value, strangersData.value);
    setLoadingValue(false);
    console.log("Score successfully saved!");
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}

async function enemyMove() {
  closeGame();
  setLoadingValue(true);
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);
  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId); // замените OBJECT_ID на ID нужного объекта

    // Устанавливаем значение столбца Score
    gameObject.set("WaitEnemy", true);
    // Сохраняем изменения
    await gameObject.save();
    await fetchGames();
    await getGamesByEnemy(userId.value);
    await mergeGameData(gamesData.value, strangersData.value);
    setLoadingValue(false);
    console.log("Score successfully saved!");
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}
</script>

<style scoped>
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

.selected {
  background-color: greenyellow;
}

.hover:hover {
  background-color: yellow;
  cursor: pointer;
}
</style>
