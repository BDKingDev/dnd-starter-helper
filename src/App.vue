<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import CardGrid from "./components/CardGrid.vue";
import CharacterCard from "./components/CharacterCard.vue";
import ProgressStepper from "./components/ProgressStepper.vue";
import ReviewPanel from "./components/ReviewPanel.vue";
import SaveResult from "./components/SaveResult.vue";
import SelectionSummary from "./components/SelectionSummary.vue";
import SelectableCard from "./components/SelectableCard.vue";
import { adventuringDriveCards } from "./data/adventuringDrives";
import { careAboutCards } from "./data/careAbout";
import { characterCards } from "./data/characters";
import { flawCards } from "./data/flaws";
import { introContent } from "./data/intro";
import type {
  CharacterAppearanceId,
  DraftState,
  OptionalQuestionChoice,
  OptionalQuestionSource
} from "./types";
import { copyToClipboard } from "./utils/copyToClipboard";
import { downloadJson } from "./utils/downloadJson";
import {
  buildSubmissionFilename,
  buildSubmissionPayload,
  submitPayload
} from "./utils/submission";
import { clearDraft, loadDraft, saveDraft } from "./utils/storage";

const steps = [
  "Intro",
  "Character/Class",
  "Adventuring Drive",
  "Care About",
  "Flaw",
  "Review + Save"
];

const defaultDraftState: DraftState = {
  playerName: "",
  selectedCharacterId: null,
  selectedCharacterAppearanceId: null,
  selectedPresentationGender: "male",
  selectedAdventuringDriveId: null,
  selectedCareAboutId: null,
  selectedFlawId: null,
  selectedOptionalQuestionSource: null,
  optionalAnswer: ""
};

const draft = reactive<DraftState>(
  {
    ...defaultDraftState,
    ...loadDraft()
  }
);

const currentStep = ref(0);
const expandedCharacterId = ref<string | null>(draft.selectedCharacterId);
const submitSuccess = ref(false);
const submitSuccessMessage = ref("");
const submitError = ref("");
const copySuccess = ref(false);
const isSubmitting = ref(false);

const selectedCharacter = computed(
  () => characterCards.find((card) => card.id === draft.selectedCharacterId) ?? null
);
const selectedAppearance = computed(() => {
  if (!selectedCharacter.value) {
    return null;
  }

  return (
    selectedCharacter.value.appearanceOptions.find(
      (option) => option.id === draft.selectedCharacterAppearanceId
    ) ??
    selectedCharacter.value.appearanceOptions.find(
      (option) => option.id === draft.selectedPresentationGender
    ) ??
    selectedCharacter.value.appearanceOptions[0] ??
    null
  );
});
const selectedAdventuringDrive = computed(
  () =>
    adventuringDriveCards.find(
      (card) => card.id === draft.selectedAdventuringDriveId
    ) ?? null
);
const selectedCareAbout = computed(
  () => careAboutCards.find((card) => card.id === draft.selectedCareAboutId) ?? null
);
const selectedFlaw = computed(
  () => flawCards.find((card) => card.id === draft.selectedFlawId) ?? null
);

const optionalChoices = computed<OptionalQuestionChoice[]>(() => {
  const choices: OptionalQuestionChoice[] = [];

  if (selectedCharacter.value) {
    choices.push({
      source: "character",
      title: selectedCharacter.value.title,
      question: "What part of this role sounds most fun to you?"
    });
  }

  if (selectedAdventuringDrive.value) {
    choices.push({
      source: "adventuringDrive",
      title: selectedAdventuringDrive.value.title,
      question: selectedAdventuringDrive.value.question
    });
  }

  if (selectedCareAbout.value) {
    choices.push({
      source: "careAbout",
      title: selectedCareAbout.value.title,
      question: selectedCareAbout.value.question
    });
  }

  if (selectedFlaw.value) {
    choices.push({
      source: "flaw",
      title: selectedFlaw.value.title,
      question: selectedFlaw.value.question
    });
  }

  return choices;
});

const validationErrors = computed(() => {
  const errors: string[] = [];
  if (!selectedCharacter.value) errors.push("Pick your Character/Class.");
  if (!selectedAdventuringDrive.value) errors.push("Pick your Adventuring Drive.");
  if (!selectedCareAbout.value) {
    errors.push("Pick Someone or Something You Care About.");
  }
  if (!selectedFlaw.value) errors.push("Pick your Flaw.");
  if (!draft.playerName.trim()) errors.push("Enter your player name.");
  return errors;
});

const submissionPayload = computed(() => {
  if (
    !selectedCharacter.value ||
    !selectedAppearance.value ||
    !selectedAdventuringDrive.value ||
    !selectedCareAbout.value ||
    !selectedFlaw.value ||
    !draft.playerName.trim()
  ) {
    return null;
  }

  return buildSubmissionPayload({
    playerName: draft.playerName,
    character: selectedCharacter.value,
    appearance: selectedAppearance.value,
    adventuringDrive: selectedAdventuringDrive.value,
    careAbout: selectedCareAbout.value,
    flaw: selectedFlaw.value,
    optionalAnswer: draft.optionalAnswer
  });
});

