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
        <!-- <v-btn @click="dialog = true" color="primary">
          Присоединиться к игре
        </v-btn> -->

        <v-btn @click="handleItemClick(3)" color="primary">
          Присоединиться к игре
        </v-btn>

        <v-dialog
          v-if="join"
          v-model="join"
          width="auto"
          @click:outside="(gameId = null), (error = 0)"
        >
          <v-card width="400">
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
          </v-card>
        </v-dialog>

        <v-dialog
          v-if="clickedItem == 1"
          v-model="dialog"
          width="auto"
          @click:outside="theme = null"
        >
          <v-card width="400">
            <v-text-field
              v-model="theme"
              hide-details="auto"
              label="Введите тему (совпадение)"
            ></v-text-field>
            <template v-slot:actions>
              <v-btn
                class="ms-auto"
                text="Ok"
                @click="(dialog = false), saveDataInStorage()"
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
    error: 0,
    join: false,
  }),
  computed: {
    // Используем mapState для получения состояния из хранилища
    ...mapState(
      useSessionStore,
      ["username", "email", "userId", "avatarProfile", "avatar"],
      useGameStore,
      [
        "clickItem",
        "gameTheme",
        "loading",
        "randomTopicMatch",
        "gameTheme",
        "gameMismatchTheme",
        "randomTopicMismatch",
      ]
    ),
  },
  //   handleItemClick(value) {
  //     this.clickedItem = value;
  //     //   this.setClickItem(this.clickedItem);
  //     if (this.clickedItem == 1) {
  //       this.dialog = true;
  //     }
  //     console.log("Clicked item value:", this.clickItem);
  //   },
  // },
  //   mounted() {
  //     this.fetchData();
  //   },
  methods: {
    handleItemClick(value) {
      this.clickedItem = value;
      //   this.setClickItem(this.clickedItem);
      if (this.clickedItem == 1) {
        this.dialog = true;
      } else if (this.clickedItem == 2) {
        // const gameStore = useGameStore();
        this.getRandomTopic();
        this.setClickItem(value);
        // this.createRandomGame();
        // console.log(gameStore.randomTopicMatch);
        this.dialog = true;
      } else {
        this.join = true;
      }
      // console.log("Clicked item value:", this.clickItem);
    },

    setClickItem(clickedItem) {
      const gameStore = useGameStore();
      gameStore.setClickItem(clickedItem); // или любое другое значение
      console.log("Click Item:", clickedItem);
      // if (clickedItem == 2) {
      //   this.getRandomTopic();
      // }
    },

    setGameTheme(theme) {
      const gameStore = useGameStore();
      gameStore.setGameTheme(theme);
    },

    setLoadingValue(loading) {
      const gameStore = useGameStore();
      gameStore.setLoadingValue(loading);
    },

    // async createGame() {
    //   this.setLoadingValue(true);
    //   // Получаем текущего пользователя
    //   const currentUser = Parse.User.current();

    //   if (!currentUser) {
    //     console.error("No user is currently logged in");
    //     return;
    //   }

    //   // Определяем новый класс (таблицу)
    //   const Game = Parse.Object.extend("Games");

    //   // Создаём новый объект этого класса
    //   const newGame = new Game();

    //   // Устанавливаем значения полей
    //   newGame.set("CoincidenceTheme", this.theme);

    //   // Устанавливаем связь с текущим пользователем
    //   newGame.set("GameCreator", currentUser);
    //   this.setClickItem(this.clickedItem);
    //   this.setGameTheme(this.theme);

    //   try {
    //     // Сохраняем объект
    //     const result = await newGame.save();
    //     // this.setClickItem(this.clickedItem);
    //     console.log("New game created successfully");

    //     // Сохранение id игры в localStorage
    //     localStorage.setItem("gameId", result.id);
    //     console.log(
    //       "Game ID saved to localStorage:",
    //       result.get("GameCreator")
    //     );
    //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
    //   } catch (error) {
    //     console.error("Error while creating new game:", error);
    //   } finally {
    //     this.setLoadingValue(false); // Скрываем загрузчик
    //   }
    // },

    async saveDataInStorage() {
      this.setLoadingValue(true);
      // Получаем текущего пользователя
      // const currentUser = Parse.User.current();

      // if (!currentUser) {
      //   console.error("No user is currently logged in");
      //   return;
      // }

      // Определяем новый класс (таблицу)
      // const Game = Parse.Object.extend("Games");

      // // Создаём новый объект этого класса
      // const newGame = new Game();

      // // Устанавливаем значения полей
      // newGame.set("CoincidenceTheme", this.theme);

      // Устанавливаем связь с текущим пользователем
      // newGame.set("GameCreator", currentUser);
      this.setClickItem(this.clickedItem);
      this.setGameTheme(this.theme);

      try {
        // Сохраняем объект
        // const result = await newGame.save();
        // this.setClickItem(this.clickedItem);
        // console.log("New game created successfully");

        // Сохранение id игры в localStorage
        // localStorage.setItem("gameId", result.id);
        // console.log(
        // "Game ID saved to localStorage:",
        // result.get("GameCreator")
        // );
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

    async joinTheGameRezerv() {
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

    async joinTheGame() {
      const gameStore = useGameStore();
      // const gamesIds = gameStore.gamesData.forEach((game) => {
      //   console.log(game.objectId);
      // });
      const myGamesIds = [];
      const notmineGamesIds = [];
      gameStore.gamesData.forEach((game) => {
        myGamesIds.push(game.objectId);
      });
      gameStore.strangersData.forEach((game) => {
        notmineGamesIds.push(game.objectId);
      });
      // console.log(gamesIds);
      // console.log(this.game)
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
          // if (gameObject) {
          const coincidenceTheme = gameObject.get("CoincidenceTheme");
          const mismatchTheme = gameObject.get("MismatchTheme");
          const gameStore = useGameStore();
          gameStore.setGameTheme(coincidenceTheme);
          gameStore.setGameMismatchTheme(mismatchTheme);
          gameStore.setClickItem("3");
          gameStore.setGameId(this.gameId);
          console.log("CoincidenceTheme: ", gameStore.gameTheme);
          console.log("Mismatch Theme: ", gameStore.gameMismatchTheme);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
          // } else {
          // this.error = 2;
          // }
          // Определяем новый класс (таблицу)
          // const Enemy = Parse.Object.extend("EnemyData");
          // Создаём новый объект этого класса
          // const newEnemy = new Enemy();
          // Получаем имя пользователя
        } catch {
          this.error = 2;
          console.error("Игра не найдена!:", error);
        } finally {
          this.setLoadingValue(false); // Скрываем загрузчик
        }
        ////////////////////////////////////

        // const Game = Parse.Object.extend("Games");
        // const query1 = new Parse.Query(Game);
        // //   // Ищем объект по id
        // const gameObject = await query1.get(this.gameId);
        // if (gameObject) {
        //   console.log(gameObject);
        // } else {
        //   console.log("Игра не найдена! ");
        // }
        // this.dialog = false;
        // }

        // this.setLoadingValue(true);
        // try {
        //   const Game = Parse.Object.extend("Games");
        //   const query1 = new Parse.Query(Game);
        //   // Ищем объект по id
        //   const gameObject = await query1.get(this.gameId);

        //   // Определяем новый класс (таблицу)
        //   // const Enemy = Parse.Object.extend("EnemyData");
        //   // Создаём новый объект этого класса
        //   // const newEnemy = new Enemy();
        //   // Получаем имя пользователя
        //   const coincidenceTheme = gameObject.get("CoincidenceTheme");
        //   const mismatchTheme = gameObject.get("MismatchTheme");
        //   const gameStore = useGameStore();
        //   gameStore.setGameTheme(coincidenceTheme);
        //   gameStore.setGameMismatchTheme(mismatchTheme);
        //   gameStore.setClickItem("3");
        //   console.log("CoincidenceTheme: ", gameStore.gameTheme);
        //   console.log("Mismatch Theme: ", gameStore.gameMismatchTheme);
        //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
        // } catch {
        //   console.error("Error while creating new game:", error);
        // } finally {
        //   this.setLoadingValue(false); // Скрываем загрузчик
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
