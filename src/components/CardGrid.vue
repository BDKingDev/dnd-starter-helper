<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="card-grid-section">
    <header class="card-grid-section__header">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </header>
    <div class="card-grid-section__grid">
      <slot />
    </div>
  </section>
</template>
