import { defineStore } from "pinia";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export const useGameStore = defineStore("gameStore", () => {
  const loading = ref(false);
  const clickItem = ref<string | null>(null);
  const start = ref(false);
  const gameTheme = ref<string | null>(null);

  function setClickItem(clickedItem) {
    clickItem.value = clickedItem;
    start.value = true;
    console.log("setClickItem!!!");
  }

  function setGameTheme(theme) {
    gameTheme.value = theme;
    console.log("Game Theme: ", gameTheme);
  }

  function setStartValue(newStartValue) {
    start.value = newStartValue;
  }

  function setLoadingValue(newLoadingValue) {
    loading.value = newLoadingValue;
  }

  return {
    clickItem,
    setClickItem,
    start,
    gameTheme,
    setGameTheme,
    setStartValue,
    loading,
    setLoadingValue,
  };
});
