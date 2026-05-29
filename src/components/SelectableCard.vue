<script setup lang="ts">
defineProps<{
  selected?: boolean;
  expanded?: boolean;
  showToggle?: boolean;
  selectLabel?: string;
}>();

const emit = defineEmits<{
  select: [];
  toggle: [];
}>();
</script>

<template>
  <article
    class="selectable-card"
    :class="{ 'is-selected': selected, 'is-expanded': expanded }"
  >
    <button class="selectable-card__select" type="button" @click="emit('select')">
      <slot />
    </button>
    <button
      v-if="showToggle !== false"
      class="selectable-card__toggle"
      type="button"
      @click="emit('toggle')"
    >
      {{ expanded ? "Hide details" : selectLabel || "More details" }}
    </button>
  </article>
</template>
