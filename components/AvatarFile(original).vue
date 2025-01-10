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
      <svg
        v-if="!previewUrl && !file"
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
    <v-btn
      v-if="previewUrl || avatar?.url"
      @click="removeImage()"
      class="text-none"
      color="grey-
        lighten-3"
      variant="flat"
    >
      УДАЛИТЬ
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
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
