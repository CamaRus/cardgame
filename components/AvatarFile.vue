<template>
  <div class="avatar-upload">
    <!-- Скрытый input для выбора файла -->
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      accept="image/*"
      style="display: none"
    />
    <!-- Иконка для выбора файла -->
    <div class="icon-container" @click="triggerFileInput">
      <!-- <svg
        v-if="!previewUrl"
        :width="iconSize"
        :height="iconSize"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-5-5.01L6.51 10l3.49 3.5 7.49-7.51L19 7.49 10 16.5z"
        />
      </svg> -->

      <svg
        v-if="!avatar?.url && !previewUrl && !file"
        :width="iconSize"
        :height="iconSize"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <title>Выберите аватар!</title>
        <path
          d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
        />
      </svg>
      <!-- <img
        v-if="!previewUrl"
        :src="avatar.url"
        alt="Avatar Preview"
        class="avatar-preview"
      /> -->
      <img
        v-else-if="previewUrl"
        :src="previewUrl"
        alt="Avatar Preview"
        class="avatar-preview"
      />
      <img
        v-else
        :src="avatar?.url"
        alt="Avatar Preview"
        class="avatar-preview"
      />
    </div>
    <!-- Кнопка для удаления изображения -->
    <button @click="removeImage" v-if="previewUrl || avatar?.url">
      Remove
    </button>
    <!-- <img :src="avatar.url" alt="Avatar Preview" class="avatar-preview" /> -->
    <!-- {{ avatarProfile.name }} -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const { avatarProfile } = storeToRefs(sessionStore);
const { avatar } = storeToRefs(sessionStore);
const { setAvatar } = sessionStore;

// Реактивные переменные для хранения файла и его URL
const file = ref<File | null>(avatar.value);
const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const iconSize = 150; // Размер иконки

// Обработчик изменения файла
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
    previewUrl.value = URL.createObjectURL(file.value);
    setAvatar(file.value);
  }
};

// Обработчик вызова input для выбора файла
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Обработчик удаления файла
const removeImage = () => {
  file.value = null;
  previewUrl.value = null;
  setAvatar(null);
};
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px dashed #ccc;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  overflow: hidden;
}

.avatar-preview {
  max-width: 200px;
  max-height: 200px;
}

button {
  margin-top: 10px;
}
</style>
