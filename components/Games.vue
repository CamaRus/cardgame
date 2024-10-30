<template>
  <div class="d-inline">
    <div v-for="(game, index) in gamesData" :key="index">
      {{ game.objectId }}
      {{ game.GameCreator.objectId }}
    </div>
    {{ userId }}
    <!-- <hr /> -->
    <!-- <div v-for="(game, index) in strangersData" :key="index">
      {{ game.objectId }}
    </div> -->
    <!-- <div v-for="(game, index) in gamesData" :key="index">
      {{ game.EnemyData }}
    </div> -->
    <!-- {{ for (let i = 0; gamesData.length; i++) {
    console.log(gamesData[i].objectId);
} }} -->
    <!-- {{ gamesData }} -->
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
          <!-- {{ gamesData }} -->
          <v-card style="margin-top: 5%">
            <!-- <h2 style="text-align: center" v-show="!loading">Текущие игры</h2> -->
            <v-row>
              <v-col
                v-for="(game, index) in gamesData"
                :key="game.objectId"
                v-show="!game.Finish"
                cols="12"
                sm="4"
                md="4"
                lg="4"
              >
                <!-- <div style="display: flex; justify-content: center"> -->
                <!-- <p><strong>ID игры:</strong></p> -->
                <!-- &nbsp -->
                <!-- <p>{{ game.objectId }}</p> -->
                <!-- </div> -->
                <v-card
                  :disabled="
                    (game.GameCreator.objectId !== userId && !game.WaitEnemy) ||
                    (game.GameCreator.objectId === userId && game.WaitEnemy)
                  "
                  class="text-center"
                  max-width="400"
                  hover
                  style="padding-block-end: 25px"
                  @click="
                    {
                      {
                        if (
                          game.Opponent &&
                          !confirmationArray.includes(game.objectId) &&
                          !game.Duel
                        ) {
                          // openGame(game);
                          confirmationWindow(game);
                        } else if (!game.Opponent) {
                          copyGameId(game);
                        } else if (
                          game.GameCreator.objectId !== userId &&
                          game.WaitEnemy
                        ) {
                          duelMenu(true, game);
                        } else {
                          openGame(game);
                        }
                      }
                    }
                  "
                >
                  <!-- <v-card-title
                    >Дата создания:
                    {{ formatDate(game.createdAt) }}</v-card-title
                  > -->
                  <v-card color="indigo" style="text-align: center">
                    <p>
                      <strong>{{ formatDate(game.createdAt) }}</strong>
                    </p>
                  </v-card>
                  <!-- <v-card-subtitle v-if="game.Opponent"
                    >Совпадение: {{ game.CoincidenceTheme }}</v-card-subtitle
                  > -->
                  <!-- <v-card-subtitle v-if="game.Opponent"
                    >Несовпадение:{{ game.MismatchTheme }}</v-card-subtitle
                  > -->
                  <!-- <v-card-subtitle v-if="game.Opponent"
                    >Соперники:{{
                      game.EnemyData[0].Enemy.username
                    }}</v-card-subtitle
                  > -->
                  <v-card-subtitle
                    v-if="game.Opponent && game.GameCreator.objectId === userId"
                  >
                    Соперники найдены!
                  </v-card-subtitle>
                  <v-card-subtitle
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
                  <!-- <v-chip-group
                    style="display: ruby"
                    v-for="Enemy in game.EnemyData"
                    :key="Enemy.username"
                  >
                    <v-chip>{{ Enemy.Enemy.username }}</v-chip>
                  </v-chip-group> -->
                  <!-- <div v-for="Enemy in game.EnemyData" :key="Enemy.username">
                    <p>{{ Enemy.Enemy.username }}</p>
                  </div> -->
                  <v-tooltip
                    activator="parent"
                    location="start"
                    v-if="!game.Opponent"
                    >{{ tooltipText }}</v-tooltip
                  >
                  <v-card-subtitle
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
          <!-- ------------------------------------------------------------------------------------------------------------ -->
          <!-- <v-card
            style="display: flex; justify-content: center"
            class="mx-auto text-center"
            color="surface-variant"
            title="Чужие игры"
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
          </v-card> -->
          <!-- {{ gamesData }} -->
          <!-- <v-card style="margin-top: 5%"> -->
          <!-- <h2 style="text-align: center" v-show="!loading">Текущие игры</h2> -->
          <!-- <v-row>
              <v-col
                v-for="(stranger, index) in strangersData"
                :key="stranger.objectId"
                v-show="!stranger.Finish"
                cols="12"
                sm="4"
                md="4"
                lg="4"
              > -->
          <!-- <div style="display: flex; justify-content: center"> -->
          <!-- <p><strong>ID игры:</strong></p> -->
          <!-- &nbsp -->
          <!-- <p>{{ game.objectId }}</p> -->
          <!-- </div> -->
          <!-- <v-card
                  :disabled="!stranger.Finish"
                  class="text-center"
                  max-width="400"
                  hover
                  style="padding-block-end: 25px"
                  @click="
                    {
                      {
                        if (
                          stranger.Opponent &&
                          !confirmationArray.includes(stranger.objectId) &&
                          !stranger.Duel
                        ) {
                          // openGame(game);
                          confirmationWindow(stranger);
                        } else if (!stranger.Opponent) {
                          copyGameId(stranger);
                        } else {
                          openGame(stranger);
                        }
                      }
                    }
                  "
                > -->
          <!-- <v-card-title>Игра {{ index + 1 }}</v-card-title> -->
          <!-- <v-card color="indigo" style="text-align: center">
                    <p>
                      <strong>{{ formatDate(stranger.createdAt) }}</strong>
                    </p>
                  </v-card> -->
          <!-- <v-card-subtitle v-if="game.Opponent"
                    >Совпадение: {{ game.CoincidenceTheme }}</v-card-subtitle
                  > -->
          <!-- <v-card-subtitle v-if="game.Opponent"
                    >Несовпадение:{{ game.MismatchTheme }}</v-card-subtitle
                  > -->
          <!-- <v-card-subtitle v-if="game.Opponent"
                    >Соперники:{{
                      game.EnemyData[0].Enemy.username
                    }}</v-card-subtitle
                  > -->
          <!-- <v-card-subtitle v-if="stranger.Opponent">
                    Ожидание ведущего!
                  </v-card-subtitle>
                  <div>
                    <v-progress-circular
                      color="amber"
                      indeterminate
                    ></v-progress-circular>
                  </div> -->
          <!-- <v-chip-group
                    style="display: ruby"
                    v-for="Enemy in game.EnemyData"
                    :key="Enemy.username"
                  >
                    <v-chip>{{ Enemy.Enemy.username }}</v-chip>
                  </v-chip-group> -->
          <!-- <div v-for="Enemy in game.EnemyData" :key="Enemy.username">
                    <p>{{ Enemy.Enemy.username }}</p>
                  </div> -->
          <!-- <v-tooltip
                    activator="parent"
                    location="start"
                    v-if="!stranger.Opponent"
                    >{{ tooltipText }}</v-tooltip
                  >
                  <v-card-subtitle v-if="!stranger.Opponent"
                    >Ожидание соперника...
                    <v-progress-circular
                      color="amber"
                      indeterminate
                    ></v-progress-circular>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-card> -->
          <!-- ------------------------------------------------------------------------------------------------------------ -->
          <v-card
            class="mx-auto text-center"
            color="surface-variant"
            title="Завершенные игры"
            style="margin-top: 20px"
          ></v-card>
          <v-card style="margin-top: 5%">
            <!-- <h2 style="text-align: center" v-show="!loading">Текущие игры</h2> -->
            <v-row>
              <v-col
                v-for="(game, index) in gamesData"
                :key="game.objectId"
                v-show="game.Finish"
                cols="12"
                sm="4"
                md="4"
                lg="4"
              >
                <div style="display: flex; justify-content: center"></div>
                <v-card
                  :disabled="!game.Opponent"
                  class="text-center"
                  max-width="400"
                  hover
                  style="padding-block-end: 25px"
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
                    <div style="display: flex; justify-content: center">
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
                  </div>
                  <div v-else>
                    <v-card-subtitle><h3>Ничья!</h3></v-card-subtitle>
                  </div>
                </v-card>
              </v-col>
              <!-- ////////////////////////////////////////////////////// -->
              <!-- <v-col
                v-for="(game, index) in strangersData"
                :key="game.objectId"
                v-show="game.Finish"
                cols="12"
                sm="4"
                md="4"
                lg="4"
              >
                <div style="display: flex; justify-content: center"></div>
                <v-card
                  :disabled="!game.Opponent"
                  class="text-center"
                  max-width="400"
                  hover
                  style="padding-block-end: 25px"
                  @click="openScoreboard(game)"
                  :style="getChipStyle(game.WinnerData)"
                > -->
              <!-- <v-card-title>Игра {{ index + 1 }}</v-card-title> -->
              <!-- <v-card color="indigo" style="text-align: center">
                    <p>
                      <strong>{{ formatDate(game.createdAt) }}</strong>
                    </p>
                  </v-card>

                  <v-card-subtitle v-if="game.Opponent"> -->
              <!-- <h3 :style="getChipStyle(Winner)">Победители:</h3> -->
              <!-- <h3>Победители:</h3> -->
              <!-- <div>{{ game.Winners.includes(username) }}</div> -->
              <!-- {{ game.Winners[0].includes("CamaRus1991") }} -->
              <!-- </v-card-subtitle>
                  <div style="display: flex; justify-content: center">
                    <v-chip-group
                      v-for="Winner in game.WinnerData"
                      :key="Winner.objectId"
                      style="display: block"
                    >
                      <v-chip>
                        {{ Winner.username }}
                      </v-chip>
                    </v-chip-group> -->
              <!-- </div>
                </v-card>
              </v-col> -->
            </v-row>
          </v-card>
          <!-- ////////////////////////////////////////////////////////////////////
                 ///////////////////////////////////////////////////////////////////////// -->

          <!-- ////////////////////////////////////////////////////////////////////////////////////////////// -->
          <!-- /////////////////////////////////////////////////////////////////////////////////////////////////// -->
          <!-- {{ gamesData }} -->
          <hr />
          <!-- {{ strangersData }} -->
        </v-col>
      </v-row>
    </v-container>
    <MatchingGame></MatchingGame>
    <GameConfirmation></GameConfirmation>
    <DuelMenu></DuelMenu>
    <Scoreboard></Scoreboard>
    <!-- <MismatchingGame v-if="finishMatchGame"></MismatchingGame> -->
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

