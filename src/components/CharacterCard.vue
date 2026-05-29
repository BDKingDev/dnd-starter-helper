<script setup lang="ts">
import type { CharacterCard } from "../types";
import CharacterArt from "./CharacterArt.vue";
import SelectableCard from "./SelectableCard.vue";

defineProps<{
  card: CharacterCard;
  selected: boolean;
  expanded: boolean;
  selectedAppearanceId: string | null;
  previewAppearanceId: string;
}>();

const emit = defineEmits<{
  select: [];
  toggle: [];
  appearanceChange: [appearanceId: string];
}>();
</script>

<template>
  <SelectableCard
    :selected="selected"
    :expanded="expanded"
    select-label="View class details"
    @select="emit('select')"
    @toggle="emit('toggle')"
  >
    <div class="character-card__preview">
      <CharacterArt
        class-name="character-card__token"
        :src="
          card.appearanceOptions.find((option) => option.id === previewAppearanceId)?.tokenImage ??
          card.appearanceOptions[0]?.tokenImage
        "
        :alt="`${card.title} token`"
      />
      <div class="character-card__heading">
        <h3>{{ card.title }}</h3>
        <p>{{ card.role }}</p>
      </div>
    </div>
    <p class="character-card__best-for"><strong>Best for:</strong> {{ card.bestFor }}</p>
    <div v-if="expanded" class="character-card__details">
      <CharacterArt
        class-name="character-card__avatar"
        :src="
          card.appearanceOptions.find((option) => option.id === selectedAppearanceId)?.avatarImage ??
          card.appearanceOptions[0]?.avatarImage
        "
        :alt="`${card.title} avatar`"
      />
      <div class="character-card__detail-copy">
        <p><strong>Race/Species:</strong> {{ card.raceSpecies }}</p>
        <p><strong>At the table:</strong> {{ card.atTheTable }}</p>
        <p>{{ card.concept }}</p>
        <div class="character-card__appearance">
          <span>Portrait style</span>
          <div class="character-card__appearance-buttons">
            <button
              v-for="option in card.appearanceOptions"
              :key="option.id"
              type="button"
              class="mini-toggle"
              :class="{ 'is-active': selectedAppearanceId === option.id }"
              @click.stop="emit('appearanceChange', option.id)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <button type="button" class="primary-button character-card__choose" @click.stop="emit('select')">
          {{ selected ? "Chosen" : `Choose ${card.title}` }}
        </button>
        <div>
          <h4>Fun things to do</h4>
          <ul>
            <li v-for="item in card.funThingsToDo" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h4>Healing-focused add-ons</h4>
          <ul>
            <li v-for="item in card.healingFocusedAddOns" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </SelectableCard>
</template>