const hasEndpoint = Boolean(import.meta.env.VITE_SUBMISSION_ENDPOINT);

watch(
  draft,
  () => {
    saveDraft({ ...draft });
  },
  { deep: true }
);

watch(
  selectedCharacter,
  (character) => {
    if (!character) {
      draft.selectedCharacterAppearanceId = null;
      return;
    }

    const hasSelectedAppearance = character.appearanceOptions.some(
      (option) => option.id === draft.selectedCharacterAppearanceId
    );

    if (!hasSelectedAppearance) {
      draft.selectedCharacterAppearanceId =
        character.appearanceOptions.find(
          (option) => option.id === draft.selectedPresentationGender
        )?.id ??
        character.appearanceOptions[0]?.id ??
        null;
    }
  },
  { immediate: true }
);

watch(
  optionalChoices,
  (choices) => {
    if (
      draft.selectedOptionalQuestionSource &&
      !choices.some((choice) => choice.source === draft.selectedOptionalQuestionSource)
    ) {
      draft.selectedOptionalQuestionSource = null;
      draft.optionalAnswer = "";
    }
  },
  { immediate: true }
);

function goNext() {
  if (currentStep.value === 1 && !selectedCharacter.value) return;
  if (currentStep.value === 2 && !selectedAdventuringDrive.value) return;
  if (currentStep.value === 3 && !selectedCareAbout.value) return;
  if (currentStep.value === 4 && !selectedFlaw.value) return;
  currentStep.value = Math.min(currentStep.value + 1, steps.length - 1);
}

function goBack() {
  currentStep.value = Math.max(currentStep.value - 1, 0);
}

function chooseCharacter(characterId: string) {
  draft.selectedCharacterId = characterId;
  expandedCharacterId.value = characterId;
}

function chooseAppearance(appearanceId: string) {
  draft.selectedCharacterAppearanceId = appearanceId;
}

function setPresentationGender(value: CharacterAppearanceId) {
  draft.selectedPresentationGender = value;
  draft.selectedCharacterAppearanceId = value;
}

function chooseOptionalSource(source: string | null) {
  draft.selectedOptionalQuestionSource = source as OptionalQuestionSource;
  if (source === null) {
    draft.optionalAnswer = "";
  }
}

async function handleSubmit() {
  if (!submissionPayload.value || !import.meta.env.VITE_SUBMISSION_ENDPOINT) {
    return;
  }

  isSubmitting.value = true;
  submitSuccess.value = false;
  submitSuccessMessage.value = "";
  submitError.value = "";

  try {
    const result = await submitPayload(
      import.meta.env.VITE_SUBMISSION_ENDPOINT,
      submissionPayload.value
    );
    submitSuccess.value = true;
    submitSuccessMessage.value =
      result === "opaque"
        ? "Your submission was sent. This connection does not provide an instant confirmation, so if your DM does not see it in the sheet, use Download JSON or Copy JSON as a backup."
        : "Submission sent successfully.";
    clearDraft();
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : "Unable to submit right now.";
  } finally {
    isSubmitting.value = false;
  }
}

function handleDownload() {
  if (!submissionPayload.value) return;
  downloadJson(
    buildSubmissionFilename(submissionPayload.value.playerName),
    submissionPayload.value
  );
}

async function handleCopy() {
  if (!submissionPayload.value) return;
  await copyToClipboard(JSON.stringify(submissionPayload.value, null, 2));
  copySuccess.value = true;
  window.setTimeout(() => {
    copySuccess.value = false;
  }, 1800);
}

const canAdvance = computed(() => {
  if (currentStep.value === 1) return Boolean(selectedCharacter.value);
  if (currentStep.value === 2) return Boolean(selectedAdventuringDrive.value);
  if (currentStep.value === 3) return Boolean(selectedCareAbout.value);
  if (currentStep.value === 4) return Boolean(selectedFlaw.value);
  return true;
});
</script>