const sessionStore = useSessionStore();
const { username, userId } = storeToRefs(sessionStore);

const gameStore = useGameStore();
const {
  start,
  loading,
  gamesData,
  finishMatchGame,
  tooltipText,
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
  openScoreboard,
  getAllGames,
  getGamesByEnemy,
  mergeGameData,
  duelMenu,
} = gameStore;

// Создание реактивного состояния для хранения данных
// const games = ref<any[]>([]);
const finishGames = ref<any[]>([]);
let intervalId;
let className = "loser";

// function mergeGameData(array1, array2) {
//   // Добавляем все объекты из array2 в array1
//   array2.forEach((game) => {
//     array1.push(game);
//   });

//   // Возвращаем обновленный первый массив
//   // return array1;
//   console.log(array1);
// }

// const h3 = ref(false);

// const getChipClass = (Winner) => {
//   return {
//     "winner-chip": username.value === Winner,
//     "regular-chip": username.value !== Winner,
//   };
// };

// const getChipStyle = (Winner) => {
//   return {
//     // backgroundColor: username.value === Winner ? 'green' : 'gray',
//     // color: 'white',
//     // fontWeight: username.value === Winner ? 'bold' : 'normal',
//     // display: username.value !== Winner ? "none" : "block",
//     background: username.value === Winner ? "red" : "lavender",
//   };
// };

