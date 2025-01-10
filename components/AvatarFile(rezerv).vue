<template>
  <div id="app" style="z-index: 1000" ref="uploadRef">
    <!-- Аватар: {{ dataUrl }} -->
    {{ imgDataUrl }}
    <a class="btn" @click="toggleShow">Set Avatar</a>
    <!-- <my-upload
      v-show="show"
      field="img"
      :width="300"
      :height="300"
      :url="url"
      :headers="headers"
      img-format="png"
      lang-type="ru"
      @update:show="onClose"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    /> -->

    <my-upload
      v-if="show"
      field="img"
      :width="300"
      :height="300"
      img-format="png"
      lang-type="ru"
      @crop-success="cropSuccess"
      @close="resetState"
    />
    <!-- <div v-if="imgDataUrl" class="preview-container">
      <img :src="imgDataUrl" alt="Аватар" />
    </div> -->
    <img v-if="imgDataUrl" :src="imgDataUrl" alt="Avatar" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import myUpload from "vue-image-crop-upload";
import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const { avatarProfile, imgDataUrl } = storeToRefs(sessionStore);
const { setAvatar } = sessionStore;

// Состояние видимости модального окна обрезки
const show = ref(false);
const modal = ref(null); // Привязка к DOM-элементу модального окна
const uploadRef = ref(null);

// Параметры для загрузки
const params = ref({
  token: "123456798",
  name: "avatar",
});

// Заголовки для запроса
const headers = ref({
  smail: "*_~",
});

// URL для отправки обрезанного изображения
const url = "/upload";

// Хранилище для URL изображения
// const imgDataUrl = ref("");

// Переключение видимости модального окна
const toggleShow = () => {
  show.value = !show.value;
};

const uploadParams = ref({
  token: "секретный_токен",
  description: "загрузка аватара",
});

// Тексты интерфейса для русского языка
// const text = ref({
//   title: "Редактировать изображение",
//   btn: {
//     cancel: "Отмена",
//     confirm: "Подтвердить",
//     upload: "Загрузить",
//   },
//   error: {
//     onlyImg: "Только изображения допустимы!",
//     outOfSize: "Файл слишком большой!",
//   },
// });

// Обработка закрытия окна обрезки
const onClose = (newShowValue) => {
  if (!newShowValue) {
    // show.value = false;
    console.log("Окно обрезки закрыто");
    // Добавьте любые действия здесь
    // Например, сброс состояния или вывод сообщения
  }
};

// Обработка успешной обрезки
const cropSuccess = (imgDataUrlValue, field) => {
  console.log("-------- crop success --------");
  imgDataUrl.value = imgDataUrlValue;
  // setAvatar(imgDataUrl.value);
  // show.value = false;
  resetState();
};

// Сброс состояния (например, при закрытии или нажатии "назад")
const resetState = () => {
  show.value = false;
  console.log("State reset complete");
};

// Слежение за изменением `show` для автоматического сброса состояния
// watch(show, (newValue) => {
//   if (!newValue) resetState();
// });

// Обработка успешной загрузки
const cropUploadSuccess = (jsonData, field) => {
  console.log("-------- upload success --------");
  console.log(jsonData);
  console.log("field: " + field);
};

// Обработка ошибки загрузки
const cropUploadFail = (status, field) => {
  console.log("-------- upload fail --------");
  console.log("Status:", status);
  console.log("field: " + field);
};

let intervalId;

const attachHandler = () => {
  const closeButton = uploadRef.value?.querySelector(".vicp-close");
  if (closeButton && !closeButton.hasAttribute("listener-attached")) {
    closeButton.addEventListener("click", handleClose);
    closeButton.setAttribute("listener-attached", "true");
  }
};

const handleClose = () => {
  console.log("Close button clicked");
  show.value = false; // Закрыть окно
};

onMounted(() => {
  intervalId = setInterval(attachHandler, 1000); // Проверять каждые 100ms
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.btn {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

img {
  margin-top: 20px;
  max-width: 300px;
  border: 1px solid #ccc;
}
</style>
