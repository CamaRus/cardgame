<template>
  <v-card color="#9c27b0" width="100%" class="overflow-auto" :style="{ paddingTop: calculatePaddingTop() }">
    <v-form v-model="form" @submit.prevent="onSubmit">
      <v-toolbar color="purple" flat>
        <v-toolbar-title class="font-weight-light">
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="(isEditing = !isEditing), resetData()">
          <v-fade-transition leave-absolute>
            <v-icon v-if="isEditing">mdi-close</v-icon>

            <v-icon v-else>mdi-pencil</v-icon>
          </v-fade-transition>
        </v-btn>
      </v-toolbar>
      <v-card
        :disabled="!isEditing"
        color="purple"
        :style="{ display: mobile.xs ? 'grid' : 'flex' }"
        ><avatar-file :disabled="!isEditing"></avatar-file>
        <v-card-text>
          <v-text-field
            :disabled="!isEditing"
            base-color="white"
            label="Имя"
            v-model="newUsername"
            :rules="nameRules"
            :readonly="loading"
            clearable
          ></v-text-field>

          <v-text-field
            :disabled="!isEditing"
            base-color="white"
            label="Email"
            v-model="newEmail"
            :rules="emailRules"
            :readonly="loading"
            clearable
          ></v-text-field> </v-card-text
      ></v-card>

      <v-divider></v-divider>

      <v-card-actions style="padding: 1.5rem">
        <v-spacer></v-spacer>

        <v-btn
          :disabled="!form || !isEditing || showCropper"
          @click="save()"
          :loading="loading"
          type="submit"
          variant="elevated"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="hasSaved" :timeout="3000" style="top: 85%">
        Изменения сохранены!
      </v-snackbar>
    </v-form>
  </v-card>
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
import { useDisplay } from "vuetify";
import { useGameStore } from '~/store/game';

