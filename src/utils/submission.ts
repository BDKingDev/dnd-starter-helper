import type {
  AdventuringDriveCard,
  CareAboutCard,
  CharacterAppearanceOption,
  CharacterCard,
  CharacterSubmissionCard,
  FlawCard,
  SubmissionPayload
} from "../types";
import { slugify } from "./slugify";

export function flattenCharacterForSubmission(
  character: CharacterCard,
  appearance: CharacterAppearanceOption
): CharacterSubmissionCard {
  return {
    id: character.id,
    title: character.title,
    className: character.className,
    characterName: character.characterName,
    role: character.role,
    bestFor: character.bestFor,
    atTheTable: character.atTheTable,
    concept: character.concept,
    funThingsToDo: [...character.funThingsToDo],
    healingFocusedAddOns: [...character.healingFocusedAddOns],
    tokenImage: appearance.tokenImage,
    avatarImage: appearance.avatarImage
  };
}

export function buildSubmissionPayload(input: {
  playerName: string;
  character: CharacterCard;
  appearance: CharacterAppearanceOption;
  adventuringDrive: AdventuringDriveCard;
  careAbout: CareAboutCard;
  flaw: FlawCard;
  optionalAnswer: string;
}): SubmissionPayload {
  return {
    playerName: input.playerName.trim(),
    submittedAt: new Date().toISOString(),
    character: flattenCharacterForSubmission(input.character, input.appearance),
    adventuringDrive: input.adventuringDrive,
    careAbout: input.careAbout,
    flaw: input.flaw,
    optionalAnswer: input.optionalAnswer.trim()
  };
}

export async function submitPayload(
  endpoint: string,
  payload: SubmissionPayload
): Promise<void> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
}

export function buildSubmissionFilename(playerName: string): string {
  const safeName = slugify(playerName) || "player";
  const date = new Date().toISOString().slice(0, 10);
  return `${safeName}-character-choice-${date}.json`;
}
