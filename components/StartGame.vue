<template>
  <div class="main">
    <!-- {{ userId }} -->
    <v-row justify="center">
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="ma-2" color="primary" v-bind="props">
            Создать игру
          </v-btn>
        </template>
        <!-- <v-list :items="items"></v-list> -->
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.value"
            @click="handleItemClick(item.value)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <div v-if="clickItem == 1">1</div>
      <div v-else-if="clickItem == 2">2</div> -->

      <div class="mx-4 hidden-sm-and-down"></div>
    </v-row>

    <v-row justify="center">
      <div class="text-center pa-4">
        <v-btn @click="(dialog = true), (clickedItem = 2)" color="primary">
          Присоединиться к игре
        </v-btn>

        <v-dialog v-model="dialog" width="auto">
          <v-card width="400">
            <v-text-field
              v-model="gameId"
              hide-details="auto"
              label="Введите id игры"
            ></v-text-field>
            <template v-slot:actions>
              <v-btn
                class="ms-auto"
                text="Ok"
                @click="(dialog = false), joinTheGame()"
              ></v-btn>
            </template>
          </v-card>
        </v-dialog>

        <v-dialog v-if="clickedItem == 1" v-model="dialog" width="auto">
          <v-card width="400">
            <v-text-field
              v-model="theme"
              hide-details="auto"
              label="Введите тему"
            ></v-text-field>
            <template v-slot:actions>
              <v-btn
                class="ms-auto"
                text="Ok"
                @click="(dialog = false), createGame()"
              ></v-btn>
            </template>
          </v-card>
        </v-dialog>
      </div>
      {{ clickItem }}
      <div class="mx-4 hidden-sm-and-down"></div>
    </v-row>
  </div>
</template>

<script>
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";
import { mapState } from "pinia";
import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";

export default {
  data: () => ({
    items: [
      {
        title: "СВОЯ ТЕМА",
        value: 1,
      },
      {
        title: "СЛУЧАЙНАЯ ТЕМА",
        value: 2,
      },
    ],

    dialog: false,
    clickedItem: null,
    gameId: "",
    theme: "",
    loading: false,
  }),
  computed: {
    // Используем mapState для получения состояния из хранилища
    ...mapState(
      useSessionStore,
      ["username", "email", "userId", "avatarProfile", "avatar"],
      useGameStore,
      ["clickItem", "gameTheme", "loading"]
    ),
  },
  //   mounted() {
  //     this.fetchData();
  //   },
  methods: {
    handleItemClick(value) {
      this.clickedItem = value;
      //   this.setClickItem(this.clickedItem);
      if (this.clickedItem == 1) {
        this.dialog = true;
      }
      console.log("Clicked item value:", this.clickItem);
    },

    setClickItem(clickedItem) {
      const gameStore = useGameStore();
      gameStore.setClickItem(clickedItem); // или любое другое значение
      // console.log('Is valid:', sessionStore.valid);
    },

    setGameTheme(theme) {
      const gameStore = useGameStore();
      gameStore.setGameTheme(theme);
    },

    setLoadingValue(loading) {
      const gameStore = useGameStore();
      gameStore.setLoadingValue(loading);
    },

    async createGame() {
      this.setLoadingValue(true);
      // Получаем текущего пользователя
      const currentUser = Parse.User.current();

      if (!currentUser) {
        console.error("No user is currently logged in");
        return;
      }

      // Определяем новый класс (таблицу)
      const Game = Parse.Object.extend("Games");

      // Создаём новый объект этого класса
      const newGame = new Game();

      // Устанавливаем значения полей
      newGame.set("CoincidenceTheme", this.theme);

      // Устанавливаем связь с текущим пользователем
      newGame.set("GameCreator", currentUser);
      this.setClickItem(this.clickedItem);
      this.setGameTheme(this.theme);

      try {
        // Сохраняем объект
        const result = await newGame.save();
        // this.setClickItem(this.clickedItem);
        console.log("New game created successfully");

        // Сохранение id игры в localStorage
        localStorage.setItem("gameId", result.id);
        console.log(
          "Game ID saved to localStorage:",
          result.get("GameCreator")
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
      } catch (error) {
        console.error("Error while creating new game:", error);
      } finally {
        this.setLoadingValue(false); // Скрываем загрузчик
      }
    },

    async joinTheGame() {
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
    },
  },
};
</script>
<style scoped>
.main {
  margin-top: 100px;
}
</style>
