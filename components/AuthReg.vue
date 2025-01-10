<template>
  <v-container>
    <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
      <v-tab value="auth" text="Вход"> </v-tab>

      <v-tab value="reg" text="Регистрация"></v-tab>
    </v-tabs>

    <v-card>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="auth">
          <v-card-text>
            <v-form fast-fail @submit.prevent="loginUser">
              <v-text-field
                v-model="loginForm.username"
                label="Имя пользователя"
                :rules="loginNameRules"
              ></v-text-field>
              <v-text-field
                v-model="loginForm.password"
                label="Пароль"
                type="password"
                :rules="loginPasswordRules"
              ></v-text-field>
              <v-btn type="submit" color="primary" text="Войти"></v-btn>
              <div
                v-if="errorCode == 101"
                style="display: inline; padding-left: 2%; color: red"
              >
                Неверное имя пользователя или пароль!
              </div>
            </v-form>
          </v-card-text>
          <hr />
        </v-tabs-window-item>

        <v-tabs-window-item value="reg">
          <v-card-text>
            <v-form fast-fail @submit.prevent="registerUser">
              <v-text-field
                v-model="registerForm.username"
                label="Имя пользователя"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="registerForm.email"
                label="Email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="registerForm.password"
                label="Пароль"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                text="Зарегистрироваться"
              ></v-btn>
            </v-form>
          </v-card-text>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>
</template>

<script>
import Parse from "parse";
export default {
  data() {
    return {
      registerForm: {
        username: "",
        email: "",
        password: "",
      },
      loginForm: {
        username: "",
        password: "",
      },
      tab: null,
      errorCode: null,
      nameRules: [
        (value) => {
          if (value?.length > 3) return true;

          return "Имя пользователя должно содержать не менее 3 символов!";
        },
      ],
      passwordRules: [
        (value) => {
          if (value?.length > 5) return true;

          return "Пароль должен состоять как минимум из 6 символов!";
        },
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

      loginNameRules: [
        (value) => {
          if (value) return true;

          return "Введите имя!";
        },
      ],
      loginPasswordRules: [
        (value) => {
          if (value) return true;

          return "Введите пароль!";
        },
      ],
    };
  },
  computed: {},
  methods: {
    // Функция для получения и вывода данных из localStorage
    getAllLocalStorageData() {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log("Key:", key, "Value:", value);
        localStorageData.value.push(`Key: ${key}, Value: ${value}`);
      }
    },

    registerUser() {
      // Create a new instance of the user class
      let user = new Parse.User();
      user.set("username", this.registerForm.username);
      user.set("password", this.registerForm.password);
      user.set("email", this.registerForm.email);
      user.set("avatar", "");
      console.log(user);

      user
        .signUp()
        .then(function (user) {
          console.log(
            "User created successful with name: " +
              user.get("username") +
              " and email: " +
              user.get("email")
          );
        })
        .catch(function (error) {
          console.log("Error: " + error.code + " " + error.message);
        });
    },

    async loginUser() {
      // Create a new instance of the user class
      var user = await Parse.User.logIn(
        this.loginForm.username,
        this.loginForm.password
      )
        .then((user) => {
          this.$router.push("/");
          var currentUser = Parse.User.current();

          if (currentUser) {
            // Если пользователь авторизован, получаем его sessionToken
            var sessionToken = currentUser.getSessionToken();

            // Выводим sessionToken в консоль или используем его в приложении
            console.log("Session token текущего пользователя:", sessionToken);
            localStorage.setItem("sessionToken", sessionToken);
          } else {
            console.log("Пользователь не авторизован.");
          }

          console.log(
            "User created successful with name: " +
              user.get("username") +
              " and email: " +
              user.get("email")
          );
        })
        .catch((error) => {
          this.errorCode = error.code;
          console.log("Error: " + error.code + " " + error.message);
        });
    },

    getSessionsData() {
      var query = new Parse.Query(Parse.Session);
      query
        .find()
        .then((sessions) => {
          // sessions - это массив объектов с данными сеансов

          // Выведите полученные данные в консоль
          console.log("Список сеансов:", sessions);

          // Цикл для обхода всех сеансов
          sessions.forEach((session) => {
            // Получите нужные вам данные о сеансе
            var sessionToken = session.get("sessionToken");
            var user = session.get("user");
            var created = session.createdAt;

            // Выведите данные в консоль или сделайте что-то еще с ними
            console.log("Токен сеанса:", sessionToken);
            console.log("Пользователь:", user.attributes.username);
            console.log("Дата создания:", created);
          });
        })
        .catch((error) => {
          // Обработка ошибок запроса
          console.error("Ошибка при получении сеансов:", error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.card {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.headline {
  text-align: center;
}
</style>
