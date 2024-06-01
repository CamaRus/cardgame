<template>
  <div class="default-layout">
    <h1>Default Layout</h1>
    <div>
      <!-- {{
        localStorage.getItem(
          "Parse/4RlgR1kapPiYAeXxd3NZYhrFnzPmUhDs3eiNvUyW/currentUser"
        )
      }} -->
    </div>
    <!-- <div>Userdata:</div>
    {{ userdata }} -->
    <!-- <NuxtLink to="/auth">Auth</NuxtLink> -->
    <slot />
  </div>
</template>

<style>
.default-layout {
  color: red;
}
</style>

<script setup>
// import { useSessionStore } from "~/store/session";
// import { storeToRefs } from "pinia";

// const sessionStore = useSessionStore();
// const { addValueToSessionToken } = sessionStore;
// const { sessionToken } = storeToRefs(sessionStore);

import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const sessionStore = useSessionStore();
const { isValid } = sessionStore;
const { valid } = storeToRefs(sessionStore);
const { username } = storeToRefs(sessionStore);
// const valid = sessionStore.valid;

const { userf } = sessionStore;
const { userdata } = storeToRefs(sessionStore);

const router = useRouter();

const checkValid = () => {
  // Удаляем определенные значения из localStorage
  isValid();
  if (valid.value == false) {
    router.push("/auth");
  }
};

// onBeforeMount(userf);
// onBeforeMount(isValid);
// Created(checkValid);

definePageMeta({
  key: (route) => route.fullPath,
  // middleware: ["auth"],
  // or middleware: 'auth'
});
</script>