export default {
  data: () => ({
    hasSaved: false,
    form: false,
    isEditing: null,
    newUsername: "",
    newEmail: "",
    loading: false,
    mobile: useDisplay(),
    states: [
      { name: "Florida", abbr: "FL", id: 1 },
      { name: "Georgia", abbr: "GA", id: 2 },
      { name: "Nebraska", abbr: "NE", id: 3 },
      { name: "California", abbr: "CA", id: 4 },
      { name: "New York", abbr: "NY", id: 5 },
    ],
    emailRules: [
      (value) => {
        if (value) return true;

        return "E-mail is requred.";
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;

        return "E-mail must be valid.";
      },
    ],

    nameRules: [
      (value) => {
        if (value) return true;

        return "Введите имя!";
      },
    ],
  }),

  mounted() {
    this.setUsername();
    console.log("Created!");
  },
  computed: {
    // Используем mapState для получения состояния из хранилища
    ...mapState(useSessionStore, [
      "username",
      "email",
      "userId",
      "avatarProfile",
      "avatar",
      "clearAvatar",
      "svg",
      "imgDataUrl",
      "showCropper",
    ]),

    display() {
      this.mobile = useDisplay();
      return this.mobile;
    },
  },

  methods: {
    setUsername() {
      this.newUsername = this.username;
      this.newEmail = this.email;
    },

    calculatePaddingTop () {
      if (this.mobile.xs) {
        return `50px`;
      } else if (this.mobile.sm) {
        return `50px`
      } else if (this.mobile.md) {
        return `50px`
      } else if (this.mobile.lg) {
        return `175px`
      } else if (this.mobile.sm) {
        return `50px`
      } else {
        return `50px`
        }
},

    isValid() {
      const sessionStore = useSessionStore();
      sessionStore.isValid(); // или любое другое значение
    },

    customFilter(itemTitle, queryText, item) {
      const textOne = item.raw.name.toLowerCase();
      const textTwo = item.raw.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    onSubmit() {
      if (!this.form) return;

      this.loading = true;

      // setTimeout(() => (this.loading = false), 2000);
    },

    async saveRezerv() {
      const currentUser = Parse.User.current();

      if (currentUser) {
        // Устанавливаем новые значения
        currentUser.set("username", this.newUsername);
        currentUser.set("email", this.newEmail);
        if (this.avatarProfile) {
          console.log("avatar!");

          // Создаем Parse файл из загруженного файла
          const parseFile = new Parse.File(
            this.avatarProfile.name,
            this.avatarProfile
          );

          // Сохраняем файл на сервере Parse
          await parseFile.save();

          // Обновляем текущего пользователя, добавляя ссылку на файл
          currentUser.set("avatar", parseFile);
        } else {
          // Удаляем аватарку, если нового файла нет
          currentUser.unset("avatar");
        }

        try {
          // Сохраняем изменения
          await currentUser.save();
          console.log("User data updated successfully: ", this.avatar);
          this.isValid();
        } catch (error) {
          console.error("Error while updating user data:", error);
        }
      } else {
        console.error("No user is currently logged in");
      }
    },

    async save() {
      const currentUser = Parse.User.current();

      if (currentUser) {
        // Устанавливаем новые значения
        currentUser.set("username", this.newUsername);
        currentUser.set("email", this.newEmail);
        await this.saveAvatarToBack4App();

        try {
          // Сохраняем изменения
          await currentUser.save();
          console.log("User data updated successfully: ", this.avatar);
          console.log("clear avatar: ", this.clearAvatar);
          const sessionStore = useSessionStore();
          // await currentUser.fetch(); // Загружаем обновленные данные с сервера
          // sessionStore.fetchUserData(); // или любое другое значение
          await useGameStore().fetchGames();
          await useGameStore().getGamesByEnemy(sessionStore.userId);
          await useGameStore().mergeGameData(useGameStore().gamesData, useGameStore().strangersData)
          this.isValid();
          this.hasSaved = true;
          this.loading = false;
        } catch (error) {
          console.error("Error while updating user data:", error);
        }
      } else {
        console.error("No user is currently logged in");
      }
    },

    // Конвертация dataURL в файл
    dataURLtoFile(dataURL, filename) {
      const arr = dataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    resetData() {
      // this.imgDataUrl = null;

      const sessionStore = useSessionStore();
      sessionStore.imgDataUrl = null;
      sessionStore.clearAvatar = false;
      this.newUsername = this.username;
      this.newEmail = this.email;
      console.log("clear img", this.imgDataUrl);
    },

    async saveAvatarToBack4AppRezerv() {
      const currentUser = Parse.User.current();
      if (!this.imgDataUrl) {
        currentUser.unset("avatar");
        await currentUser.save();
        console.log("unset!");
        // console.error("No image data available for upload. ", this.imgDataUrl);

        // return;
      } else
        try {
          // Конвертация dataURL в файл
          const file = this.dataURLtoFile(this.imgDataUrl, "avatar.png");

          // Создание Parse.File
          const parseFile = new Parse.File("avatar.png", file);

          // Сохранение файла
          await parseFile.save();

          // Привязка файла к текущему пользователю
          // const currentUser = Parse.User.current();
          if (currentUser) {
            currentUser.set("avatar", parseFile); // Поле avatar
            await currentUser.save();
            console.log("Avatar uploaded and saved!");
          } else {
            console.log("No user is logged in.");
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
        }
    },

    async saveAvatarToBack4App() {
  const currentUser = Parse.User.current();

  if (!this.imgDataUrl) {
    // Если новый аватар не предоставлен, ничего не делаем
    if (!currentUser.get("avatar")) {
      currentUser.unset("avatar"); // Удаляем только если ранее не было аватара
      await currentUser.save();
      console.log("Avatar unset!");
    } else {
      console.log("Avatar remains unchanged.");
    }
    return;
  }

  try {
    // Конвертация dataURL в файл
    const file = this.dataURLtoFile(this.imgDataUrl, "avatar.png");

    // Создание Parse.File
    const parseFile = new Parse.File("avatar.png", file);

    // Сохранение файла
    await parseFile.save();

    // Привязка файла к текущему пользователю
    if (currentUser) {
      currentUser.set("avatar", parseFile); // Поле avatar
      await currentUser.save();
      console.log("Avatar uploaded and saved!");
    } else {
      console.log("No user is logged in.");
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
  }
}
  },
};
</script>

<style scoped>
.text-red {
  color: aliceblue !important;
}

.trans {
  transform: translateY(200px) !important;
  transition: transform 0.3s ease !important;
}
</style>
