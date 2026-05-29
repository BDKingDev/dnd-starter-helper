<script setup lang="ts">
import type { CharacterAppearanceId } from "../types";

defineProps<{
  title: string;
  subtitle: string;
  selectedPresentationGender: CharacterAppearanceId;
}>();

const emit = defineEmits<{
  updatePresentationGender: [value: CharacterAppearanceId];
}>();
</script>

<template>
  <header class="app-header">
    <div class="app-header__topline">
      <div>
        <p class="app-header__eyebrow">Beginner-friendly one-shot</p>
        <h1>{{ title }}</h1>
        <p class="app-header__subtitle">{{ subtitle }}</p>
      </div>
      <div class="app-header__toggle-block">
        <span class="app-header__toggle-label">Portrait set</span>
        <div class="app-header__toggle">
          <button
            type="button"
            class="mini-toggle"
            :class="{ 'is-active': selectedPresentationGender === 'male' }"
            @click="emit('updatePresentationGender', 'male')"
          >
            Male
          </button>
          <button
            type="button"
            class="mini-toggle"
            :class="{ 'is-active': selectedPresentationGender === 'female' }"
            @click="emit('updatePresentationGender', 'female')"
          >
            Female
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
