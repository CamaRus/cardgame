<template>
  <div class="d-inline">
    <v-container fluid v-show="!loading">
      <v-row justify="center">
        <v-col cols="12">
          <v-card
            style="display: flex; justify-content: center"
            class="mx-auto text-center"
            color="surface-variant"
            title="Мои игры"
          >
            <div
              style="position: absolute; top: 30%; right: 1%"
              @click="forcedUpdate()"
            >
              <svg
                class="hover"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"
                />
              </svg>
              <v-tooltip activator="parent" location="bottom"
                >Обновить данные</v-tooltip
              >
            </div>
          </v-card>
          <v-card style="margin-top: 2%" v-if="gamesData.length">
            <v-row>
              <v-col
                v-for="(game, index) in paginatedActiveGames"
                :key="game.objectId"
                v-show="!game.Finish"
                cols="12"
                sm="6"
                md="4"
                lg="4"
              >
                <v-card
                  :disabled="isCardDisabled(game)"
                  class="text-center"
                  hover
                  style="padding-block-end: 25px; height: 100%"
                  @click="handleCardClick(game)"
                >
                  <v-card color="indigo" style="text-align: center">
                    <p>
                      <strong>{{ formatDate(game.createdAt) }}</strong>
                    </p>
                  </v-card>
                  <v-card-subtitle
                    style="line-height: 3.425"
                    v-if="game.Opponent && game.GameCreator.objectId === userId"
                  >
                    Соперники найдены!
                  </v-card-subtitle>
                  <v-card-subtitle
                    style="line-height: 3.425"
                    v-if="
                      game.GameCreator.objectId !== userId && !game.WaitEnemy
                    "
                  >
                    Ожидание ведущего!
                    <div>
                      <v-progress-circular
                        color="amber"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </v-card-subtitle>
                  <v-tooltip
                    activator="parent"
                    location="start"
                    v-if="!game.Opponent"
                    >{{ tooltipText }}</v-tooltip
                  >
                  <v-card-subtitle
                    style="line-height: 3.425"
                    v-if="
                      (!game.Opponent &&
                        game.GameCreator.objectId === userId) ||
                      (game.GameCreator.objectId === userId && game.WaitEnemy)
                    "
                    >Ожидание соперника...
                    <div>
                      <v-progress-circular
                        color="amber"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </v-card-subtitle>
                  <v-card-subtitle
                    style="line-height: 3.425"
                    v-if="
                      game.GameCreator.objectId !== userId && game.WaitEnemy
                    "
                  >
                    Сделайте ставку!
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
          <!-- Пагинация -->
          <!-- {{ paginatedActiveGames }} -->
          <v-alert
            v-if="!paginatedActiveGames.length"
            style="justify-content: center"
            title="НЕТ АКТИВНЫХ ИГР!"
          ></v-alert>
          <v-pagination
            v-if="paginatedActiveGames.length"
            v-model="currentActivePage"
            :length="activePageCount"
            color="primary"
            class="mt-4"
          ></v-pagination>
          <!-- ------------------------------------------------------------------------------------------------------------ -->
          <v-card
            class="mx-auto text-center"
            color="surface-variant"
            title="Завершенные игры"
            style="margin-top: 20px"
          ></v-card>
          <v-card style="margin-top: 2%" v-if="gamesData.length">
            <v-row>
              <v-col
                v-for="(game, index) in paginatedFinishedGames"
                :key="game.objectId"
                v-show="game.Finish"
                cols="12"
                sm="6"
                md="4"
                lg="4"
              >
                <div style="display: flex; justify-content: center"></div>
                <v-card
                  :disabled="!game.Opponent"
                  class="text-center"
                  hover
                  style="padding-block-end: 25px; height: 100%"
                  @click="openScoreboard(game)"
                  :class="getChipStyle(game.WinnerData)"
                >
                  <v-card color="indigo" style="text-align: center">
                    <p>
                      <strong>{{ formatDate(game.createdAt) }}</strong>
                    </p>
                  </v-card>
                  <div v-if="game.WinnerData.length > 0">
                    <v-card-subtitle v-if="game.Opponent">
                      <h3>Победители:</h3>
                    </v-card-subtitle>
                    <div
                      style="
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                      "
                    >
                      <v-chip-group
                        v-for="Winner in game.WinnerData"
                        :key="Winner.objectId"
                        style="display: block"
                      >
                        <v-chip color="green" variant="flat">
                          {{ Winner.username }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                    <font-awesome-icon
                      v-if="trophy"
                      :icon="['fas', 'trophy']"
                      bounce
                      size="2xl"
                      style="color: #ffd43b; margin-top: 5%"
                    />
                    <font-awesome-icon
                      v-else
                      size="2xl"
                      :icon="['fas', 'face-sad-tear']"
                      style="color: #ffd43b; margin-top: 5%"
                      beat-fade
                    />
                  </div>
                  <div v-else>
                    <v-card-subtitle><h3>Ничья!</h3></v-card-subtitle>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
          <v-alert
            v-if="!paginatedFinishedGames.length"
            style="justify-content: center"
            title="НЕТ ЗАВЕРШЁННЫХ ИГР!"
          ></v-alert>
          <v-pagination
            v-if="paginatedFinishedGames.length"
            v-model="currentFinishedPage"
            :length="finishedPageCount"
            color="primary"
            class="mt-4"
          ></v-pagination>
          <hr />
        </v-col>
      </v-row>
    </v-container>
    <MatchingGame></MatchingGame>
    <GameConfirmation></GameConfirmation>
    <DuelMenu></DuelMenu>
    <Scoreboard></Scoreboard>
    <Rules></Rules>
    <max-players-alert></max-players-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import Parse from "parse";

// Инициализация Parse SDK (добавьте ваши ключи и URL)
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";
import { storeToRefs } from "pinia";

import { useGameStore } from "../store/game";
import { useSessionStore } from "../store/session";
import { useDisplay } from "vuetify";

const maxPlayers = ref(false);

const mobile = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;
// const sm = computed(() =>
//   useDisplay()
// );

const sessionStore = useSessionStore();
const { username, userId, avatar, email } = storeToRefs(sessionStore);

const gameStore = useGameStore();
const {
  start,
  loading,
  gamesData,
  finishMatchGame,
  tooltipText,
  strangersData,
  rules,
  gameTheme,
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
  openScoreboard,
  getGamesByEnemy,
  mergeGameData,
  duelMenu,
} = gameStore;

const finishGames = ref<any[]>([]);
let intervalId;
let className = ref<string | null>(null);
let trophy = false;
const pageSize = 9; // Количество элементов на странице
// Пагинация для активных игр
const currentActivePage = ref(1);
// Пагинация для завершённых игр
const currentFinishedPage = ref(1);

const activeGames = computed(() =>
  gamesData.value.filter((game) => !game.Finish)
);
const paginatedActiveGames = computed(() => {
  const start = (currentActivePage.value - 1) * pageSize;
  const end = start + pageSize;
  return activeGames.value.slice(start, end);
});
const activePageCount = computed(() =>
  Math.ceil(activeGames.value.length / pageSize)
);

const finishedGames = computed(() =>
  gamesData.value.filter((game) => game.Finish)
);
const paginatedFinishedGames = computed(() => {
  const start = (currentFinishedPage.value - 1) * pageSize;
  const end = start + pageSize;
  return finishedGames.value.slice(start, end);
});
const finishedPageCount = computed(() =>
  Math.ceil(finishedGames.value.length / pageSize)
);

// логика для открытия активной игры
function handleCardClick(game) {
  if (
    game.Opponent &&
    !confirmationArray.includes(game.objectId) &&
    !game.Duel
  ) {
    confirmationWindow(game);
  } else if (!game.Opponent) {
    copyGameId(game);
  } else if (game.GameCreator.objectId !== userId && game.WaitEnemy) {
    duelMenu(true, game);
  } else {
    openGame(game);
  }
}

function isCardDisabled(game) {
  return (
    (game.GameCreator.objectId !== userId.value && !game.WaitEnemy) ||
    (game.GameCreator.objectId === userId.value && game.WaitEnemy)
  );
}

const startPolling = () => {
  intervalId = setInterval(fetchGames, 20000); // Опрашиваем сервер каждые 5 секунд
};

const stopPolling = () => {
  clearInterval(intervalId);
};

const getChipStyleRezerv = (game) => {
  if (game.length > 0 && game.length < 4) {
    game.forEach((element) => {
      if (element.objectId.includes(userId.value)) {
        // console.log("Winner!");
        className.value = "winner";
        trophy = true;
        // return className;
      } else if (!element.objectId.includes(userId.value)) {
        // console.log("Loser!");
        className.value = "loser";
        trophy = false;
        // return className;
      }
    });
  } else {
    className.value = "draw";
    // return className;
  }
  return className.value;
};

const getChipStyle = (game) => {
  if (game.length > 0 && game.length < 4) {
    const exists = game.some((g) => g.objectId === userId.value);
    if (exists == true) {
      className.value = "winner";
      trophy = true;
      // return className;
    } else {
      className.value = "loser";
      trophy = false;
      // return className;
    }
  } else {
    className.value = "draw";
  }
  return className.value;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Форматируем день, месяц, год
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();

  // Форматируем часы, минуты, секунды
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Собираем итоговую строку
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

async function forcedUpdate() {
  await setLoadingValue(true);
  await fetchGames();
  await getGamesByEnemy(userId.value);
  await mergeGameData(gamesData.value, strangersData.value);
  await setLoadingValue(false);
}

onMounted(async () => {
  console.log("onMounted");
  await forcedUpdate();
});

onUnmounted(() => {
  stopPolling(); // Останавливаем опрос при уничтожении компонента
  console.log("onUnmounted");
});
</script>

<style scoped>
.loser {
  background: red;
}

.winner {
  background: lavender;
}

.draw {
  background: greenyellow;
}
.games-list {
  margin-top: 20px;
}

.hover {
  /* border-radius: 50%; */
  -webkit-transition: -webkit-transform 0.8s ease-in-out;
  transition: transform 0.8s ease-in-out;
}
.hover:hover {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  scale: 1.5;
  cursor: pointer;
}
</style>
