import { defineStore } from "pinia";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

import { useSessionStore } from "./session";

export const useGameStore = defineStore("gameStore", () => {
  const sessionStore = useSessionStore();
  const { username, userId } = storeToRefs(sessionStore);

  const loading = ref(false);
  const clickItem = ref<string | null>(null);
  const start = ref(false);
  const gameTheme = ref<string | null>(null);
  const gameMismatchTheme = ref<string | null>(null);
  const gameId = ref<string | null>(null);
  const gamesData = ref<Parse.Object[]>([]);
  const strangersData = ref<Parse.Object[]>([]);
  const enemyGame = ref(false);
  const myDataInEnemyGame = ref<any[]>([]);
  const remainingEnemyData = ref<any[]>([]);
  const rules = ref(false);
  const selectedGame = ref<any>(null);
  const gameVisible = ref(false);
  const confirmation = ref(false);
  const scoreboardWindow = ref(false);
  const confirmationArray = ref<any[]>([]);
  const relatedEnemies = ref<any[]>([]);
  const enemiesData = ref<any[]>([]);
  const tooltipText = ref<string | null>("Нажмите, чтобы копировать ID игры");
  const duel = ref(false);
  const winner = ref<number | null>(null);
  const randomTopicMatch = ref<string | null>(null);
  const randomTopicMismatch = ref<string | null>(null);
  const maxPlayers = ref(false);
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
  const gameCreatorName = ref<string | null>(null);
  const gameCreatorAvatar = ref<string | null>(null);
  const gameCreatorId = ref<string | null>(null);
  const headerHeight = ref(0);

  // Функция для сравнения старых и новых данных своих игр
  const isDataChanged = (newData) => {
    // Преобразуем в строку для простого сравнения (можно улучшить логику)
    return JSON.stringify(newData) !== JSON.stringify(gamesData.value);
  };

  // Функция для сравнения старых и новых данных чужих игр
  const isDataStrangersChanged = (newData) => {
    // Преобразуем в строку для простого сравнения (можно улучшить логику)
    return JSON.stringify(newData) !== JSON.stringify(strangersData.value);
  };

  const createGame = async () => {
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
    newGame.set("Players", 1);

    try {
      // Сохраняем объект
      const result = await newGame.save();
      console.log("New game created successfully");

      // console.log("Game ID saved to localStorage:", result.get("GameCreator"));
      setGameTheme(null);
      setGameMismatchTheme(null);
      setRandomTopicMatch(null);
      setRandomTopicMismatch(null);
    } catch (error) {
      console.error("Error while creating new game:", error);
    } finally {
      await fetchGames();
    }
  };

  const fetchGames = async () => {
    const currentUser = Parse.User.current();

    if (!currentUser) {
      console.error("No user is currently logged in");
      return;
    }

    const Game = Parse.Object.extend("Games");
    const query1 = new Parse.Query(Game);

    // Добавляем условие, чтобы получать только игры текущего пользователя
    query1.equalTo("GameCreator", currentUser);

    try {
      const results1 = await query1.find();

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
        setGames(gamesWithEnemyData);
      }
      // console.log(gamesWithEnemyData);
    } catch (error) {
      console.error("Error while fetching games:", error);
    } finally {
    }
  };

  // Слияние данных своих и чужих игр
  async function mergeGameData(array1, array2) {
    // Добавляем все объекты из array2 в array1
    array2.forEach((game) => {
      array1.push(game);
    });
    array1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // console.log(array1);
  }

  // Получение данных чужих игр
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
        setStrangersGames(gamesWithEnemyData);
      }
      // console.log(gamesWithEnemyData);
    } catch (error) {
      console.error("Error fetching games by enemy:", error);
    }
  }

  //Функция определение выбора кнопки меню (создать игру, присоединиться)
  function setClickItem(clickedItem) {
    clickItem.value = clickedItem;
    start.value = true;
    // console.log("setClickItem!!!", clickItem.value);
  }

  //Функция установления Id присоединённой игры
  function setGameId(id) {
    gameId.value = id;
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

  //Функция передачи данных в хранилище
  function setGames(getGames) {
    gamesData.value = getGames;
  }

  //Функция передачи данных в хранилище (чужие игры)
  function setStrangersGames(strangersGames) {
    strangersData.value = strangersGames;
  }

  //Функция установления случайной темы игры (совпадение)
  function setRandomTopicMatch(randomTopic) {
    randomTopicMatch.value = randomTopic;
  }

  //Функция установления случайной темы игры (несовпадение)
  function setRandomTopicMismatch(randomTopic) {
    randomTopicMismatch.value = randomTopic;
  }

  //Функция режима дуэли
  function duelMenu(duelValue, game: any) {
    selectedGame.value = game;
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
    // console.log(
    //   "selectedGame.value.WinnerData.length: ",
    //   selectedGame.value.WinnerData.length
    // );
    if (selectedGame.value.WinnerData.length > 0) {
      const exists = selectedGame.value.WinnerData.some(
        (g) => g.objectId === userId.value
      );
      if (exists == true) {
        winner.value = 1;
      } else {
        winner.value = 2;
      }

      // selectedGame.value.WinnerData.forEach((element) => {
      //   if (element.objectId.includes(userId.value)) {
      //     winner.value = 1;
      //   } else {
      //     winner.value = 2;
      //   }
      // });
    } else {
      winner.value = null;
    }
    scoreboardWindow.value = true;
    // console.log("Winners: ", selectedGame.value.WinnerData);
    // console.log("winner: ", winner.value);
    // console.log("Game Creator: ", selectedGame.value.GameCreator);
    // console.log("User ID: ", userId.value);
    if (selectedGame.value.GameCreator.objectId === userId.value) {
      enemyGame.value = false;
      // selectedGame.value.EnemyData.forEach((element) => {
      //   console.log(element.Enemy.objectId);
      // });
    } else {
      enemyGame.value = true;
      findGameCreatorData(selectedGame.value.GameCreator.objectId);
      selectedGame.value.EnemyData.forEach((item: any) => {
        // Проверяем, совпадает ли objectId у Enemy
        if (item.Enemy.objectId === userId.value) {
          enemyDataGame.value.push(item); // Если да, добавляем в enemyDataGame
          myDataInEnemyGame.value = enemyDataGame.value;
        } else {
          remainingData.value.push(item);
          remainingEnemyData.value = remainingData.value;
        }
      });
      // console.log(enemyDataGame.value);
      // console.log("Enemy Game: ", enemyGame.value);
    }
  }

  async function findGameCreatorData(gameCreatorId) {
    const query = new Parse.Query("_User");
    query.equalTo("objectId", gameCreatorId);

    try {
      const user = await query.first(); // Получаем первого совпавшего пользователя

      if (user) {
        // Извлекаем данные пользователя
        const username = user.get("username");
        const email = user.get("email");
        const createdAt = user.get("createdAt");
        const avatar = user.get("avatar") ? user.get("avatar").url() : null;
        gameCreatorName.value = username;
        gameCreatorAvatar.value = avatar;
        console.log(gameCreatorAvatar);
      } else {
        console.log("Пользователь не найден");
      }
    } catch (error) {
      console.error("Ошибка при поиске пользователя:", error);
    }
  }

  //Функция открытия окна выбора режимов игры
  async function confirmationWindow(game: any) {
    selectedGame.value = game;
    confirmation.value = true;
  }

  //Функция закрытия окна выбора режимов игры
  async function confirmationWindowClose() {
    confirmation.value = false;
  }

  //Функция копирования ID игры
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
  };

  // const getAllGames = async () => {
  //   try {
  //     const currentUser = Parse.User.current();

  //     if (!currentUser) {
  //       console.error("No user is currently logged in");
  //       return;
  //     }

  //     const Game = Parse.Object.extend("Games");
  //     const query1 = new Parse.Query(Game);

  //     // Добавляем условие, чтобы получать только игры текущего пользователя
  //     query1.equalTo("GameCreator", currentUser);

  //     // Выполняем запрос
  //     const results1 = await query1.find();
  //     // console.log("Results 1: ", results1);
  //   } catch (error) {
  //     console.error("Error fetching games by enemy:", error);
  //   }
  // };

  //Функция закрытия окна игры
  const closeGame = () => {
    resetMatches();
    gameVisible.value = false;
    selectedMatchIndex.value = null;
  };

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
  }

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
    // resetMatches,
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
    // getAllGames,
    getGamesByEnemy,
    mergeGameData,
    enemyGame,
    myDataInEnemyGame,
    remainingEnemyData,
    rules,
    maxPlayers,
    gameCreatorName,
    gameCreatorAvatar,
    gameCreatorId,
    headerHeight
    // keyForRerender,
    // forceRerender,
  };
});