// async function getGamesByEnemy(enemyId: any) {
//   try {
//     // Создаём указатель на пользователя (Enemy)
//     const EnemyPointer = new Parse.User();
//     EnemyPointer.id = enemyId;

//     // Создаём запрос на Games
//     const query = new Parse.Query("Games");

//     // Создаём подзапрос на Relation (EnemyData), чтобы найти записи с нужным Enemy
//     const enemyDataQuery = new Parse.Query("EnemyData");
//     enemyDataQuery.equalTo("Enemy", EnemyPointer);

//     // Добавляем фильтр в основной запрос
//     query.matchesQuery("EnemyData", enemyDataQuery);

//     // Выполняем запрос
//     const games = await query.find();
//     console.log("Games with the specified enemy:", games);

//     // return games;
//   } catch (error) {
//     console.error("Error fetching games by enemy:", error);
//   }
// }

const startPolling = () => {
  intervalId = setInterval(fetchGames, 20000); // Опрашиваем сервер каждые 5 секунд
};

const stopPolling = () => {
  clearInterval(intervalId);
};

const getChipStyle = (game) => {
  // if (game) {
  //   return {
  //     background: game.includes(username.value) ? "lavender" : "red",
  //   };
  // }
  // if (game) {
  //   console.log("getChipStyle: ", game);
  // }
  console.log("Winners: ", game);

  if (game.length > 0 && game.length < 4) {
    game.forEach((element) => {
      // console.log(element.objectId);
      if (element.objectId.includes(userId.value)) {
        console.log("Include!", element.objectId);
        console.log("Duel: ", game.Duel);
        className = "winner";
      } else if (!element.objectId.includes(userId.value)) {
        className = "loser";
        console.log("Loser!", element.objectId);
      }
      // else if (element.objectId.includes(userId.value) && game.Duel == true) {
      //   className = "draw";
      //   console.log("Draw!");
      // }
    });
  } else {
    className = "draw";
  }
  return className;
  // Проверим, является ли объект прокси и попробуем извлечь данные
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

// const winners = ["Ox7KZ6RJfB", "4bse4uWN7j"];

async function joinTheGame() {
  const Game = Parse.Object.extend("Games");
  const query1 = new Parse.Query(Game);
  // Ищем объект по id
  const gameObject = await query1.get(this.gameId);

  const Enemy = Parse.Object.extend("EnemyData");
  const query2 = new Parse.Query(Enemy);
  const enemyObject = await query2.get("R6Hby7Qgmi");

  if (gameObject) {
    console.log("Game found: ", gameObject);
    console.log("Enemy found: ", enemyObject);
    const relation = gameObject.relation("EnemyData");
    relation.add(enemyObject);
    gameObject.save();

    // Создаем новую колонку с типом массив и записываем туда данные
    // gameObject.set("MatchValues", matchValues);

    // Сохраняем изменения
    // await gameObject.save();
    // matchGame.value = false;
    // dialog.value = true;

    //   console.log("Game updated successfully with new array column.");
    // console.log("Dialog: ", dialog);
    // console.log("Match Game: ", matchGame);
  }
}

// async function searchForWinners(winnerId) {
//   // Создаем новый Parse Query для класса _User
//   const query = new Parse.Query(Parse.User);

//   // Добавляем условие, чтобы получить пользователей, чьи objectId находятся в массиве
//   // query.containedIn("objectId", winnerId);

//   try {
//     // Выполняем запрос
//     const users = await query.find();

//     // Преобразуем полученные данные в удобный формат и выводим их в консоль
//     const usersData = users.map((user) => user.toJSON());
//     console.log("Полученные пользователи:", usersData);

//     return usersData;
//   } catch (error) {
//     console.error("Ошибка при получении пользователей:", error);
//   }
// }

// Функция для получения данных игр текущего пользователя
// const fetchGames = async () => {
//   setLoadingValue(true);
//   const currentUser = Parse.User.current();

//   if (!currentUser) {
//     console.error("No user is currently logged in");
//     return;
//   }

//   const Game = Parse.Object.extend("Games");
//   const query = new Parse.Query(Game);

//   // Добавляем условие, чтобы получать только игры текущего пользователя
//   query.equalTo("GameCreator", currentUser);

//   try {
//     const results = await query.find();
//     games.value = results.map((result) => result.toJSON());
//     // console.log(games.value);
//     console.log(games.value);

// const relation = results[15].relation("EnemyData");
// const enemyQuery = relation.query();
// const enemies = await enemyQuery.find();
// const relatedEnemies = enemies.map((enemy) => enemy.toJSON());
// console.log(relatedEnemies);
// console.log(relatedEnemies[0].Enemy.objectId);

// const players = [];

// for (const item of results) {
//   const relation = item.relation("EnemyData");
//   const enemyQuery = relation.query();
//   const enemies = await enemyQuery.find();
//   // const enemy = new Parse.Query(Parse.User);
//   // const user = await query.get(objectId);
//   const jsonenemies = enemies.map((enemy) => enemy.toJSON());

//   players.push(jsonenemies);
// }

// const objectIds = [];
// for (const item of players) {
//   const objectId = item.Enemy.objectId;
//   objectIds.push(objectId);
// }

// console.log("Players: ", players);
// console.log("ObjectIds: ", objectIds);

// const users = [];
// for (const item of relatedEnemies) {
//   // if (item.Enemy && item.Enemy.objectId) {
//   const enemy = new Parse.Query(Parse.User);
//   // const user = await query.get(objectId);
//   const user = await enemy.get(item.Enemy.objectId);
//   if (user) {
//     users.push(user);
//   }
//   // }
// }
// const data = { relatedEnemies: relatedEnemies, users: users };
// console.log(relatedEnemies[0].Enemy);
// console.log("Users: ", users);
//   } catch (error) {
//     console.error("Error while fetching games:", error);
//   } finally {
//     setLoadingValue(false);
//   }
// };

// const getGames = async () => {
//   setLoadingValue(true);
//   const currentUser = Parse.User.current();

//   if (!currentUser) {
//     console.error("No user is currently logged in");
//     return;
//   }

//   const Game = Parse.Object.extend("Games");
//   const query1 = new Parse.Query(Game);
//   // const query2 = new Parse.Query(Game);

//   // Добавляем условие, чтобы получать только игры текущего пользователя
//   query1.equalTo("GameCreator", currentUser);
//   // Добавляем условие, чтобы получать только завершенные игры
//   // query1.equalTo("Finish", false);
//   // query2.equalTo("GameCreator", currentUser);
//   // query2.equalTo("Finish", true);

//   try {
//     const results1 = await query1.find();
//     // const results2 = await query2.find();

//     // Проходим по всем найденным и незавершённым играм
//     const gamesWithEnemyData = await Promise.all(
//       results1.map(async (game) => {
//         const gameJson = game.toJSON();

//         // Получаем данные из отношения EnemyData
//         const enemyDataRelation = game.relation("EnemyData");
//         const enemyDataQuery = enemyDataRelation.query();

//         try {
//           const enemyDataResults = await enemyDataQuery.find();

//           // Проходим по всем найденным записям в EnemyData
//           const enemyDataJson = await Promise.all(
//             enemyDataResults.map(async (enemyData) => {
//               const enemyDataObj = enemyData.toJSON();

//               // Получаем данные из указателя Enemy
//               const enemyPointer = enemyData.get("Enemy");
//               if (enemyPointer) {
//                 const enemyQuery = new Parse.Query(Parse.User);
//                 try {
//                   const enemy = await enemyQuery.get(enemyPointer.id);
//                   enemyDataObj.Enemy = enemy.toJSON();
//                 } catch (error) {
//                   console.error("Error while fetching enemy data:", error);
//                 }
//               }

//               return enemyDataObj;
//             })
//           );

//           gameJson.EnemyData = enemyDataJson;
//         } catch (error) {
//           console.error("Error while fetching enemy data relation:", error);
//         }

//         return gameJson;
//       })
//     );

//     games.value = gamesWithEnemyData;
//     setGames(games.value);
//     console.log(games.value);
//     // console.log("Finish Games: ", results2);
//   } catch (error) {
//     console.error("Error while fetching games:", error);
//   } finally {
//     setLoadingValue(false);
//   }
// };

// Используем onMounted для выполнения запроса при монтировании компонента
// onMounted(() => {
//   // getGames();
//   // fetchGames();
//   await setupLiveQuery();
// });

onMounted(async () => {
  // await fetchGames();
  await forcedUpdate();
  // getGamesByEnemy(userId.value);
  await getAllGames();
  // mergeGameData(gamesData.value, strangersData.value);
  // startPolling(); // Начинаем опрос
});

onUnmounted(() => {
  stopPolling(); // Останавливаем опрос при уничтожении компонента
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

/* .hover:hover {
  cursor: pointer;
  scale: 1.5;
  transform: rotate(45deg);
} */

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
