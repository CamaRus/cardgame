<template>
  <v-dialog v-model="scoreboardWindow" width="50%">
    <v-card style="text-align: center; padding: 15px">
      <h1 class="animation" style="text-align: center" v-if="winner">
        Вы выиграли!
      </h1>
      <h1 class="animation" style="text-align: center" v-else>Вы проиграли!</h1>
      <h2 class="animation" style="text-align: center">Результаты игры</h2>
      <h3 style="text-align: center">Игра на совпадение</h3>
      <div v-if="enemyGame">Enemy Game!</div>
      <!-- <v-card color="secondary"> -->
      <h3 style="text-align: center; background: silver">
        {{ selectedGame?.CoincidenceTheme }}
      </h3>
      <!-- </v-card> -->
      <v-row no-gutters v-if="!enemyGame">
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p><strong>Мои значения</strong></p>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MatchValue, index) in selectedGame.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.objectId"
        >
          <!-- {{ enemiesData }} -->
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p>
                <strong>{{ Enemy.Enemy.username }}</strong>
              </p></v-card
            >
            <v-list
              v-model="Enemy.MatchValue"
              v-for="(MatchValue, index) in Enemy.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- ////////////////////////////////////////////////////////////////////////// -->
      <v-row no-gutters v-else>
        <!-- {{ remainingEnemyData }} -->
        <v-col>
          <!-- {{ myDataInEnemyGame }} -->
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p><strong>Мои значения</strong></p>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MatchValue, index) in myDataInEnemyGame[0].MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p>
                <strong>{{ selectedGame.GameCreator.username }}</strong>
              </p>
            </v-card>
            <v-list
              v-for="(MatchValue, index) in selectedGame.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
          v-show="Enemy.Enemy.objectId !== userId"
        >
          <!-- {{ enemiesData }} -->
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p>
                <strong>{{ Enemy.Enemy.username }}</strong>
              </p></v-card
            >
            <v-list
              v-model="Enemy.MatchValue"
              v-for="(MatchValue, index) in Enemy.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <hr />
      <v-row no-gutters v-if="!enemyGame">
        <v-col v-for="MatchScore in selectedGame.MatchScore" :key="MatchScore">
          <v-sheet>
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters v-else>
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="MatchScore[0] === userId"
        >
          <v-sheet v-if="MatchScore[0] === userId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="MatchScore[0] === selectedGame.GameCreator.objectId"
        >
          <v-sheet v-if="MatchScore[0] === selectedGame.GameCreator.objectId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
          <!-- <v-sheet v-if="MatchScore[0] === selectedGame.GameCreator.objectId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet> -->
        </v-col>
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="
            MatchScore[0] !== selectedGame.GameCreator.objectId &&
            MatchScore[0] !== userId
          "
        >
          <v-sheet
            v-if="
              MatchScore[0] !== selectedGame.GameCreator.objectId &&
              MatchScore[0] !== userId
            "
          >
            Совпадений:
            {{ MatchScore[1] }}
            <!-- {{ selectedGame.GameCreator }} -->
          </v-sheet>
        </v-col>
      </v-row>
      <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
      <!-- //////////////////////////////////////////////////////////////////// -->
      <hr />
      <h3 style="text-align: center">Игра на несовпадение</h3>
      <!-- <v-card color="primary"> -->
      <h3 style="text-align: center; background: silver">
        {{ selectedGame?.MismatchTheme }}
      </h3>
      <!-- </v-card> -->
      <v-row no-gutters v-if="!enemyGame">
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p><strong>Мои значения</strong></p>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MissmatchValue, index) in selectedGame.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
        >
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p>
                <strong>{{ Enemy.Enemy.username }}</strong>
              </p></v-card
            >
            <v-list
              v-model="Enemy.MissmatchValue"
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- /////////////////////////////////////////////////////////////////////// -->
      <v-row no-gutters v-else>
        <!-- {{ remainingEnemyData }} -->
        <v-col>
          <!-- {{ myDataInEnemyGame }} -->
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p><strong>Мои значения</strong></p>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MissmatchValue, index) in myDataInEnemyGame[0]
                .MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center">
              <p>
                <strong>{{ selectedGame.GameCreator.username }}</strong>
              </p>
            </v-card>
            <v-list
              v-for="(MissmatchValue, index) in selectedGame.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
        <v-col
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
          v-show="Enemy.Enemy.objectId !== userId"
        >
          <!-- {{ enemiesData }} -->
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p>
                <strong>{{ Enemy.Enemy.username }}</strong>
              </p></v-card
            >
            <v-list
              v-model="Enemy.MissmatchValue"
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <hr />
      <v-row no-gutters v-if="!enemyGame">
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore"
        >
          <v-sheet>
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters v-else>
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="MismatchScore[0] === userId"
        >
          <v-sheet v-if="MismatchScore[0] === userId">
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="MismatchScore[0] === selectedGame.GameCreator.objectId"
        >
          <v-sheet
            v-if="MismatchScore[0] === selectedGame.GameCreator.objectId"
          >
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
          <!-- <v-sheet v-if="MatchScore[0] === selectedGame.GameCreator.objectId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet> -->
        </v-col>
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="
            MismatchScore[0] !== selectedGame.GameCreator.objectId &&
            MismatchScore[0] !== userId
          "
        >
          <v-sheet
            v-if="
              MismatchScore[0] !== selectedGame.GameCreator.objectId &&
              MismatchScore[0] !== userId
            "
          >
            Совпадений:
            {{ MismatchScore[1] }}
            <!-- {{ selectedGame.GameCreator }} -->
          </v-sheet>
        </v-col>
      </v-row>
      <hr />
      <!-- {{ selectedGame.EnemyData }} -->
      <!-- {{ selectedGame.WinnerData[0].username }} -->
    </v-card>
    <!-- /////////////////////////////////////////////////////////////////////////////////// -->
    <!-- <v-card style="text-align: center; padding: 15px">
      
    </v-card> -->
  </v-dialog>
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

import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { username, userId } = storeToRefs(sessionStore);
const {
  confirmation,
  selectedGame,
  duel,
  scoreboardWindow,
  winner,
  enemyGame,
  myDataInEnemyGame,
  remainingEnemyData,
} = storeToRefs(gameStore);
const { confirmationWindow, confirmationWindowClose, openGame, duelMenu } =
  gameStore;

// function myDataFromEnemyData() {
//   console.log(selectedGame.value.objectId);
// }

// const winner = ref(false);

// function checkWinners() {
//   if (selectedGame.value.Winners.include(username.value)) {
//     winner.value = true;
//   // }
//   console.log(selectedGame.value.Winners.include("Cam"));
// }

onMounted(() => {
  // checkWinners();
  // myDataFromEnemyData();
});
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
</style>
