<template>
  <div class="loader">
    <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// const loading = ref(false);

// export { loading };
</script>

<style scoped>
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
