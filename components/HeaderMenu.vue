<template>
  <v-app-bar ref="headerRef" app>
    <!-- <v-app-bar app> -->
    <div style="position: fixed; width: 100%; z-index: 2;" ref="fixedDivRef">
      <div>
        <!-- <h1>Default Layout</h1> -->
        <div class="d-flex pa-2 bg-deep-purple" >
          Привет, {{ username }}!
          <!-- {{headerHeight}} -->
          <!-- {{fixedDivHeight}} -->
          <!-- {{viewportWidth}} -->
          <!-- {{windowWidth}} -->
          <!-- {{windowHeight}} -->
          <!-- {{window.innerWidth}} -->
          <!-- {{documentHeight}} -->
          <!-- {{adjustedPaddingTop}} -->
          <!-- {{documentHeight}} -->
          <!-- {{Height}} -->
          <div :style="{ display: mobile ? 'contents' : 'block' }">
            <v-btn-toggle
              v-model="text"
              color="white"
              rounded="3"
              base-color="red"
              class="round"
              ><v-btn
                class="round"
                variant="outlined"
                @click="active = !active"
                value="settings"
                ><svg
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="black"
                    d="M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M17 12C16.87 12 16.76 12.09 16.74 12.21L16.55 13.53C16.25 13.66 15.96 13.82 15.7 14L14.46 13.5C14.35 13.5 14.22 13.5 14.15 13.63L13.15 15.36C13.09 15.47 13.11 15.6 13.21 15.68L14.27 16.5C14.25 16.67 14.24 16.83 14.24 17C14.24 17.17 14.25 17.33 14.27 17.5L13.21 18.32C13.12 18.4 13.09 18.53 13.15 18.64L14.15 20.37C14.21 20.5 14.34 20.5 14.46 20.5L15.7 20C15.96 20.18 16.24 20.35 16.55 20.47L16.74 21.79C16.76 21.91 16.86 22 17 22H19C19.11 22 19.22 21.91 19.24 21.79L19.43 20.47C19.73 20.34 20 20.18 20.27 20L21.5 20.5C21.63 20.5 21.76 20.5 21.83 20.37L22.83 18.64C22.89 18.53 22.86 18.4 22.77 18.32L21.7 17.5C21.72 17.33 21.74 17.17 21.74 17C21.74 16.83 21.73 16.67 21.7 16.5L22.76 15.68C22.85 15.6 22.88 15.47 22.82 15.36L21.82 13.63C21.76 13.5 21.63 13.5 21.5 13.5L20.27 14C20 13.82 19.73 13.65 19.42 13.53L19.23 12.21C19.22 12.09 19.11 12 19 12H17M10 14C5.58 14 2 15.79 2 18V20H11.68A7 7 0 0 1 11 17A7 7 0 0 1 11.64 14.09C11.11 14.03 10.56 14 10 14M18 15.5C18.83 15.5 19.5 16.17 19.5 17C19.5 17.83 18.83 18.5 18 18.5C17.16 18.5 16.5 17.83 16.5 17C16.5 16.17 17.17 15.5 18 15.5Z"
                  />
                </svg>
                <v-tooltip activator="parent" location="bottom"
                  >настройки профиля</v-tooltip
                >
              </v-btn>
            </v-btn-toggle>
            <v-btn
              style="margin-left: 10px; background-color: yellow; color: black"
              @click="rules = true"
              >Правила</v-btn
            >
            <exit-button
              style="background-color: white; color: black"
            ></exit-button>
          </div>
        </div>
        <slot />
      </div>
    </div>
  </v-app-bar>
  <v-bottom-navigation
    class="z"
    :active="active"
    color="red"
    density="compact"
    elevation="12"
    :height="bottomNavHeight"
  >
  <!-- :height="bottomNavHeight" -->
    <profile-data></profile-data>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { useWindowSize } from "@vueuse/core";
import { useSessionStore } from "../store/session";
import { useGameStore } from "../store/game";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const { username } = storeToRefs(sessionStore);
const gameStore = useGameStore();
const { rules, headerHeight } = storeToRefs(gameStore);

const { width: windowWidth, height: windowHeight } = useWindowSize();
const { mobile } = useDisplay();

const headerRef = ref(null);
const headerHeightValue = ref(0);

// const Height = ref(window.innerHeight);

// Реактивные переменные для ширины и высоты документа
const documentWidth = ref(0);
const documentHeight = ref(0);

// Функция для обновления размеров документа
const updateDocumentSize = () => {
  const { scrollWidth, scrollHeight } = document.documentElement;
  documentWidth.value = scrollWidth;
  documentHeight.value = scrollHeight;
};


const updateHeaderHeight = () => {
  if (headerRef.value) {
    headerHeightValue.value = headerRef.value.$el.offsetHeight; // Получаем высоту элемента
    headerHeight.value = headerHeightValue.value;
  }
};

const viewportWidth = ref(window.visualViewport?.width || window.innerWidth);

// window.visualViewport?.addEventListener("resize", () => {
//   viewportWidth.value = window.visualViewport.width;
// });

// Определяем реактивную переменную с типом boolean
const active = ref<boolean>(false);
const text = ref<string>("settings");

// Динамическое вычисление высоты для нижней навигации
const bottomNavHeight = computed(() => {
  // return windowHeight.value - headerHeightValue.value
  // return windowHeight.value - fixedDivHeight.value
  return windowHeight.value
});

// Реф для элемента и его высоты
const fixedDivRef = ref<HTMLElement | null>(null);
const fixedDivHeight = ref(0);
// Функция для обновления высоты элемента
const updateFixedDivHeight = () => {
  if (fixedDivRef.value) {
    fixedDivHeight.value = fixedDivRef.value.offsetHeight;
  }
};

// Следим за изменением состояния active
watch(active, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add("no-scroll");
  } else {
    document.documentElement.classList.remove("no-scroll");
  }
});

onMounted(() => {
  updateHeaderHeight(); // Вызываем при монтировании компонента
  window.addEventListener('resize', updateHeaderHeight); // Обновляем высоту при изменении размера окна
  updateDocumentSize(); // Получаем размеры при загрузке
  window.addEventListener('resize', updateDocumentSize); // Обновляем при изменении размера окна
  nextTick(() => {
    updateFixedDivHeight(); // Получаем высоту после монтирования
  });
  window.addEventListener("resize", updateFixedDivHeight); // Обновляем высоту при изменении размеров окна
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight); // Удаляем слушатель при уничтожении компонента
  window.removeEventListener('resize', updateDocumentSize);
  window.removeEventListener("resize", updateFixedDivHeight); // Удаляем слушатель при уничтожении
});
</script>

<style scoped>
.default-layout {
  color: red;
}
.d-flex {
  justify-content: space-between;
  align-items: center;
}
.round {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  min-width: auto;
  background: currentColor;
}

.v-btn.v-btn--density-default {
  height: 40px;
}

.aaa {
  bottom: 100px;
}

.v-bottom-navigation {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.trans {
  transform: translateY(200px) !important;
  transition: transform 0.3s ease !important;
  background-color: green;
}

.z {
  z-index: 10 !important;
}
</style>
