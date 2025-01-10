<template>
  <v-dialog
    v-model="scoreboardWindow"
    :width="sm || xs ? '100%' : '1000px'"
    :fullscreen="sm || xs"
  >
    <v-card style="text-align: center; padding: 15px">
      <v-btn
        icon="mdi-close"
        @click="scoreboardWindow = false"
        style="left: 90%; margin-block-end: 1%; scale: 100%"
      ></v-btn>
      <h1 class="animation" style="text-align: center" v-if="winner == 1">
        Вы выиграли!
      </h1>
      <h1 class="animation" style="text-align: center" v-else-if="winner == 2">
        Вы проиграли!
      </h1>
      <h1
        class="animation"
        style="text-align: center"
        v-else-if="winner == null"
      >
        Ничья!
      </h1>
      <h2 class="animation" style="text-align: center">Результаты игры</h2>
      <h3 style="text-align: center">Игра на совпадение</h3>
      <!-- <div v-if="enemyGame">Enemy Game!</div> -->
      <h3 style="text-align: center; background: silver">
        {{ selectedGame?.CoincidenceTheme }}
        <!-- {{ mobile }} -->
      </h3>
      <v-row
        no-gutters
        v-if="!enemyGame"
        :style="{ display: xs ? 'grid' : 'flex' }"
      >
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <!-- {{ avatar.url }} -->
              <v-avatar v-if="avatar?.url" size="70">
                <v-img alt="John" :src="avatar.url"></v-img>
              </v-avatar>
              <v-avatar v-else color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <strong>Мои значения</strong>
              <!-- {{ useDisplay().width }} -->
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MatchValue, index) in selectedGame.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
          <!-- <v-col
            v-for="MatchScore in selectedGame.MatchScore"
            :key="MatchScore"
          >
            <v-sheet>
              Совпадений:
              {{ MatchScore[1] }}
            </v-sheet>
          </v-col> -->
          <hr />
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ selectedGame.MatchScore[0][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr /> -->
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRate }}
          </v-chip>
          <!-- <hr v-if="sm || xs" /> -->
          <hr />
        </v-col>
        <v-col
          v-for="(Enemy, index) in selectedGame.EnemyData"
          :key="Enemy.Enemy.objectId"
          :sm="width < 900 || selectedGame.Duel ? '6' : '3'"
        >
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <!-- {{ Enemy.Enemy.avatar === undefined }} -->
              <v-avatar
                v-if="Enemy.Enemy.avatar === undefined"
                color="info"
                size="70"
              >
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="Enemy.Enemy.avatar.url"></v-img>
              </v-avatar>
              <strong>{{ Enemy.Enemy.username }}</strong>
            </v-card>
            <v-list
              v-model="Enemy.MatchValue"
              v-for="(MatchValue, index) in Enemy.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
          <hr />
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ coincidences(selectedGame.MatchScore, Enemy.Enemy.objectId) }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr v-if="xs || sm" /> -->
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRateEnemy }}
          </v-chip>
          <hr />
          <!-- <hr v-if="selectedGame.Duel" /> -->
        </v-col>
      </v-row>
      <!-- ////////////////////////////////////////////////////////////////////////// -->
      <v-row
        no-gutters
        v-else-if="enemyGame"
        :style="{ display: xs ? 'grid' : 'flex' }"
      >
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar v-if="!avatar?.url" color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="avatar?.url"></v-img>
              </v-avatar>
              <strong>Мои значения</strong>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MatchValue, index) in myDataInEnemyGame[0].MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
          <hr />
          <!-- /////////////////////////////////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MatchScore.length"
          >
            Совпадений:
            {{ coincidences(selectedGame.MatchScore, userId) }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip>
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRate }}
          </v-chip> -->
          <!-- ///////////////////////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ coincidences(selectedGame.MatchScore, userId) }}
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRateEnemy }}
          </v-chip>
          <hr />
          <!-- <hr v-if="selectedGame.Duel && (sm || xs)" /> -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-for="item in selectedGame.MatchScore"
            :key="item[0]"
          > -->
          <!-- <span v-if="item[0] === userId">Совпадений: {{ item[1] }}</span> -->
          <!-- {{ item[0] === userId ? item[1] : null }} -->
          <!-- {{ selectedGame.MatchScore[0][1] }} -->
          <!-- {{ selectedGame.MatchScore }} -->
          <!-- </v-chip> -->
          <!-- <div v-for="item in data" :key="item[0]"> -->
          <!-- Сравниваем ID -->
          <!-- <div v-if="item[0] === targetId"> -->
          <!-- ID: {{ item[0] }}, Значение: {{ item[1] }} -->
          <!-- </div> -->
        </v-col>
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar
                v-if="gameCreatorAvatar == undefined"
                color="info"
                size="70"
              >
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="gameCreatorAvatar"></v-img>
              </v-avatar>
              <!-- {{ selectedGame.GameCreator.objectId }} -->
              <strong>{{ gameCreatorName }}</strong>
            </v-card>
            <v-list
              v-for="(MatchValue, index) in selectedGame.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
          <hr v-if="!selectedGame.Duel" />
          <!-- //////////////////////////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MatchScore.length"
          >
            Совпадений:
            {{
              coincidences(
                selectedGame.MatchScore,
                selectedGame.GameCreator.objectId
              )
            }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip>
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRateEnemy }}
          </v-chip> -->
          <!-- ///////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{
              coincidences(
                selectedGame.MatchScore,
                selectedGame.GameCreator.objectId
              )
            }}
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <hr v-if="selectedGame.Duel" />
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MatchRate }}
          </v-chip>
          <hr />
        </v-col>
        <v-col
          :sm="width < 900 ? '6' : '3'"
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
          v-show="Enemy.Enemy.objectId !== userId"
        >
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar v-if="!Enemy.Enemy.avatar?.url" color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="Enemy.Enemy.avatar?.url"></v-img>
              </v-avatar>
              <!-- {{ Enemy.Enemy.avatar.url }} -->
              <strong>{{ Enemy.Enemy.username }}</strong>
              <!-- {{ Enemy.Enemy.objectId }} -->
            </v-card>
            <v-list
              v-model="Enemy.MatchValue"
              v-for="(MatchValue, index) in Enemy.MatchValues"
              :value="MatchValue"
              :key="index + MatchValue"
              >{{ MatchValue }}
            </v-list>
          </v-sheet>
          <hr />
          <!-- ///////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MatchScore.length"
          >
            Совпадений:
            {{ coincidences(selectedGame.MatchScore, Enemy.Enemy.objectId) }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip> -->
          <!-- //////////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ coincidences(selectedGame.MatchScore, Enemy.Enemy.objectId) }}
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MatchScore &&
              !selectedGame.MatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <hr />
        </v-col>
      </v-row>
      <!-- <hr v-if="selectedGame.Duel" /> -->
      <!-- <v-row v-if="selectedGame.Duel">
        <v-col>Ставка: {{ selectedGame.MatchRate }}</v-col>
        <v-col>Ставка: {{ selectedGame.MatchRateEnemy }}</v-col>
      </v-row> -->
      <!-- <hr v-if="selectedGame.Duel" /> -->
      <!-- <v-row no-gutters v-if="!enemyGame && !selectedGame.Duel">
        <v-col v-for="MatchScore in selectedGame.MatchScore" :key="MatchScore">
          <v-sheet>
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row> -->
      <v-row no-gutters v-if="selectedGame.Duel" style="display: grid">
        <v-sheet>
          Совпадений:
          {{ selectedGame.MatchScoreDuel }}
        </v-sheet>
      </v-row>
      <hr v-if="selectedGame.Duel" />
      <!-- <v-row no-gutters v-else-if="enemyGame && !selectedGame.Duel">
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="MatchScore[0] === userId"
        >
          <v-sheet v-if="MatchScore[0] === userId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="MatchScore[0] === selectedGame.GameCreator.objectId"
        >
          <v-sheet v-if="MatchScore[0] === selectedGame.GameCreator.objectId">
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MatchScore in selectedGame.MatchScore"
          :key="MatchScore[0]"
          v-show="
            MatchScore[0] !== selectedGame.GameCreator.objectId &&
            MatchScore[0] !== userId
          "
        >
          <v-sheet
            v-if="
              MatchScore[0] !== selectedGame.GameCreator.objectId &&
              MatchScore[0] !== userId
            "
          >
            Совпадений:
            {{ MatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row> -->
      <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
      <!-- <hr v-if="!sm && !xs" /> -->
      <!-- <hr /> -->
      <h3 style="text-align: center">Игра на несовпадение</h3>
      <h3 style="text-align: center; background: silver">
        {{ selectedGame?.MismatchTheme }}
      </h3>
      <v-row
        no-gutters
        v-if="!enemyGame"
        :style="{ display: xs ? 'grid' : 'flex' }"
      >
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <!-- {{ avatar.url }} -->
              <v-avatar v-if="avatar?.url" size="70">
                <v-img alt="Avatar" :src="avatar.url"></v-img>
              </v-avatar>
              <v-avatar v-else color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <strong>Мои значения</strong>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MissmatchValue, index) in selectedGame.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
          <hr />
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MismatchScore &&
              selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ selectedGame.MismatchScore[0][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr /> -->
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRate }}
          </v-chip>
          <!-- <hr v-if="sm || xs" /> -->
          <hr />
        </v-col>
        <v-col
          :sm="width < 900 || selectedGame.Duel ? '6' : '3'"
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
        >
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar v-if="!Enemy.Enemy.avatar?.url" color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="Enemy.Enemy.avatar.url"></v-img>
              </v-avatar>
              <!-- {{ Enemy.Enemy.avatar }} -->
              <strong>{{ Enemy.Enemy.username }}</strong>
            </v-card>
            <v-list
              v-model="Enemy.MissmatchValue"
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
          <hr v-if="!selectedGame.Duel" />
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MismatchScore &&
              selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ selectedGame.MismatchScore[index][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr v-if="sm || xs" /> -->
          <hr />
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRateEnemy }}
          </v-chip>
          <hr v-if="selectedGame.Duel" />
          <!-- <hr v-if="selectedGame.Duel && (sm || xs)" /> -->
        </v-col>
      </v-row>
      <!-- /////////////////////////////////////////////////////////////////////// -->
      <v-row no-gutters v-else :style="{ display: xs ? 'grid' : 'flex' }">
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar v-if="!avatar?.url" color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="avatar?.url"></v-img>
              </v-avatar>
              <strong>Мои значения</strong>
            </v-card>
            <v-list
              style="background: lightgray"
              v-for="(MissmatchValue, index) in myDataInEnemyGame[0]
                .MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
          <hr v-if="!selectedGame.Duel" />
          <!-- //////////////////////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MismatchScore.length"
          >
            Совпадений:
            {{ selectedGame.MismatchScore[0][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip>
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRate }}
          </v-chip> -->
          <!-- ///////////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MismatchScore &&
              selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ selectedGame.MismatchScore[0][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <hr v-if="selectedGame.Duel" />
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRateEnemy }}
          </v-chip>
          <!-- <hr v-if="selectedGame.Duel && (sm || xs)" /> -->
          <hr />
        </v-col>
        <v-col :sm="width < 900 || selectedGame.Duel ? '6' : '3'">
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <!-- <v-icon icon="mdi-account-circle"></v-icon> -->
              <v-avatar
                v-if="gameCreatorAvatar == undefined"
                color="info"
                size="70"
              >
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
                <!-- <font-awesome-icon :icon="['fas', 'image-portrait']" /> -->
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="gameCreatorAvatar"></v-img>
              </v-avatar>
              <strong>{{ gameCreatorName }}</strong>
            </v-card>
            <v-list
              v-for="(MissmatchValue, index) in selectedGame.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
          <hr v-if="!selectedGame.Duel" />
          <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MismatchScore.length"
          >
            Совпадений:
            {{
              coincidences(
                selectedGame.MismatchScore,
                selectedGame.GameCreator.objectId
              )
            }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip>
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRateEnemy }}
          </v-chip> -->
          <!-- //////////////////////////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MismatchScore &&
              selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{
              coincidences(
                selectedGame.MismatchScore,
                selectedGame.GameCreator.objectId
              )
            }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <hr v-if="selectedGame.Duel" />
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRate }}
          </v-chip>
          <hr />
        </v-col>
        <v-col
          :sm="width < 900 ? '6' : '3'"
          v-for="Enemy in selectedGame.EnemyData"
          :key="Enemy.Enemy.username"
          v-show="Enemy.Enemy.objectId !== userId"
        >
          <v-sheet class="pa-2 ma-2">
            <v-card color="indigo" style="display: grid; justify-items: center">
              <v-avatar v-if="!Enemy.Enemy.avatar?.url" color="info" size="70">
                <v-icon icon="mdi-account-circle" style="scale: 4"></v-icon>
              </v-avatar>
              <v-avatar v-else size="70">
                <v-img alt="Avatar" :src="Enemy.Enemy.avatar?.url"></v-img>
              </v-avatar>
              <!-- {{ Enemy.Enemy.avatar }} -->
              <strong>{{ Enemy.Enemy.username }}</strong>
            </v-card>
            <v-list
              v-model="Enemy.MissmatchValue"
              v-for="(MissmatchValue, index) in Enemy.MissmatchValues"
              :value="MissmatchValue"
              :key="index + MissmatchValue"
              >{{ MissmatchValue }}
            </v-list>
          </v-sheet>
          <hr />
          <!-- //////////////////////////////////////////////////////////////////////////////////////// -->
          <!-- <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="selectedGame.MismatchScore.length"
          >
            Совпадений:
            {{ selectedGame.MismatchScore[index][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else
          >
            Совпадений: 0
          </v-chip>
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRateEnemy }}
          </v-chip> -->
          <!-- //////////////////////////////////////////////////////////////////////////////////////////// -->
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-if="
              selectedGame?.MismatchScore &&
              selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений:
            {{ selectedGame.MismatchScore[index][1] }}
          </v-chip>
          <v-chip
            style="background-color: gray; color: white; margin: 5px"
            v-else-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel
            "
          >
            Совпадений: 0
          </v-chip>
          <!-- <hr
            v-if="
              selectedGame?.MismatchScore &&
              !selectedGame.MismatchScore.length &&
              !selectedGame.Duel &&
              (sm || xs)
            "
          /> -->
          <hr />
          <v-chip
            v-if="selectedGame.Duel"
            style="background-color: gray; color: white; margin: 5px"
            >Ставка: {{ selectedGame.MismatchRateEnemy }}
          </v-chip>
        </v-col>
      </v-row>
      <!-- <v-chip
        v-if="!selectedGame.MismatchScore.length"
        style="background-color: gray; color: white; margin: 5px"
      >
        Совпадений: 0
      </v-chip> -->
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <!-- <hr /> -->
      <!-- <v-row v-if="selectedGame.Duel && !enemyGame">
        <v-col>Ставка: {{ selectedGame.MismatchRate }}</v-col>
        <v-col>Ставка: {{ selectedGame.MismatchRateEnemy }}</v-col>
      </v-row>
      <v-row v-else-if="selectedGame.Duel && enemyGame">
        <v-col>Ставка: {{ selectedGame.MismatchRateEnemy }}</v-col>
        <v-col>Ставка: {{ selectedGame.MismatchRate }}</v-col>
      </v-row> -->
      <!-- <hr v-if="!sm && !xs" /> -->

      <!-- <v-row no-gutters v-if="!enemyGame && !selectedGame.Duel">
        <v-col v-if="!selectedGame.MismatchScore.length"
          ><v-sheet>Совпадений: 0</v-sheet></v-col
        >
        <v-col
          v-else
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore"
        >
          <v-sheet>
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row> -->
      <v-row no-gutters v-if="selectedGame.Duel" style="display: grid">
        <v-sheet>
          Несовпадений:
          {{ selectedGame.MismatchScoreDuel }}
        </v-sheet>
      </v-row>
      <!-- <v-row no-gutters v-else-if="enemyGame && !selectedGame.Duel">
        <v-col v-if="!selectedGame.MismatchScore.length">
          <v-chip style="background-color: gray; color: white; margin: 5px">
            Совпадений: 0
          </v-chip>
        </v-col>
        <v-col
          v-else
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="MismatchScore[0] === userId"
        >
          <v-sheet v-if="MismatchScore[0] === userId">
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="MismatchScore[0] === selectedGame.GameCreator.objectId"
        >
          <v-sheet
            v-if="MismatchScore[0] === selectedGame.GameCreator.objectId"
          >
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
        <v-col
          v-for="MismatchScore in selectedGame.MismatchScore"
          :key="MismatchScore[0]"
          v-show="
            MismatchScore[0] !== selectedGame.GameCreator.objectId &&
            MismatchScore[0] !== userId
          "
        >
          <v-sheet
            v-if="
              MismatchScore[0] !== selectedGame.GameCreator.objectId &&
              MismatchScore[0] !== userId
            "
          >
            Совпадений:
            {{ MismatchScore[1] }}
          </v-sheet>
        </v-col>
      </v-row> -->
      <!-- <hr /> -->
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

const { mobile } = useDisplay();
const sm = useDisplay().sm;
const xs = useDisplay().xs;
const width = useDisplay().width;

const sessionStore = useSessionStore();
const gameStore = useGameStore();
const { username, userId, avatar } = storeToRefs(sessionStore);
const {
  confirmation,
  selectedGame,
  duel,
  scoreboardWindow,
  winner,
  enemyGame,
  myDataInEnemyGame,
  remainingEnemyData,
  gameCreatorName,
  gameCreatorAvatar,
} = storeToRefs(gameStore);
const { confirmationWindow, confirmationWindowClose, openGame, duelMenu } =
  gameStore;

// const gameCreatorName = ref("");

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
      console.log(username);
    } else {
      console.log("Пользователь не найден");
    }
  } catch (error) {
    console.error("Ошибка при поиске пользователя:", error);
  }
}

function coincidences(data, id) {
  const result = data.find((item) => item[0] === id);
  return result[1];
}

// onMounted(() => {
//   findGameCreatorData(selectedGame?.GameCreator.objectId);
// });
</script>

<style scoped>
.animation {
  background: linear-gradient(180deg, #fafafa, #ddf810, #8f4ff4);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
  text-align: center;
  padding: 10px;
}

@keyframes gradient {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