<template>
  <div class="app-shell">
    <AppHeader
      :title="introContent.title"
      :subtitle="introContent.subtitle"
      :selected-presentation-gender="draft.selectedPresentationGender"
      @update-presentation-gender="setPresentationGender"
    />

    <ProgressStepper :steps="steps" :current-step="currentStep" />

    <div class="app-layout">
      <main class="main-panel">
        <nav class="step-actions step-actions--top">
          <button
            type="button"
            class="ghost-button"
            :disabled="currentStep === 0"
            @click="goBack"
          >
            Back
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            class="primary-button"
            :disabled="!canAdvance"
            @click="goNext"
          >
            Next
          </button>
        </nav>

        <section v-if="currentStep === 0" class="intro-panel">
          <div class="intro-panel__grid">
            <section class="intro-block">
              <h3>Checklist</h3>
              <ol>
                <li v-for="item in introContent.playerDecisionFlow.slice(0, 5)" :key="item">
                  {{ item }}
                </li>
                <li>Save and send it to the DM if needed.</li>
              </ol>
            </section>
            <section class="intro-block">
              <h3>What you are choosing</h3>
              <dl>
                <div v-for="item in introContent.choiceMeaning" :key="item.label">
                  <dt>{{ item.label }}</dt>
                  <dd>{{ item.description }}</dd>
                </div>
              </dl>
            </section>
          </div>
          <section class="intro-note">
            <p>{{ introContent.playerGuidance }}</p>
          </section>
        </section>

        <CardGrid
          v-else-if="currentStep === 1"
          title="Pick your Character/Class"
          description="Choose what you want to do during play. Expand any class to see the bigger portrait, what they do at the table, and some fun play ideas."
        >
          <CharacterCard
            v-for="card in characterCards"
            :key="card.id"
            :card="card"
            :selected="draft.selectedCharacterId === card.id"
            :expanded="expandedCharacterId === card.id"
            :selected-appearance-id="draft.selectedCharacterId === card.id ? draft.selectedCharacterAppearanceId : card.appearanceOptions[0]?.id"
            :preview-appearance-id="draft.selectedPresentationGender"
            @select="chooseCharacter(card.id)"
            @toggle="expandedCharacterId = expandedCharacterId === card.id ? null : card.id"
            @appearance-change="chooseAppearance"
          />
        </CardGrid>

        <CardGrid
          v-else-if="currentStep === 2"
          title="Pick your Adventuring Drive"
          description="This is why your character became an adventurer in the first place."
        >
          <SelectableCard
            v-for="card in adventuringDriveCards"
            :key="card.id"
            :selected="draft.selectedAdventuringDriveId === card.id"
            :expanded="draft.selectedAdventuringDriveId === card.id"
            :show-toggle="false"
            @select="draft.selectedAdventuringDriveId = card.id"
            @toggle="draft.selectedAdventuringDriveId = card.id"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <p class="selectable-card__question"><strong>Question:</strong> {{ card.question }}</p>
          </SelectableCard>
        </CardGrid>

        <CardGrid
          v-else-if="currentStep === 3"
          title="Pick Someone or Something You Care About"
          description="Choose one concrete person, place, object, promise, group, pet, rival, or memory that matters to your character."
        >
          <SelectableCard
            v-for="card in careAboutCards"
            :key="card.id"
            :selected="draft.selectedCareAboutId === card.id"
            :expanded="draft.selectedCareAboutId === card.id"
            :show-toggle="false"
            @select="draft.selectedCareAboutId = card.id"
            @toggle="draft.selectedCareAboutId = card.id"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <p class="selectable-card__question"><strong>Question:</strong> {{ card.question }}</p>
          </SelectableCard>
        </CardGrid>

        <CardGrid
          v-else-if="currentStep === 4"
          title="Pick your Flaw"
          description="Choose a flaw that creates interesting trouble without sabotaging the party."
        >
          <SelectableCard
            v-for="card in flawCards"
            :key="card.id"
            :selected="draft.selectedFlawId === card.id"
            :expanded="draft.selectedFlawId === card.id"
            :show-toggle="false"
            @select="draft.selectedFlawId = card.id"
            @toggle="draft.selectedFlawId = card.id"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <p class="selectable-card__question"><strong>Question:</strong> {{ card.question }}</p>
          </SelectableCard>
        </CardGrid>

        <section v-else class="review-step">
          <ReviewPanel
            v-if="
              selectedCharacter &&
              selectedAppearance &&
              selectedAdventuringDrive &&
              selectedCareAbout &&
              selectedFlaw
            "
            :character="selectedCharacter"
            :appearance="selectedAppearance"
            :adventuring-drive="selectedAdventuringDrive"
            :care-about="selectedCareAbout"
            :flaw="selectedFlaw"
            :player-name="draft.playerName"
            :optional-choices="optionalChoices"
            :selected-optional-question-source="draft.selectedOptionalQuestionSource"
            :optional-answer="draft.optionalAnswer"
            :validation-errors="validationErrors"
            @update-player-name="draft.playerName = $event"
            @update-optional-question-source="chooseOptionalSource"
            @update-optional-answer="draft.optionalAnswer = $event"
          />
          <SaveResult
            :payload="submissionPayload"
            :has-endpoint="hasEndpoint"
            :is-submitting="isSubmitting"
            :submit-success="submitSuccess"
            :submit-success-message="submitSuccessMessage"
            :submit-error="submitError"
            :copy-success="copySuccess"
            @submit="handleSubmit"
            @download="handleDownload"
            @copy="handleCopy"
          />
        </section>
      </main>

      <SelectionSummary
        :character="selectedCharacter"
        :appearance="selectedAppearance"
        :adventuring-drive="selectedAdventuringDrive"
        :care-about="selectedCareAbout"
        :flaw="selectedFlaw"
        :player-name="draft.playerName"
      />
    </div>
  </div>
</template>
