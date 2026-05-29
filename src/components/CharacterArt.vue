<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  src: string;
  alt: string;
  className?: string;
}>();

const failed = ref(false);

watch(
  () => props.src,
  () => {
    failed.value = false;
  }
);
</script>

<template>
  <div v-if="failed || !src" class="character-art character-art--placeholder" :class="className">
    <span>Art unavailable</span>
  </div>
  <img
    v-else
    :src="src"
    :alt="alt"
    :class="['character-art', className]"
    @error="failed = true"
  />
</template>
