<template>
  <v-dialog width="auto" v-model="maxPlayers">
    <v-alert
      color="red"
      text="Достигнуто максимальное количество игроков!"
      type="warning"
      prominent
    ></v-alert>
  </v-dialog>
</template>

<script setup lang="ts">
import Parse from "parse";

// Инициализация Parse SDK (добавьте ваши ключи и URL)
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";
import { useSessionStore } from "../store/session";

const gameStore = useGameStore();
const { maxPlayers } = storeToRefs(gameStore);
</script>
