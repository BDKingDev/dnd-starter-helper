<script setup lang="ts">
import type { SubmissionPayload } from "../types";

defineProps<{
  payload: SubmissionPayload | null;
  hasEndpoint: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string;
  copySuccess: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  download: [];
  copy: [];
}>();
</script>

<template>
  <section class="save-result">
    <header>
      <h2>Save your result</h2>
      <p>
        Your draft is already stored on this device. Use the buttons below to send,
        download, or copy your character choices.
      </p>
    </header>

    <div class="save-result__actions">
      <button
        v-if="hasEndpoint"
        type="button"
        class="primary-button"
        :disabled="!payload || isSubmitting"
        @click="emit('submit')"
      >
        {{ isSubmitting ? "Sending..." : "Send to the DM sheet" }}
      </button>
      <button type="button" class="secondary-button" :disabled="!payload" @click="emit('download')">
        Download JSON
      </button>
      <button type="button" class="secondary-button" :disabled="!payload" @click="emit('copy')">
        {{ copySuccess ? "Copied" : "Copy JSON" }}
      </button>
    </div>

    <p v-if="submitSuccess" class="save-result__message is-success">
      Submission sent successfully.
    </p>
    <p v-else-if="submitError" class="save-result__message is-error">
      {{ submitError }} You can still download or copy the JSON and send it to the DM manually.
    </p>
    <p v-else-if="!hasEndpoint" class="save-result__message">
      No online submission endpoint is configured. Download or copy the JSON and send it to the DM.
    </p>

    <pre v-if="payload" class="save-result__preview">{{ JSON.stringify(payload, null, 2) }}</pre>
  </section>
</template>
