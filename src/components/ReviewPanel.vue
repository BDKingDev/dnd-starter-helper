<script setup lang="ts">
import type {
  AdventuringDriveCard,
  CareAboutCard,
  CharacterAppearanceOption,
  CharacterCard,
  FlawCard,
  OptionalQuestionChoice
} from "../types";
import CharacterArt from "./CharacterArt.vue";

defineProps<{
  character: CharacterCard;
  appearance: CharacterAppearanceOption;
  adventuringDrive: AdventuringDriveCard;
  careAbout: CareAboutCard;
  flaw: FlawCard;
  playerName: string;
  characterName: string;
  optionalChoices: OptionalQuestionChoice[];
  selectedOptionalQuestionSource: string | null;
  optionalAnswer: string;
  validationErrors: string[];
}>();

const emit = defineEmits<{
  updatePlayerName: [value: string];
  updateCharacterName: [value: string];
  updateOptionalQuestionSource: [value: string | null];
  updateOptionalAnswer: [value: string];
}>();
</script>

<template>
  <section class="review-panel">
    <header class="review-panel__header">
      <div>
        <p class="review-panel__eyebrow">Review and save</p>
        <h2>Check your picks</h2>
      </div>
      <CharacterArt
        class-name="review-panel__avatar"
        :src="appearance.avatarImage"
        :alt="`${character.title} avatar`"
      />
    </header>

    <div class="review-panel__grid">
      <article class="review-chip">
        <h3>Character/Class</h3>
        <p>{{ character.title }}</p>
      </article>
      <article class="review-chip">
        <h3>Adventuring Drive</h3>
        <p>{{ adventuringDrive.title }}</p>
      </article>
      <article class="review-chip">
        <h3>Care About</h3>
        <p>{{ careAbout.title }}</p>
      </article>
      <article class="review-chip">
        <h3>Flaw</h3>
        <p>{{ flaw.title }}</p>
      </article>
    </div>

    <label class="field-block">
      <span>Player name (Your name)</span>
      <input
        :value="playerName"
        type="text"
        maxlength="80"
        placeholder="Enter your name"
        @input="emit('updatePlayerName', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="field-block">
      <span>Character name (Optional, defaults exist if you don't have a name idea)</span>
      <input
        :value="characterName"
        type="text"
        maxlength="80"
        :placeholder="character.characterName"
        @input="emit('updateCharacterName', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <section class="optional-question-panel">
      <div class="optional-question-panel__header">
        <h3>Optional question</h3>
        <p>Answer one question from your selected cards, or skip it.</p>
      </div>
      <div class="optional-question-panel__choices">
        <button
          type="button"
          class="question-choice"
          :class="{ 'is-active': selectedOptionalQuestionSource === null }"
          @click="emit('updateOptionalQuestionSource', null)"
        >
          Skip the question
        </button>
        <button
          v-for="choice in optionalChoices"
          :key="choice.source"
          type="button"
          class="question-choice"
          :class="{ 'is-active': selectedOptionalQuestionSource === choice.source }"
          @click="emit('updateOptionalQuestionSource', choice.source)"
        >
          <strong>{{ choice.title }}</strong>
          <span>{{ choice.question }}</span>
        </button>
      </div>
      <label class="field-block">
        <span>Your answer</span>
        <textarea
          :value="optionalAnswer"
          rows="4"
          placeholder="Optional. Leave blank if you want to answer at the table instead."
          @input="emit('updateOptionalAnswer', ($event.target as HTMLTextAreaElement).value)"
        />
      </label>
    </section>

    <ul v-if="validationErrors.length" class="validation-list">
      <li v-for="error in validationErrors" :key="error">{{ error }}</li>
    </ul>
  </section>
</template>
