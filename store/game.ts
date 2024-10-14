import { defineStore } from "pinia";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// import { storeToRefs } from "pinia";

// import { useSessionStore } from "../store/session";
// import { useSessionStore } from "../store/session";

import { useSessionStore } from "./session";
// const sessionStore = useSessionStore();
// const { username } = storeToRefs(sessionStore);

export const useGameStore = defineStore("gameStore", () => {
  const sessionStore = useSessionStore();
  const { username, userId } = storeToRefs(sessionStore);

  const loading = ref(false);
  const clickItem = ref<string | null>(null);
  const start = ref(false);
  const gameTheme = ref<string | null>(null);
  const gameMismatchTheme = ref<string | null>(null);
  const gameId = ref<string | null>(null);
  // const keyForRerender = ref(0);

  // const gamesData = ref<any[]>([]);
  const gamesData = ref<Parse.Object[]>([]);
  const strangersData = ref<Parse.Object[]>([]);
  const enemyGame = ref(false);
  const myDataInEnemyGame = ref<any[]>([]);
  const remainingEnemyData = ref<any[]>([]);
  // const gamesData2 = ref<Parse.Object[]>([]);

  //////fetchGames
  // const fetchGames = async () => {
  //   setLoadingValue(true);
  //   const currentUser = Parse.User.current();

  //   if (!currentUser) {
  //     console.error("No user is currently logged in");
  //     return;
  //   }

  //   const Game = Parse.Object.extend("Games");
  //   const query1 = new Parse.Query(Game);

  //   // Добавляем условие, чтобы получать только игры текущего пользователя
  //   query1.equalTo("GameCreator", currentUser);

  //   try {
  //     const results1 = await query1.find();

  //     // Проходим по всем найденным и незавершённым играм
  //     const gamesWithEnemyData = await Promise.all(
  //       results1.map(async (game) => {
  //         const gameJson = game.toJSON();

  //         // Получаем данные из отношения EnemyData
  //         const enemyDataRelation = game.relation("EnemyData");
  //         const enemyDataQuery = enemyDataRelation.query();

  //         try {
  //           const enemyDataResults = await enemyDataQuery.find();

  //           // Проходим по всем найденным записям в EnemyData
  //           const enemyDataJson = await Promise.all(
  //             enemyDataResults.map(async (enemyData) => {
  //               const enemyDataObj = enemyData.toJSON();

  //               // Получаем данные из указателя Enemy
  //               const enemyPointer = enemyData.get("Enemy");
  //               if (enemyPointer) {
  //                 const enemyQuery = new Parse.Query(Parse.User);
  //                 try {
  //                   const enemy = azzwait enemyQuery.get(enemyPointer.id);
  //                   enemyDataObj.Enemy = enemy.toJSON();
  //                 } catch (error) {
  //                   console.error("Error while fetching enemy data:", error);
  //                 }
  //               }

  //               return enemyDataObj;
  //             })
  //           );

  //           gameJson.EnemyData = enemyDataJson;
  //         } catch (error) {
  //     blKVwVKH8E      console.error("Error while fetching enemy data relation:", error);
  //         }

  //         return gameJson;
  //       })
  //     );

  //     setGames(gamesWithEnemyData);
  //     console.log(gamesWithEnemyData);
  //   } catch (error) {
  //     console.error("Error while fetching games:", error);
  //   } finally {
  //     setLoadingValue(false);
  //   }
  // };
  ///////fetchGames

  // Функция для сравнения старых и новых данных
  const isDataChanged = (newData) => {
    // Преобразуем в строку для простого сравнения (можно улучшить логику)
    return JSON.stringify(newData) !== JSON.stringify(gamesData.value);
  };

  // Функция для сравнения старых и новых данных
  const isDataStrangersChanged = (newData) => {
    // Преобразуем в строку для простого сравнения (можно улучшить логику)
    return JSON.stringify(newData) !== JSON.stringify(strangersData.value);
  };

  const createGame = async () => {
    // setLoadingValue(true);
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
    if (gameTheme.value) {
      newGame.set("CoincidenceTheme", gameTheme.value);
    } else {
      newGame.set("CoincidenceTheme", randomTopicMatch.value);
    }

    // Устанавливаем связь с текущим пользователем
    newGame.set("GameCreator", currentUser);

    if (gameMismatchTheme.value) {
      newGame.set("MismatchTheme", gameMismatchTheme.value);
    } else {
      newGame.set("MismatchTheme", randomTopicMismatch.value);
    }

    newGame.set("MatchValues", matchValues.value);
    newGame.set("MissmatchValues", mismatchValues.value);

    try {
      // Сохраняем объект
      const result = await newGame.save();
      // this.setClickItem(this.clickedItem);
      console.log("New game created successfully");

      // Сохранение id игры в localStorage
      // localStorage.setItem("gameId", result.id);
      console.log("Game ID saved to localStorage:", result.get("GameCreator"));
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитируем задержку
    } catch (error) {
      console.error("Error while creating new game:", error);
    } finally {
      // setLoadingValue(false); // Скрываем загрузчик
      fetchGames();
    }
  };

  //////////fetchGames2
  const fetchGames = async () => {
    // setLoadingValue(true);
    const currentUser = Parse.User.current();

    if (!currentUser) {
      console.error("No user is currently logged in");
      return;
    }

    const Game = Parse.Object.extend("Games");
    const query1 = new Parse.Query(Game);
    // const query2 = new Parse.Query(Game);

    // Добавляем условие, чтобы получать только игры текущего пользователя
    query1.equalTo("GameCreator", currentUser);
    // Добавляем условие, чтобы получать только завершенные игры
    // query1.equalTo("Finish", false);
    // query2.equalTo("GameCreator", currentUser);
    // query2.equalTo("Finish", true);

    try {
      const results1 = await query1.find();
      // const results2 = await query2.find();

      // Проходим по всем найденным и незавершённым играм
      const gamesWithEnemyData = await Promise.all(
        results1.map(async (game) => {
          const gameJson = game.toJSON();

          // Получаем данные из отношения EnemyData
          const enemyDataRelation = game.relation("EnemyData");
          const enemyDataQuery = enemyDataRelation.query();
          // Получаем данные из отношения Winners
          const winnerDataRelation = game.relation("Winners");
          const winnerDataQuery = winnerDataRelation.query();

          try {
            const enemyDataResults = await enemyDataQuery.find();
            const winnerDataResults = await winnerDataQuery.find();

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

            // Проходим по всем найденным записям в WinnersData
            const winnerDataJson = await Promise.all(
              winnerDataResults.map(async (winnerData) => {
                const winnerDataObj = winnerData.toJSON();

                return winnerDataObj;
              })
            );

            // catch (error) {
            //   console.error("Error while fetching winner data relation:", error);
            // }

            gameJson.EnemyData = enemyDataJson;
            gameJson.WinnerData = winnerDataJson;
          } catch (error) {
            console.error("Error while fetching enemy data relation:", error);
          }

          return gameJson;
        })
      );
      const newData = results1.map((result) => result.toJSON());
      // Сравнение с текущими данными
      if (isDataChanged(newData)) {
        // setLoadingValue(true);
        setGames(gamesWithEnemyData);
      }
      // setGames(gamesWithEnemyData);
      console.log(gamesWithEnemyData);
      // console.log("Finish Games: ", results2);
    } catch (error) {
      console.error("Error while fetching games:", error);
    } finally {
      // setLoadingValue(false);
    }
  };
  //////////fetchGames2

  async function mergeGameData(array1, array2) {
    // Добавляем все объекты из array2 в array1
    array2.forEach((game) => {
      array1.push(game);
    });

    // Возвращаем обновленный первый массив
    // return array1;
    console.log(array1);
  }

  async function getGamesByEnemy(enemyId: any) {
    try {
      // Создаём указатель на пользователя (Enemy)
      const EnemyPointer = new Parse.User();
      EnemyPointer.id = enemyId;

      // Создаём запрос на Games
      const query = new Parse.Query("Games");

      // Создаём подзапрос на Relation (EnemyData), чтобы найти записи с нужным Enemy
      const enemyDataQuery = new Parse.Query("EnemyData");
      enemyDataQuery.equalTo("Enemy", EnemyPointer);

      // Добавляем фильтр в основной запрос
      query.matchesQuery("EnemyData", enemyDataQuery);

      // Выполняем запрос
      const games = await query.find();
      // console.log("Games with the specified enemy:", games);

      // Проходим по всем найденным и незавершённым играм
      const gamesWithEnemyData = await Promise.all(
        games.map(async (game) => {
          const gameJson = game.toJSON();

          // Получаем данные из отношения EnemyData
          const enemyDataRelation = game.relation("EnemyData");
          const enemyDataQuery = enemyDataRelation.query();
          // Получаем данные из отношения Winners
          const winnerDataRelation = game.relation("Winners");
          const winnerDataQuery = winnerDataRelation.query();

          try {
            const enemyDataResults = await enemyDataQuery.find();
            const winnerDataResults = await winnerDataQuery.find();

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

            // Проходим по всем найденным записям в WinnersData
            const winnerDataJson = await Promise.all(
              winnerDataResults.map(async (winnerData) => {
                const winnerDataObj = winnerData.toJSON();

                return winnerDataObj;
              })
            );

            // catch (error) {
            //   console.error("Error while fetching winner data relation:", error);
            // }

            gameJson.EnemyData = enemyDataJson;
            gameJson.WinnerData = winnerDataJson;
          } catch (error) {
            console.error("Error while fetching enemy data relation:", error);
          }

          return gameJson;
        })
      );
      const newData = games.map((result) => result.toJSON());
      // Сравнение с текущими данными
      if (isDataStrangersChanged(newData)) {
        // setLoadingValue(true);
        setStrangersGames(gamesWithEnemyData);
      }
      // setGames(gamesWithEnemyData);
      console.log(gamesWithEnemyData);
      // console.log("Finish Games: ", results2);

      // return games;
    } catch (error) {
      console.error("Error fetching games by enemy:", error);
    }
  }

  //Функция определение выбора кнопки меню (создать игру, присоединиться)
  function setClickItem(clickedItem) {
    clickItem.value = clickedItem;
    start.value = true;
    console.log("setClickItem!!!", clickItem.value);
  }

  //Функция установления Id присоединённой игры
  function setGameId(id) {
    gameId.value = id;
    // console.log("Game Match Theme: ", gameTheme.value);
  }

  //Функция установления темы игры (совпадение)
  function setGameTheme(theme) {
    gameTheme.value = theme;
    console.log("Game Match Theme: ", gameTheme.value);
  }

  //Функция установления темы игры (несовпадение)
  function setGameMismatchTheme(theme) {
    gameMismatchTheme.value = theme;
    console.log("Game Mismatch Theme: ", gameMismatchTheme.value);
  }

  //Функция старта игры
  function setStartValue(newStartValue) {
    start.value = newStartValue;
  }

  //Функция экрана загрузки
  function setLoadingValue(newLoadingValue) {
    loading.value = newLoadingValue;
  }

  //Функция передачи данных с сервера в хранилище
  function setGames(getGames) {
    gamesData.value = getGames;
  }

  function setStrangersGames(strangersGames) {
    strangersData.value = strangersGames;
  }

  // function forceRerender() {
  //   keyForRerender.value += 1;
  // }

  // Game

  const selectedGame = ref<any>(null);
  const gameVisible = ref(false);
  const confirmation = ref(false);
  const scoreboardWindow = ref(false);
  const confirmationArray = ref<any[]>([]);
  const relatedEnemies = ref<any[]>([]);
  const enemiesData = ref<any[]>([]);
  const tooltipText = ref<string | null>("Нажмите, чтобы копировать ID игры");
  const duel = ref(false);
  const winner = ref(false);
  const randomTopicMatch = ref<string | null>(null);
  const randomTopicMismatch = ref<string | null>(null);

  //Функция установления случайной темы игры (совпадение)
  function setRandomTopicMatch(randomTopic) {
    randomTopicMatch.value = randomTopic;
  }

  //Функция установления случайной темы игры (несовпадение)
  function setRandomTopicMismatch(randomTopic) {
    randomTopicMismatch.value = randomTopic;
  }

  //Функция режима дуэли
  function duelMenu(duelValue) {
    confirmation.value = false;
    duel.value = duelValue;
  }

  //Функция открытия игры
  async function openGame(game: any) {
    selectedGame.value = game;
    gameVisible.value = true;
    confirmation.value = false;
    excludeСonfirmation(game.objectId);
    if (finishMatchGameArray.value.includes(game.objectId)) {
      finishMatchGame.value = true;
    } else {
      finishMatchGame.value = false;
    }
    console.log("Selected Game: ", selectedGame.value.objectId);
  }

  //Функция открытия окна результатов
  async function openScoreboard(game: any) {
    // Данные чужой игры
    const enemyDataGame = ref<any[]>([]);
    const remainingData = ref<any[]>([]);
    selectedGame.value = game;
    if (selectedGame.value.WinnerData.includes(userId.value)) {
      winner.value = true;
    } else {
      winner.value = false;
    }
    scoreboardWindow.value = true;
    // console.log("Selected Game: ", selectedGame.value.objectId);
    // console.log("Username: ", username.value);
    // console.log("Winners: ", selectedGame.value.WinnerData);
    console.log("winner: ", winner.value);
    console.log("Game Creator: ", selectedGame.value.GameCreator);
    console.log("User ID: ", userId.value);
    // console.log(selectedGame.value.objectId);
    if (selectedGame.value.GameCreator.objectId === userId.value) {
      enemyGame.value = false;
      selectedGame.value.EnemyData.forEach((element) => {
        console.log(element.Enemy.objectId);
      });
      // console.log(selectedGame.value.EnemyData);
    } else {
      enemyGame.value = true;
      // console.log(selectedGame.value.EnemyData.Enemy);
      // Проходим по каждому объекту массива
      selectedGame.value.EnemyData.forEach((item: any) => {
        // Проверяем, совпадает ли objectId у Enemy
        if (item.Enemy.objectId === userId.value) {
          enemyDataGame.value.push(item); // Если да, добавляем в enemyDataGame
          myDataInEnemyGame.value = enemyDataGame.value;
        } else {
          remainingData.value.push(item);
          remainingEnemyData.value = remainingData.value;
        }
        // remainingEnemyData.value = remainingData
      });
      console.log(enemyDataGame.value);
      console.log("Enemy Game: ", enemyGame.value);
    }
  }

  //Функция открытия окна выбора режимов игры
  async function confirmationWindow(game: any) {
    selectedGame.value = game;
    confirmation.value = true;
  }

  //Функция закрытия окна выбора режимов игры
  async function confirmationWindowClose() {
    // selectedGame.value = game;
    confirmation.value = false;
  }

  //Функция корирования ID игры
  async function copyGameId(game: any) {
    selectedGame.value = game;
    try {
      const text = selectedGame.value.objectId;
      await navigator.clipboard.writeText(text);
      tooltipText.value = "ID скопирован";
      setTimeout(
        () => (tooltipText.value = "Нажмите, чтобы копировать ID игры"),
        2000
      );
    } catch (err) {
      console.error("Ошибка при копировании текста: ", err);
    }
  }

  //////////fetchGames2
  const getAllGames = async () => {
    // setLoadingValue(true);
    try {
      const currentUser = Parse.User.current();

      if (!currentUser) {
        console.error("No user is currently logged in");
        return;
      }

      const Game = Parse.Object.extend("Games");
      const query1 = new Parse.Query(Game);
      // const query2 = new Parse.Query(Game);

      // Добавляем условие, чтобы получать только игры текущего пользователя
      query1.equalTo("GameCreator", currentUser);
      // Добавляем условие, чтобы получать только завершенные игры
      // query1.equalTo("Finish", false);
      // query2.equalTo("GameCreator", currentUser);
      // query2.equalTo("Finish", true);

      // Создаём указатель на пользователя (Enemy)
      // const EnemyPointer = new Parse.User();
      // EnemyPointer.id = currentUser.Id;

      // Создаём запрос на Games
      // const query2 = new Parse.Query("Games");

      // Создаём подзапрос на Relation (EnemyData), чтобы найти записи с нужным Enemy
      // const enemyDataQuery = new Parse.Query("EnemyData");
      // enemyDataQuery.equalTo("Enemy", EnemyPointer);

      // Добавляем фильтр в основной запрос
      // query2.matchesQuery("EnemyData", enemyDataQuery);

      // Выполняем запрос

      const results1 = await query1.find();
      // const results2 = await query2.find();
      console.log("Results 1: ", results1);
      // console.log(currentUser.id);
      // console.log("Results 2: ", results2);
    } catch (error) {
      console.error("Error fetching games by enemy:", error);
    }
  };
  //////////fetchGames2

  // async function openGame(game: any) {
  //   setLoadingValue(true);

  //   try {
  //     // Получение основного объекта игры
  //     const Game = Parse.Object.extend("Games");
  //     const query = new Parse.Query(Game);
  //     // query.include("GameCreator");
  //     const result = await query.get(game.objectId);
  //     selectedGame.value = result.toJSON();

  //     // Загрузка связанных объектов через Relation
  //     const relation = result.relation("EnemyData");
  //     const enemyQuery = relation.query();
  //     const enemies = await enemyQuery.find();
  //     relatedEnemies.value = enemies.map((enemy) => enemy.toJSON());
  //     console.log(relatedEnemies.value);

  //     const users = [];
  //     for (const item of relatedEnemies.value) {
  //       if (item.Enemy && item.Enemy.objectId) {
  //         const enemy = new Parse.Query(Parse.User);
  //         // const user = await query.get(objectId);
  //         const user = await enemy.get(item.Enemy.objectId);
  //         if (user) {
  //           users.push(user);
  //           enemiesData.value = users;
  //         }
  //       }
  //     }
  //     console.log("Users: ", users);
  //   } catch (error) {
  //     console.error("Error while fetching game details:", error);
  //   } finally {
  //     setLoadingValue(false);
  //     gameVisible.value = true;
  //   }
  // }

  //Функция закрытия окна игры
  const closeGame = () => {
    resetMatches();
    gameVisible.value = false;
    selectedMatchIndex.value = null;
    // fetchGames();
    // finishMatchGame.value = false;
  };

  // Matches array
  const matches = ref<Array<Record<string, string | null>>>([]);
  const mismatches = ref<Array<Record<string, string | null>>>([]);
  const selectedMatchIndex = ref(null); // Индекс выбранной строки
  const selectedMismatchIndex = ref(null); // Индекс выбранной строки
  const matchScore = ref<any[]>([]);
  const mismatchScore = ref<any[]>([]);
  const finishMatchGame = ref(false);
  const finishMatchGameArray = ref<any[]>([]);
  const score = ref<any[]>([]);
  const matchValues = ref<any[]>([]);
  const mismatchValues = ref<any[]>([]);

  function setMatchValues(newMatchValues) {
    matchValues.value = newMatchValues;
  }

  function setMismatchValues(newMismatchValues) {
    mismatchValues.value = newMismatchValues;
  }

  const addFinishMatchGame = (gameId) => {
    finishMatchGameArray.value.push(gameId);
  };

  const excludeСonfirmation = (gameId) => {
    confirmationArray.value.push(gameId);
  };

  const setFinishMatchGame = (value) => {
    finishMatchGame.value = value;
  };

  const setMatchScore = (score) => {
    matchScore.value = score;
  };

  const setMismatchScore = (score) => {
    mismatchScore.value = score;
  };

  const setScore = (sc) => {
    score.value = sc;
  };

  function addMatch(match: Record<string, string | null>) {
    matches.value.push(match);
  }

  function addMismatch(mismatch: Record<string, string | null>) {
    mismatches.value.push(mismatch);
  }

  // Функция сброса массива matches
  const resetMatches = () => {
    matches.value = [];
  };

  // const selectMatch = (index) => {
  //   selectedMatchIndex.value = index;
  // };

  // const selectMismatch = (index) => {
  //   selectedMismatchIndex.value = index;
  // };

  const removeSelectedMatch = () => {
    if (selectedMatchIndex.value !== null) {
      matches.value.splice(selectedMatchIndex.value, 1);
      selectedMatchIndex.value = null; // Сбрасываем выбор после удаления
    }
  };

  const removeSelectedMismatch = () => {
    if (selectedMismatchIndex.value !== null) {
      mismatches.value.splice(selectedMismatchIndex.value, 1);
      selectedMismatchIndex.value = null; // Сбрасываем выбор после удаления
    }
  };

  function scoring(arr1, arr2) {
    // Функция для преобразования массива объектов в один объект
    const arrayToObject = (arr) => {
      return arr.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        acc[key] = obj[key];
        return acc;
      }, {});
    };

    // Преобразуем оба массива в объекты
    const obj1 = arrayToObject(arr1);
    const obj2 = arrayToObject(arr2);

    // Объединяем ключи из обоих объектов
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    // Вычитаем значения для каждого ключа
    const resultObj = {};
    allKeys.forEach((key) => {
      resultObj[key] = (obj1[key] || 0) - (obj2[key] || 0);
    });

    // Преобразуем объект обратно в массив объектов
    const resultArray = Object.keys(resultObj).map((key) => ({
      [key]: resultObj[key],
    }));
    console.log("Scoring: ", resultArray);
    const transformedArray = resultArray.map((item) => {
      const key = Object.keys(item)[0];
      return [key, item[key]];
    });
    setScore(transformedArray);

    // return resultArray;
  }

  // Инициализация подписки при монтировании компонента
  // onMounted(setupLiveQuery);

  return {
    fetchGames,
    clickItem,
    setClickItem,
    start,
    gameTheme,
    setGameTheme,
    gameMismatchTheme,
    setGameMismatchTheme,
    setStartValue,
    loading,
    setLoadingValue,
    selectedGame,
    gameVisible,
    openGame,
    closeGame,
    relatedEnemies,
    enemiesData,
    gamesData,
    strangersData,
    setGames,
    matches,
    addMatch,
    resetMatches,
    selectedMatchIndex,
    selectedMismatchIndex,
    // selectMatch,
    // selectMismatch,
    removeSelectedMatch,
    removeSelectedMismatch,
    matchScore,
    setMatchScore,
    mismatches,
    addMismatch,
    mismatchScore,
    setMismatchScore,
    finishMatchGame,
    setFinishMatchGame,
    finishMatchGameArray,
    addFinishMatchGame,
    scoring,
    score,
    setScore,
    tooltipText,
    copyGameId,
    confirmation,
    confirmationWindow,
    confirmationWindowClose,
    confirmationArray,
    excludeСonfirmation,
    duel,
    duelMenu,
    scoreboardWindow,
    winner,
    openScoreboard,
    randomTopicMatch,
    randomTopicMismatch,
    setRandomTopicMatch,
    setRandomTopicMismatch,
    setMatchValues,
    setMismatchValues,
    createGame,
    gameId,
    setGameId,
    matchValues,
    mismatchValues,
    getAllGames,
    getGamesByEnemy,
    mergeGameData,
    enemyGame,
    myDataInEnemyGame,
    remainingEnemyData,
    // keyForRerender,
    // forceRerender,
  };
});
