<script setup lang="ts">
import type {
  AdventuringDriveCard,
  CareAboutCard,
  CharacterAppearanceOption,
  CharacterCard,
  FlawCard
} from "../types";
import CharacterArt from "./CharacterArt.vue";

defineProps<{
  character: CharacterCard | null;
  appearance: CharacterAppearanceOption | null;
  adventuringDrive: AdventuringDriveCard | null;
  careAbout: CareAboutCard | null;
  flaw: FlawCard | null;
  playerName: string;
}>();
</script>

<template>
  <aside class="summary-panel">
    <details class="summary-panel__mobile" open>
      <summary>Your picks</summary>
      <div class="summary-panel__content">
        <div v-if="character && appearance" class="summary-panel__character">
          <CharacterArt
            class-name="summary-panel__avatar"
            :src="appearance.avatarImage"
            :alt="`${character.title} avatar`"
          />
        </div>
        <dl class="summary-panel__list">
          <div>
            <dt>Character/Class</dt>
            <dd>{{ character?.title ?? "Choose one" }}</dd>
          </div>
          <div>
            <dt>Adventuring Drive</dt>
            <dd>{{ adventuringDrive?.title ?? "Choose one" }}</dd>
          </div>
          <div>
            <dt>Care About</dt>
            <dd>{{ careAbout?.title ?? "Choose one" }}</dd>
          </div>
          <div>
            <dt>Flaw</dt>
            <dd>{{ flaw?.title ?? "Choose one" }}</dd>
          </div>
          <div>
            <dt>Player Name</dt>
            <dd>{{ playerName || "Not entered yet" }}</dd>
          </div>
        </dl>
      </div>
    </details>
  </aside>
</template>
