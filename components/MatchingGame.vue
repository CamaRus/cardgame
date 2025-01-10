<template>
  <v-dialog
    v-model="gameVisible"
    persistent
    :fullscreen="xs || sm"
    :style="{ width: xs || sm ? '100%' : '1000px' }"
  >
    <v-card v-if="!finishMatchGame">
      <v-toolbar>
        <!-- <v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title> -->
        <v-spacer> </v-spacer>
        <v-btn icon="mdi-close" @click="closeGame"></v-btn>
      </v-toolbar>
      <v-card-text>
        <h2 class="animation" style="text-align: center">Игра на совпадение</h2>
        <h3 style="text-align: center">{{ selectedGame?.CoincidenceTheme }}</h3>
        <!-- <div>MatchRate: {{ selectedGame?.MatchRate }}</div> -->
        <div></div>
        <div></div>
      </v-card-text>
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
              <v-radio
                v-if="!selectedGame.Duel"
                :label="'Нет совпадений'"
                :value="null"
              ></v-radio>
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
            <v-radio-group v-model="Enemy.MatchValue" @change="handleChange">
              <v-radio
                v-for="(MatchValue, index) in Enemy.MatchValues"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
              ></v-radio>
              <hr />
              <!-- Добавляем опцию для снятия выбора -->
              <v-radio
                v-if="!selectedGame.Duel"
                :label="'Нет совпадений'"
                :value="null"
              ></v-radio>
            </v-radio-group>
          </v-sheet>
        </v-col>
        <v-container v-if="matches.length > 0" style="max-width: 100%">
          <v-row>
            <v-col>
              <v-card>
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
      <v-btn class="ma-2" color="primary" @click="fixMatch">
        Зафиксировать совпадение
      </v-btn>
      <v-card-actions>
        <v-btn
          v-if="!selectedGame.Duel"
          color="primary"
          @click="countNonEmptyValues(matches)"
          >Дальше</v-btn
        >
        <v-btn v-else color="primary" @click="matchScoreDuel(matches)"
          >Дальше</v-btn
        >
      </v-card-actions>
    </v-card>
    <mismatching-game v-if="finishMatchGame"></mismatching-game>
  </v-dialog>
</template>

<script setup lang="ts">
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";
import { ref } from "vue";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

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
  duel,
} = storeToRefs(gameStore);
const {
  setLoadingValue,
  openGame,
  closeGame,
  addMatch,
  // resetMatches,
  // selectMatch,
  removeSelectedMatch,
  setMatchScore,
  setFinishMatchGame,
  addFinishMatchGame,
  fetchGames,
} = gameStore;

const { mobile } = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;

const fixClick = ref(false);

const handleChange = (value) => {
  if (value === null) {
    selectedGame.value.MatchValue = null;
  }
};

const fixMatch = () => {
  fixClick.value = true;
  const matchObject = {};
  // Добавляем собственное значение
  if (selectedGame.value.MatchValue !== null) {
    matchObject[selectedGame.value.GameCreator.objectId] =
      selectedGame.value.MatchValue;
  } else {
    matchObject[selectedGame.value.GameCreator.objectId] = null;
  }

  // Добавляем значения соперников
  selectedGame.value.EnemyData.forEach((enemy) => {
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
  setLoadingValue(true);
  const counts = {};
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
  setFinishMatchGame(true);
  addFinishMatchGame(selectedGame.value.objectId);

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
    gameObject.set("MatchScore", transformedArray);
    // Сохраняем изменения
    await gameObject.save();
    setLoadingValue(false);
  } catch (error) {
    console.error("Error while saving Score:", error);
  }
}

async function matchScoreDuel(matches) {
  setFinishMatchGame(true);
  // setLoadingValue(true);
  const Game = Parse.Object.extend("Games");
  const query = new Parse.Query(Game);

  try {
    // Предположим, что у вас уже есть объект Game, который вы хотите обновить
    const gameObject = await query.get(selectedGame.value.objectId);

    // Устанавливаем значение столбца Score
    gameObject.set("MatchScoreDuel", matches.length);
    // Сохраняем изменения
    await gameObject.save();
    addFinishMatchGame(selectedGame.value.objectId);
    // setLoadingValue(false);
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
