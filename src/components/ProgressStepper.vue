<script setup lang="ts">
defineProps<{
  steps: string[];
  currentStep: number;
}>();
</script>

<template>
  <ol class="progress-stepper">
    <li
      v-for="(step, index) in steps"
      :key="step"
      class="progress-stepper__item"
      :data-state="
        index === currentStep ? 'current' : index < currentStep ? 'done' : 'upcoming'
      "
    >
      <span class="progress-stepper__index">{{ index + 1 }}</span>
      <span class="progress-stepper__label">{{ step }}</span>
    </li>
  </ol>
</template>
