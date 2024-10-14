<template>
  <v-card color="#9c27b0" width="100%" class="overflow-auto">
    <v-form v-model="form" @submit.prevent="onSubmit">
      <v-toolbar color="purple" flat>
        <!-- <v-btn icon="mdi-account"></v-btn> -->

        <v-toolbar-title class="font-weight-light">
          <!-- {{ fetchUsername }} -->
          {{ username }}
          <!-- {{ userId }} -->
          <!-- {{ email }} -->
          <!-- {{ avatarProfile }} -->
          <!-- {{ avatar.name }} -->
          <!-- {{ avatar }} -->
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="isEditing = !isEditing">
          <v-fade-transition leave-absolute>
            <v-icon v-if="isEditing">mdi-close</v-icon>

            <v-icon v-else>mdi-pencil</v-icon>
          </v-fade-transition>
        </v-btn>
      </v-toolbar>
      <!-- <div style="display: flex"> -->
      <v-card :disabled="!isEditing" color="purple" style="display: flex"
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
      <!-- </div> -->

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          :disabled="!form || !isEditing"
          @click="save"
          :loading="loading"
          type="submit"
          variant="elevated"
        >
          Сохранить
        </v-btn>

        <!-- <v-btn
          :disabled="!emailRules.value || !isEditing"
          @click="save"
          :loading="loading"
          type="submit"
          variant="elevated"
        >
          Сохранить
        </v-btn> -->
      </v-card-actions>

      <v-snackbar
        v-model="hasSaved"
        :timeout="2000"
        location="bottom left"
        position="absolute"
        attach
      >
        Your profile has been updated
      </v-snackbar>
      <!-- </v-form> -->
    </v-form>
    <!-- <img :src="avatar.url" alt="Avatar Preview" class="avatar-preview" /> -->
    <!-- {{ avatarProfile.name }} -->
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

export default {
  data: () => ({
    hasSaved: false,
    form: false,
    isEditing: null,
    newUsername: "",
    newEmail: "",
    loading: false,
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
    // this.getDataUser();
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
    ]),
    // ...mapActions(useSessionStore, ["isValid", "fetchUsername"]),

    // userId() {
    //   return this.userId;
    // },
  },
  //   Mounted() {
  //     this.setUsername();
  //     console.log("Mounted!");
  //   },

  methods: {
    setUsername() {
      this.newUsername = this.username;
      this.newEmail = this.email;
    },

    isValid() {
      const sessionStore = useSessionStore();
      sessionStore.isValid(); // или любое другое значение
      // console.log('Is valid:', sessionStore.valid);
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

      setTimeout(() => (this.loading = false), 2000);
    },

    // save() {
    //   const currentUser = Parse.User.current();
    //   if (currentUser) {
    //     console.log("Yes!");
    //     // do stuff with the user
    //   } else {
    //     console.log("No!");
    //     // show the signup or login page
    //   }
    // },

    async save() {
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
        }

        // Создаем Parse файл из загруженного файла
        //  const parseFile = new Parse.File(this.file.name, this.file);

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

    // getDataUser() {
    //   const user = Parse.Object.extend("User");
    //   const query = new Parse.Query(user);
    //   query.get(this.userId).then(
    //     (userdata) => {
    //       // The object was retrieved successfully.
    //       const username = userdata.get("username");
    //       const avatar = userdata.get("avatar");
    //       this.username = username;
    //       console.log("User: ", username);
    //       console.log("Avatar: ", avatar);
    //     },
    //     console.log(this.username),
    //     (error) => {
    //       // The object was not retrieved successfully.
    //       // error is a Parse.Error with an error code and message.
    //     }
    //   );
    // },
  },
};
</script>

<style scoped>
.text-red {
  color: aliceblue !important;
}
</style>
