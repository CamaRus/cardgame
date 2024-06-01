<template>
  <section>
    <p>This page will be displayed at the /about route.</p>
    <!-- <NuxtLink to="/">Main</NuxtLink> -->
    <!-- <auth-reg></auth-reg> -->
    <!-- <div>Userdata:</div>
    {{ userdata }} -->
  </section>
</template>

<script setup lang="ts">
import { useSessionStore } from "../store/session";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore();
const { isValid } = sessionStore;
const { valid } = storeToRefs(sessionStore);
// const valid = sessionStore.valid;

const { userf } = sessionStore;
const { userdata } = storeToRefs(sessionStore);

// onBeforeMount(userf);
// onBeforeMount(isValid);

definePageMeta({
  key: (route) => route.fullPath,
  // middleware: ["auth"],
});
</script>
