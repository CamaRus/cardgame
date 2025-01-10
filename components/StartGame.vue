<template>
  <div class="main" v-if="!loading">
    <v-row justify="center">
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="ma-2" color="primary" v-bind="props">
            Создать игру
          </v-btn>
        </template>
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
      <div class="mx-4 hidden-sm-and-down"></div>
    </v-row>
    <v-row justify="center">
      <div class="text-center pa-4">
        <v-btn @click="handleItemClick(3)" color="primary">
          Присоединиться к игре
        </v-btn>

        <v-dialog
          v-if="join"
          v-model="join"
          :style="{ width: mobile.xs ? '100%' : '400px' }"
          @click:outside="(gameId = null), (error = 0)"
        >
          <v-card>
            <v-text-field
              v-model="gameId"
              hide-details="auto"
              label="Введите id игры"
            ></v-text-field>
            <template v-slot:actions>
              <v-btn
                :disabled="!gameId"
                class="ms-auto"
                text="Ok"
                @click="joinTheGame()"
              ></v-btn>
            </template>
            <v-alert
              v-if="error == 1"
              color="red"
              style="margin-block-end: 10px"
              text="Вы уже участвуете в этой игре!"
              type="warning"
            ></v-alert>
            <v-alert
              v-if="error == 2"
              color="red"
              style="margin-block-end: 10px"
              text="Игры с таким ID не существует!"
              type="warning"
            ></v-alert>
            <v-alert
              v-if="error == 3"
              color="red"
              style="margin-block-end: 10px"
              text="Достигнуто максимальное количество игроков!"
              type="warning"
            ></v-alert>
            <v-alert
              v-if="error == 4"
              color="red"
              style="margin-block-end: 10px"
              text="Игра уже запущена!"
              type="warning"
            ></v-alert>
          </v-card>
        </v-dialog>

        <v-dialog
          v-if="clickedItem == 1"
          v-model="dialog"
          :style="{ width: mobile.xs ? '100%' : '400px' }"
          @click:outside="theme = null"
        >
          <v-card>
            <!-- {{ mobile }} -->
            <v-text-field
              v-model="theme"
              hide-details="auto"
              label="Введите тему (совпадение)"
            ></v-text-field>
            <!-- {{ mobile }} -->
            <template v-slot:actions>
              <v-btn
                :disabled="!theme"
                class="ms-auto"
                text="Ok"
                @click="(dialog = false), saveDataInStorage()"
              ></v-btn>
            </template>
          </v-card>
        </v-dialog>
      </div>
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
import { useDisplay } from "vuetify";

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
    error: 0,
    join: false,
    mobile: useDisplay(),
  }),
  computed: {
    // Используем mapState для получения состояния из хранилища
    ...mapState(useSessionStore, [
      "username",
      "email",
      "userId",
      "avatarProfile",
      "avatar",
    ]),
    ...mapState(useGameStore, [
      "clickItem",
      "gameTheme",
      "loading",
      "randomTopicMatch",
      "gameTheme",
      "gameMismatchTheme",
      "randomTopicMismatch",
    ]),
    display() {
      this.mobile = useDisplay();
      return this.mobile;
    },
  },
  methods: {
    handleItemClick(value) {
      this.clickedItem = value;
      if (this.clickedItem == 1) {
        this.dialog = true;
      } else if (this.clickedItem == 2) {
        this.getRandomTopic();
        this.setClickItem(value);
        this.dialog = true;
      } else {
        this.join = true;
      }
    },

    setClickItem(clickedItem) {
      const gameStore = useGameStore();
      gameStore.setClickItem(clickedItem);
      console.log("Click Item:", clickedItem);
    },

    setGameTheme(theme) {
      const gameStore = useGameStore();
      gameStore.setGameTheme(theme);
    },

    setLoadingValue(loading) {
      const gameStore = useGameStore();
      gameStore.setLoadingValue(loading);
    },

    async saveDataInStorage() {
      this.setLoadingValue(true);
      this.setClickItem(this.clickedItem);
      this.setGameTheme(this.theme);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
      } catch (error) {
        console.error("Error while creating new game:", error);
      } finally {
        this.setLoadingValue(false); // Скрываем загрузчик
      }
    },

    async getRandomTopic() {
      try {
        // Получаем первую случайную тему
        const topic1 = await Parse.Cloud.run("getRandomTopic");
        const gameStore = useGameStore();
        gameStore.setRandomTopicMatch(topic1);

        let topic2;
        do {
          // Получаем вторую случайную тему, если она не совпадает с первой
          topic2 = await Parse.Cloud.run("getRandomTopic");
        } while (topic1 === topic2);

        gameStore.setRandomTopicMismatch(topic2);

        console.log("RandomTopicMatch: ", gameStore.randomTopicMatch);
        console.log("RandomTopicMismatch: ", gameStore.randomTopicMismatch);
      } catch (error) {
        console.error("Ошибка при получении случайных тем:", error);
      }
    },

    async createRandomGame() {
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
      const gameStore = useGameStore();

      // Устанавливаем значения полей
      newGame.set("CoincidenceTheme", gameStore.randomTopicMatch);
      newGame.set("Players", 1);

      // Устанавливаем связь с текущим пользователем
      newGame.set("GameCreator", currentUser);
      this.setClickItem(this.clickedItem);
      this.setGameTheme(this.theme);

      try {
        // Сохраняем объект
        const result = await newGame.save();
        console.log("New game created successfully");
        const gameStore = useGameStore();
        gameStore.setRandomTopicMatch(null);
        gameStore.setRandomTopicMismatch(null);

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
      const gameStore = useGameStore();
      const myGamesIds = [];
      const notmineGamesIds = [];
      gameStore.gamesData.forEach((game) => {
        myGamesIds.push(game.objectId);
      });
      gameStore.strangersData.forEach((game) => {
        notmineGamesIds.push(game.objectId);
      });
      if (
        myGamesIds.includes(this.gameId) ||
        notmineGamesIds.includes(this.gameId)
      ) {
        this.error = 1;
      } else {
        //////////////////////////////////////////////////
        this.setLoadingValue(true);
        try {
          const Game = Parse.Object.extend("Games");
          const query1 = new Parse.Query(Game);
          // Ищем объект по id
          const gameObject = await query1.get(this.gameId);
          const players = gameObject.get("Players");
          const duelValue = gameObject.get("Duel");
          if (players < 4) {
            const coincidenceTheme = gameObject.get("CoincidenceTheme");
            const mismatchTheme = gameObject.get("MismatchTheme");
            const gameStore = useGameStore();
            gameStore.setGameTheme(coincidenceTheme);
            gameStore.setGameMismatchTheme(mismatchTheme);
            gameStore.setClickItem("3");
            gameStore.setGameId(this.gameId);
            console.log("CoincidenceTheme: ", gameStore.gameTheme);
            console.log("Mismatch Theme: ", gameStore.gameMismatchTheme);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку }
          } else if (duelValue == true) {
            this.error = 4;
          } else {
            this.error = 3;
          }
        } catch {
          this.error = 2;
          console.error("Игра не найдена!:", error);
        } finally {
          console.log("this.error: ", this.error);
          console.log("duelValue: ", this.duelValue);
          this.setLoadingValue(false); // Скрываем загрузчик
        }
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
