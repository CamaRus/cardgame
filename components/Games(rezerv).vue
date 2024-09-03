<template>
  <div class="d-inline">
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12">
          <v-card style="margin-top: 5%">
            <h2 style="text-align: center" v-show="!loading">Текущие игры</h2>
            <v-row>
              <v-col
                v-for="(game, index) in games"
                :key="game.objectId"
                cols="12"
                sm="4"
                md="4"
                lg="4"
              >
                <div style="display: flex; justify-content: center">
                  <p><strong>ID игры:</strong></p>
                  &nbsp
                  <p>{{ game.objectId }}</p>
                </div>
                <v-card
                  :disabled="!game.Opponent"
                  class="text-center"
                  max-width="400"
                  hover
                  style="padding-block-end: 25px"
                  @click="openGame(game)"
                >
                  <v-card-title>Игра {{ index + 1 }}</v-card-title>
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
                  <v-card-subtitle v-if="game.Opponent">
                    Соперники найдены:
                  </v-card-subtitle>
                  <v-chip-group
                    style="display: ruby"
                    v-for="Enemy in game.EnemyData"
                    :key="Enemy.username"
                  >
                    <v-chip>{{ Enemy.Enemy.username }}</v-chip>
                  </v-chip-group>
                  <!-- <div v-for="Enemy in game.EnemyData" :key="Enemy.username">
                      <p>{{ Enemy.Enemy.username }}</p>
                    </div> -->
                  <v-card-subtitle v-if="!game.Opponent"
                    >Ожидание соперника...
                    <v-progress-circular
                      color="amber"
                      indeterminate
                    ></v-progress-circular>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Game></Game>
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
const { start, loading, gamesData } = storeToRefs(gameStore);
const { setStartValue, setLoadingValue, openGame, setGames } = gameStore;

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
    // console.log(games.value);
    console.log(games.value);

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
  } catch (error) {
    console.error("Error while fetching games:", error);
  } finally {
    setLoadingValue(false);
  }
};

const getGames = async () => {
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

    // Проходим по всем найденным играм
    const gamesWithEnemyData = await Promise.all(
      results.map(async (game) => {
        const gameJson = game.toJSON();

        // Получаем данные из отношения EnemyData
        const enemyDataRelation = game.relation("EnemyData");
        const enemyDataQuery = enemyDataRelation.query();

        try {
          const enemyDataResults = await enemyDataQuery.find();

          // Проходим по всем найденным записям в EnemyData
          const enemyDataJson = await Promise.all(
            enemyDataResults.map(async (enemyData) => {
              const enemyDataObj = enemyData.toJSON();

              // Получаем данные из указателя Enemy
              const enemyPointer = enemyData.get("Enemy");
              if (enemyPointer) {
                const enemyQuery = new Parse.Query(Parse.User);
                try {
                  const enemy = await enemyQuery.get(enemyPointer.id);
                  enemyDataObj.Enemy = enemy.toJSON();
                } catch (error) {
                  console.error("Error while fetching enemy data:", error);
                }
              }

              return enemyDataObj;
            })
          );

          gameJson.EnemyData = enemyDataJson;
        } catch (error) {
          console.error("Error while fetching enemy data relation:", error);
        }

        return gameJson;
      })
    );

    games.value = gamesWithEnemyData;
    setGames(games.value);
    console.log(games.value);
  } catch (error) {
    console.error("Error while fetching games:", error);
  } finally {
    setLoadingValue(false);
  }
};

// Используем onMounted для выполнения запроса при монтировании компонента
onMounted(() => {
  getGames();
});
</script>

<style scoped>
.games-list {
  margin-top: 20px;
}
</style>
