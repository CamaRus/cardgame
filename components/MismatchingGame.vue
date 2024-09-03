<template>
  <!-- <v-dialog v-model="gameVisible" max-width="800" persistent> -->
  <v-card>
    <v-toolbar
      ><v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" @click="closeGame"></v-btn>
    </v-toolbar>
    <v-card-text>
      <h2 class="animation" style="text-align: center">Игра на несовпадение</h2>
      <h3 style="text-align: center">{{ selectedGame?.MismatchTheme }}</h3>
      <!-- <h3>Игрок: {{ selectedGame?.GameCreator }}</h3> -->
      <!-- <div> -->
      <!-- {{ relatedEnemies[0].Enemy }} -->
      <!-- </div> -->
    </v-card-text>
    <v-row no-gutters>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          <v-card color="indigo" style="text-align: center"
            ><p><strong>Мои значения</strong></p></v-card
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
            <v-radio :label="'Нет совпадений'" :value="null"></v-radio>
          </v-radio-group>
          <!-- <p>Selected Button: {{ selectedGame.MatchValue }}</p> -->

          <!-- <v-checkbox
                v-for="(MatchValue, index) in selectedGame.MatchValues"
                v-model="selectedGame.MatchValue"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
              ></v-checkbox>
              <p>Selected Button: {{ selectedGame.MatchValue }}</p> -->
        </v-sheet>
      </v-col>
      <v-col
        v-for="Enemy in selectedGame.EnemyData"
        :key="Enemy.Enemy.username"
      >
        <!-- {{ enemiesData }} -->
        <v-sheet class="pa-2 ma-2">
          <v-card color="indigo" style="text-align: center"
            ><p>
              <strong>{{ Enemy.Enemy.username }}</strong>
            </p></v-card
          >
          <v-radio-group v-model="Enemy.MissmatchValue" @change="handleChange">
            <v-radio
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :label="MissmatchValue"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
            ></v-radio>
            <hr />
            <!-- Добавляем опцию для снятия выбора -->
            <v-radio :label="'Нет совпадений'" :value="null"></v-radio>
          </v-radio-group>
        </v-sheet>
      </v-col>
      <!-- {{ matches }} -->
      <v-container v-if="mismatches.length > 0">
        <v-row>
          <v-col>
            <v-card>
              <!-- <v-card-title>Результаты:</v-card-title> -->
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
              <!-- <v-card-actions>
                    <v-btn
                      v-if="selectedMatchIndex !== null"
                      color="error"
                      @click="removeSelectedMatch"
                    >
                      Удалить выбранное совпадение
                    </v-btn>
                  </v-card-actions> -->
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
    <!-- <div>{{ matches }}</div> -->
    <v-btn class="ma-2" color="primary" @click="fixMismatch">
      Зафиксировать совпадение
    </v-btn>
    <v-card-actions>
      <v-btn color="primary" @click="countEmptyValues(mismatches), saveScore()"
        >Закончить</v-btn
      >
    </v-card-actions>
    <!-- {{ selectedGame?.GameCreator.username }} -->
    <!-- {{ mismatches }} -->
    <!-- {{ mismatchScore }} -->
    Score: {{ score }}
    <!-- {{ nonEmptyCounts }} -->
  </v-card>
  <!-- </v-dialog> -->
</template>

<script setup lang="ts">
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";
import { ref } from "vue";

// import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

// const sessionStore = useSessionStore();
// const { avatarProfile } = storeToRefs(sessionStore);
// const { avatar } = storeToRefs(sessionStore);
// const { setAvatar } = sessionStore;

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
  // selectedMatchIndex,
  selectedMismatchIndex,
  matchScore,
  mismatchScore,
  score,
} = storeToRefs(gameStore);
const {
  setLoadingValue,
  openGame,
  closeGame,
  addMatch,
  addMismatch,
  resetMatches,
  // selectMatch,
  // selectMismatch,
  // removeSelectedMismatch,
  removeSelectedMismatch,
  setMatchScore,
  setMismatchScore,
  scoring,
  setScore,
} = gameStore;

const handleChange = (value) => {
  if (value === null) {
    selectedGame.value.MissmatchValue = null;
  }
};

const fixClick = ref(false);
// const score = ref<any[]>([]);

const fixMismatch = () => {
  fixClick.value = true;
  const matchObject = {};
  // const username = selectedGame.value.GameCreator.username

  // Добавляем собственное значение
  if (selectedGame.value.MissmatchValue !== null) {
    matchObject[selectedGame.value.GameCreator.username] =
      selectedGame.value.MissmatchValue;
  } else {
    matchObject[selectedGame.value.GameCreator.username] = null;
  }

  // Добавляем значения соперников
  selectedGame.value.EnemyData.forEach((enemy) => {
    matchObject[enemy.Enemy.username] = enemy.MissmatchValue;
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
function countEmptyValues(mismatches) {
  const counts = {};

  // Проход по каждому объекту в массиве совпадений
  mismatches.forEach((mismatch) => {
    for (const user in mismatch) {
      if (mismatch.hasOwnProperty(user)) {
        // Увеличиваем счетчик, если значение не пустое
        if (mismatch[user] === null) {
          if (!counts[user]) {
            counts[user] = 0;
          }
          counts[user]++;
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
  // return result;
}

async function saveScore() {
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
  // Ищем объект по id
  // const gameObject = await query.get(selectedGame.value.objectId);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId); // замените OBJECT_ID на ID нужного объекта

    // Устанавливаем значение столбца Score
    gameObject.set("Score", score.value);
    gameObject.set("Finish", true);

    // Сохраняем изменения
    await gameObject.save();
    console.log("Score successfully saved!");
    closeGame();
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
