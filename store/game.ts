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
  // const keyForRerender = ref(0);

  const gamesData = ref<any[]>([]);

  //////fetchGames
  const fetchGames = async () => {
    setLoadingValue(true);
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

          try {
            const enemyDataResults = await enemyDataQuery.find();

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

            gameJson.EnemyData = enemyDataJson;
          } catch (error) {
            console.error("Error while fetching enemy data relation:", error);
          }

          return gameJson;
        })
      );

      // games.value = gamesWithEnemyData;
      setGames(gamesWithEnemyData);
      console.log(gamesWithEnemyData);
      // console.log("Finish Games: ", results2);
    } catch (error) {
      console.error("Error while fetching games:", error);
    } finally {
      setLoadingValue(false);
    }
  };
  ///////fetchGames

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

  function setGames(getGames) {
    gamesData.value = getGames;
  }

  // function forceRerender() {
  //   keyForRerender.value += 1;
  // }

  // Game

  const selectedGame = ref<any>(null);
  const gameVisible = ref(false);
  const relatedEnemies = ref<any[]>([]);
  const enemiesData = ref<any[]>([]);
  const tooltipText = ref<string | null>("Нажмите, чтобы копировать ID игры");

  async function openGame(game: any) {
    selectedGame.value = game;
    gameVisible.value = true;
    if (finishMatchGameArray.value.includes(game.objectId)) {
      finishMatchGame.value = true;
    } else {
      finishMatchGame.value = false;
    }
    console.log("Selected Game: ", selectedGame.value.objectId);
  }

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

  const addFinishMatchGame = (gameId) => {
    finishMatchGameArray.value.push(gameId);
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

    // Складываем значения для каждого ключа
    const resultObj = {};
    allKeys.forEach((key) => {
      resultObj[key] = (obj1[key] || 0) + (obj2[key] || 0);
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

  return {
    fetchGames,
    clickItem,
    setClickItem,
    start,
    gameTheme,
    setGameTheme,
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
    // keyForRerender,
    // forceRerender,
  };
});
