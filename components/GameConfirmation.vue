<template>
  <v-dialog
    v-model="confirmation"
    :width="xs ? '100%' : '500px'"
    :fullscreen="xs"
  >
    <v-card style="text-align: center; padding: 15px">
      <v-btn
        icon="mdi-close"
        @click="confirmation = false"
        style="left: 90%; margin-block-end: 1%; scale: 50%"
      ></v-btn>
      <div
        class="d-flex"
        style="
          border-style: groove;
          border-radius: 10px;
          justify-content: center;
        "
      >
        <v-card-title>ID игры: {{ selectedGame?.objectId }}</v-card-title>
        <span style="cursor: pointer" @click="copyGameId(selectedGame)"
          ><font-awesome-icon size="xl" icon="copy" fade />
          <v-tooltip activator="parent" location="bottom">{{
            tooltipText
          }}</v-tooltip></span
        >
      </div>
      <!-- {{ userId }} -->
      <!-- {{ selectedGame.GameCreator }} -->
      <!-- <hr /> -->
      <v-card-subtitle>Ваши соперники:</v-card-subtitle>
      <div>
        <div>
          <v-chip-group
            style="display: ruby"
            v-for="Enemy in selectedGame.EnemyData"
            :key="Enemy.Enemy.username"
          >
            <v-chip>{{ Enemy.Enemy.username }}</v-chip>
          </v-chip-group>
        </div>
        <v-alert
          style="margin-block-end: 10px"
          v-if="selectedGame.EnemyData.length > 1"
          text="Начните игру или дождитесь других соперников"
          type="info"
        ></v-alert>
        <v-alert
          style="margin-block-end: 10px"
          v-else
          text="Начните игру 1 на 1 или дождитесь других соперников"
          type="info"
        ></v-alert>
        <v-btn
          color="primary"
          v-if="selectedGame.EnemyData.length > 1"
          @click="openGame(selectedGame)"
          >Начать игру</v-btn
        >
        <v-btn color="primary" v-else @click="duelMenu(true, selectedGame)"
          >Начать игру 1 на 1</v-btn
        >
      </div>
    </v-card>
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
import { useDisplay } from "vuetify";

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { userId } = storeToRefs(sessionStore);
const { confirmation, selectedGame, duel, tooltipText } =
  storeToRefs(gameStore);
const {
  confirmationWindow,
  confirmationWindowClose,
  openGame,
  duelMenu,
  copyGameId,
} = gameStore;
const { mobile } = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;
const width = useDisplay().width;
</script>

<style scoped></style>
