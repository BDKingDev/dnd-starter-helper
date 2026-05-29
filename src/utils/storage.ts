import type { DraftState } from "../types";

const STORAGE_KEY = "dnd-starter-helper-draft";

export function saveDraft(draft: DraftState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadDraft(): DraftState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DraftState;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}
