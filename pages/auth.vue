<template>
  <div>
    <auth-reg></auth-reg>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});
</script>
