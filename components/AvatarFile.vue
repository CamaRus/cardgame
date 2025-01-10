<template>
  <div class="avatar-upload" ref="uploadRef">
    <!-- {{ clearAvatar }} -->
    <!-- {{ imgDataUrl }} -->
    <!-- {{ avatar?.url }} -->
    <img
      v-if="imgDataUrl && clearAvatar == false"
      :src="imgDataUrl"
      alt="Cropped Avatar"
      class="avatar-preview"
    />
    <img
      v-else-if="avatar?.url && !imgDataUrl && clearAvatar == false"
      :src="avatar?.url"
      alt="Avatar Preview"
      class="avatar-preview"
    />
    <svg
      v-else-if="!imgDataUrl || avatar?.url"
      :width="300"
      :height="300"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
      />
    </svg>
    <!-- <v-btn><a class="btn" @click="toggleCrop">Выбрать аватар</a></v-btn> -->
    <v-btn class="btn" @click="toggleCrop">Выбрать аватар</v-btn>
    <!-- <a class="btn" @click="toggleCrop">Выбрать аватар</a> -->
    <my-upload
      v-if="showCropper"
      field="avatar"
      :width="300"
      :height="300"
      img-format="png"
      :no-square="true"
      @crop-success="onCropSuccess"
      @close="resetCropper"
      lang-type="ru"
    />
    <!-- <div v-if="imgDataUrl" class="actions"> -->
    <!-- <a class="btn" @click="saveAvatarToBack4App">Сохранить</a> -->
    <!-- <a class="btn" @click="resetCropper">Удалить</a> -->
    <v-btn v-if="imgDataUrl || avatar" @click="resetCropper">Удалить</v-btn>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";
const sessionStore = useSessionStore();
const { avatar, clearAvatar, svg, imgDataUrl, showCropper } =
  storeToRefs(sessionStore);
const { setAvatar, fetchUserData } = sessionStore;
import myUpload from "vue-image-crop-upload";
import Parse from "parse";
Parse.initialize(
  "4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW",
  "MEnppDlziXN2QSIt16oli8kgQufCpCn0mByZTInq"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// Локальные состояния
// const showCropper = ref(false);
const uploadRef = ref(null);
// const imgDataUrl = ref<string | null>(null);
// const svg = ref(false);
// const clearAvatar = ref(false);

// Открытие кроппера
const toggleCrop = () => {
  showCropper.value = !showCropper.value;
};

// Успешное обрезание аватара
const onCropSuccess = (dataUrl: string) => {
  imgDataUrl.value = dataUrl;
  svg.value = false;
  clearAvatar.value = false;
  showCropper.value = false; // Закрытие кроппера
};

// Сброс состояния
const resetCropper = () => {
  imgDataUrl.value = null;
  showCropper.value = false;
  svg.value = true;
  clearAvatar.value = true;
};

// Конвертация dataURL в файл
const dataURLtoFile = (dataURL: string, filename: string) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Загрузка аватара в Back4App
const saveAvatarToBack4App = async () => {
  if (!imgDataUrl.value) {
    console.error("No image data available for upload.");
    return;
  }

  try {
    // Конвертация dataURL в файл
    const file = dataURLtoFile(imgDataUrl.value, "avatar.png");

    // Создание Parse.File
    const parseFile = new Parse.File("avatar.png", file);

    // Сохранение файла
    await parseFile.save();

    // Привязка файла к текущему пользователю
    const currentUser = Parse.User.current();
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
};

let intervalId;

const attachHandler = () => {
  const closeButton = uploadRef.value?.querySelector(".vicp-close");
  const cancelText = uploadRef.value?.querySelector(".vicp-operate");
  if (closeButton && !closeButton.hasAttribute("listener-attached")) {
    closeButton.addEventListener("click", handleClose);
    closeButton.setAttribute("listener-attached", "true");
  }
  if (cancelText && !cancelText.hasAttribute("listener-attached")) {
    cancelText.addEventListener("click", handleClose);
    cancelText.setAttribute("listener-attached", "true");
  }
};

const handleClose = () => {
  console.log("Close button clicked");
  showCropper.value = false; // Закрыть окно
};

onMounted(() => {
  intervalId = setInterval(attachHandler, 100); // Проверять каждые 100ms
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 5px;
}

.btn:hover {
  background-color: #0056b3;
}

.avatar-preview {
  margin: 10px;
  max-width: 300px;
  max-height: 300px;
  border: 2px solid #ccc;
  border-radius: 50%;
}

.actions {
  display: flex;
  gap: 10px;
}

::v-deep(.vicp-crop-right) {
  display: grid !important;
  float: none !important;
  justify-content: center !important;
}

::v-deep(.vicp-preview-item-circle) {
  padding: 0px !important;
}

::v-deep(.vue-image-crop-upload .vicp-wrap) {
  width: 100%; /* Дефолтная ширина */
  max-width: 600px; /* Максимальная ширина */
}
</style>
