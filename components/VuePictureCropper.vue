<template>
  <div id="app">
    <h1>Vue Image Crop Upload Demo</h1>
    <div>
      <my-upload
        field="file"
        v-show="show"
        :width="width"
        :height="height"
        :resize="true"
        :scale="true"
        :output-type="'verbose'"
        img-format="jpeg"
        :params="params"
        :headers="headers"
        :url="uploadUrl"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
      <button @click="toggleShow">
        {{ show ? "Close Crop Modal" : "Open Crop Modal" }}
      </button>
      <div v-if="imgData">
        <h2>Uploaded Image Data</h2>
        <img :src="imgData.url" alt="Cropped Image" />
        <p>Width: {{ imgData.width }}px</p>
        <p>Height: {{ imgData.height }}px</p>
        <p>Type: {{ imgData.type }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import myUpload from "vue-image-crop-upload";

// Состояние видимости модального окна
const show = ref(false);

// Параметры для загрузки
const params = ref({
  token: "123456",
  extraParam: "example",
});

// Заголовки для запроса
const headers = ref({
  Authorization: "Bearer example-token",
});

// URL для загрузки файла
const uploadUrl = "https://your-server.com/upload";

// Настройки кроппера
const width = ref(300);
const height = ref(300);

// Хранилище данных об изображении
const imgData = ref(null);

// Методы
const toggleShow = () => {
  show.value = !show.value;
};

const cropSuccess = (data) => {
  console.log("Crop successful:", data);
  imgData.value = data;
};

const cropUploadSuccess = (response, field) => {
  console.log("Upload successful:", response, "Field:", field);
};

const cropUploadFail = (status, field) => {
  console.error("Upload failed. Status:", status, "Field:", field);
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

img {
  margin-top: 20px;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
