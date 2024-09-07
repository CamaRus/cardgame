<template>
  <v-dialog v-model="confirmation" width="auto">
    <v-card style="text-align: center; padding: 15px">
      <v-card-title>Игра ID: {{ selectedGame?.objectId }}</v-card-title>
      <v-card-subtitle>Ваши соперники:</v-card-subtitle>
      <!-- <template v-slot:actions> -->
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
        <!-- <div style="justify-content: center"> -->
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
        <v-btn color="primary" v-if="selectedGame.EnemyData.length > 1"
          >Начать игру</v-btn
        >
        <v-btn color="primary" v-else>Начать игру 1 на 1</v-btn>
        <!-- </div> -->
      </div>
      <!-- </template> -->
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

import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

const gameStore = useGameStore();
const { confirmation, selectedGame } = storeToRefs(gameStore);
const { confirmationWindow, confirmationWindowClose } = gameStore;
</script>

<style scoped></style>
