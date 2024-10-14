<template>
  <v-dialog v-model="gameVisible" max-width="800" persistent>
    <v-card v-if="!finishMatchGame">
      <v-toolbar
        ><v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="closeGame"></v-btn>
      </v-toolbar>
      <v-card-text>
        <h2 class="animation" style="text-align: center">Игра на совпадение</h2>
        <h3 style="text-align: center">{{ selectedGame?.CoincidenceTheme }}</h3>
        <!-- <h3>Игрок: {{ selectedGame?.GameCreator }}</h3> -->
        <div>MatchRate: {{ selectedGame?.MatchRate }}</div>

        <!-- Scores:
        <ul>
          <li v-for="(item, index) in selectedGame?.Score" :key="index">
            {{ Object.keys(item)[0] }}: {{ Object.values(item)[0] }}
          </li>
        </ul>
        {{ selectedGame?.Score }} -->
        <div>
          <!-- {{ relatedEnemies[0].Enemy }} -->
          <!-- {{ selectedGame.EnemyData.length }} -->
        </div>
        <div>
          <!-- {{ relatedEnemies[0].Enemy }} -->
          <!-- {{ selectedGame.Finish }} -->
        </div>
      </v-card-text>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p><strong>Мои значения</strong></p></v-card
            >
            <v-radio-group
              v-model="selectedGame.MatchValue"
              @change="handleChange"
            >
              <v-radio
                v-for="(MatchValue, index) in selectedGame.MatchValues"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
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
            <v-radio-group v-model="Enemy.MatchValue" @change="handleChange">
              <v-radio
                v-for="(MatchValue, index) in Enemy.MatchValues"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
              ></v-radio>
              <hr />
              <!-- Добавляем опцию для снятия выбора -->
              <v-radio :label="'Нет совпадений'" :value="null"></v-radio>
            </v-radio-group>
          </v-sheet>
        </v-col>
        <!-- {{ matches }} -->
        <v-container v-if="matches.length > 0">
          <v-row>
            <v-col>
              <v-card>
                <!-- <v-card-title>Результаты:</v-card-title> -->
                <v-card-text>
                  <v-row
                    class="hover"
                    v-for="(match, index) in matches"
                    :key="index"
                    :class="{ selected: selectedMatchIndex === index }"
                    @click="toggleSelectMatch(index)"
                  >
                    <v-col v-for="(value, key) in match" :key="key">
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
              v-if="selectedMatchIndex !== null"
              color="error"
              @click="removeSelectedMatch"
            >
              Удалить выбранное совпадение
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-row>
      <!-- <div>{{ matches }}</div> -->
      <v-btn class="ma-2" color="primary" @click="fixMatch">
        Зафиксировать совпадение
      </v-btn>
      <v-card-actions>
        <v-btn color="primary" @click="countNonEmptyValues(matches)"
          >Дальше</v-btn
        >
      </v-card-actions>
      <!-- {{ selectedGame?.GameCreator.username }} -->
      {{ matches }}
      {{ matchScore }}
      <!-- {{ nonEmptyCounts }} -->
    </v-card>
    <mismatching-game v-if="finishMatchGame"></mismatching-game>
    <!-- Missmatch Game -->
  </v-dialog>
  <!-- {{ finishMatchGame }} -->
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

const handleChange = (value) => {
  if (value === null) {
    selectedGame.value.MatchValue = null;
  }
};

const fixClick = ref(false);
// const finishMatchGame = ref(false);
// const score = ref<any[]>([]);

const fixMatch = () => {
  fixClick.value = true;
  const matchObject = {};
  // const username = selectedGame.value.GameCreator.username

  // Добавляем собственное значение
  if (selectedGame.value.MatchValue !== null) {
    // matchObject[selectedGame.value.GameCreator.username] =
    matchObject[selectedGame.value.GameCreator.objectId] =
      selectedGame.value.MatchValue;
  } else {
    // matchObject[selectedGame.value.GameCreator.username] = null;
    matchObject[selectedGame.value.GameCreator.objectId] = null;
  }

  // Добавляем значения соперников
  selectedGame.value.EnemyData.forEach((enemy) => {
    // matchObject[enemy.Enemy.username] = enemy.MatchValue;
    matchObject[enemy.Enemy.objectId] = enemy.MatchValue;
  });

  addMatch(matchObject);

  console.log(matches.value);
};

// Функция переключения выделения строки
const toggleSelectMatch = (index) => {
  if (selectedMatchIndex.value === index) {
    selectedMatchIndex.value = null; // Снять выделение, если строка уже выбрана
  } else {
    selectedMatchIndex.value = index; // Выделить строку
  }
};

// Функция для подсчета непустых значений
async function countNonEmptyValues(matches) {
  const counts = {};

  // Проход по каждому объекту в массиве совпадений
  // matches.forEach((match) => {
  //   for (const user in match) {
  //     if (match.hasOwnProperty(user)) {
  //       // Увеличиваем счетчик, если значение не пустое
  //       if (match[user] !== null) {
  //         if (!counts[user]) {
  //           counts[user] = 0;
  //         }
  //         counts[user]++;
  //       }
  //     }
  //   }
  // });

  // Проход по каждому объекту в массиве совпадений
  matches.forEach((match) => {
    for (const user in match) {
      if (match.hasOwnProperty(user)) {
        // Если значение не пустое (не null и не undefined), увеличиваем счетчик
        if (match[user] !== null && match[user] !== undefined) {
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
  console.log("Match Score: ", result);
  setMatchScore(result);
  // closeGame();
  // finishMatchGame.value = true;
  setFinishMatchGame(true);
  addFinishMatchGame(selectedGame.value.objectId);

  const transformedArray = result.map((item) => {
    const key = Object.keys(item)[0];
    return [key, item[key]];
  });

  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  //   Ищем объект по id
  // const gameObject = await query.get(selectedGame.value.objectId);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MatchScore", transformedArray);
    // Сохраняем изменения
    await gameObject.save();
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
  // return result;
}

// Вызов функции и получение результата
// const nonEmptyCounts = countNonEmptyValues(matches);
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
