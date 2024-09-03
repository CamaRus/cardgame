<template>
  <v-dialog v-model="gameVisible" max-width="500">
    <v-card>
      <v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title>
      <v-card-text>
        <h2 class="animation" style="text-align: center">Игра на совпадение</h2>
        <h3 style="text-align: center">{{ selectedGame?.CoincidenceTheme }}</h3>
        <!-- <h3>Игрок: {{ selectedGame?.GameCreator }}</h3> -->
        <div>
          <!-- {{ relatedEnemies[0].Enemy }} -->
        </div>
      </v-card-text>
      <v-row no-gutters>
        <v-col>
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p><strong>Мои значения</strong></p></v-card
            >
            <v-radio-group v-model="selectedGame.MatchValue">
              <v-radio
                v-for="(MatchValue, index) in selectedGame.MatchValues"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
              ></v-radio>
            </v-radio-group>
            <p>Selected Button: {{ selectedGame.MatchValue }}</p>
          </v-sheet>
        </v-col>
        <v-col>
          <!-- {{ enemiesData }} -->
          <!-- <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="text-align: center"
              ><p><strong>Значения соперника</strong></p></v-card
            >
            <v-radio-group v-model="relatedEnemies[0].MatchValue">
              <v-radio
                v-for="(MatchValue, index) in relatedEnemies[0].MatchValues"
                :label="MatchValue"
                :value="MatchValue"
                :key="index + MatchValue"
              ></v-radio>
            </v-radio-group>
            <p>Selected Button: {{ relatedEnemies[0].MatchValue }}</p>
          </v-sheet> -->
        </v-col>
      </v-row>

      <v-card-actions>
        <v-btn color="primary" @click="closeGame">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
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

// import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

// const sessionStore = useSessionStore();
// const { avatarProfile } = storeToRefs(sessionStore);
// const { avatar } = storeToRefs(sessionStore);
// const { setAvatar } = sessionStore;

const gameStore = useGameStore();
const { loading, selectedGame, gameVisible, relatedEnemies, enemiesData } =
  storeToRefs(gameStore);
const { setLoadingValue, openGame, closeGame } = gameStore;
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
