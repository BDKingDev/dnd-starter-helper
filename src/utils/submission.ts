import type {
  AdventuringDriveCard,
  CareAboutCard,
  CharacterAppearanceOption,
  CharacterCard,
  CharacterSubmissionCard,
  FlawCard,
  OptionalQuestionChoice,
  SubmissionPayload
} from "../types";
import { slugify } from "./slugify";

export type SubmissionResult = "verified" | "opaque";
interface SubmissionNetworkPayload extends SubmissionPayload {
  submissionToken?: string;
}

export function flattenCharacterForSubmission(
  character: CharacterCard,
  appearance: CharacterAppearanceOption,
  characterName?: string
): CharacterSubmissionCard {
  return {
    id: character.id,
    title: character.title,
    className: character.className,
    characterName: characterName?.trim() || character.characterName,
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
  characterName: string;
  character: CharacterCard;
  appearance: CharacterAppearanceOption;
  adventuringDrive: AdventuringDriveCard;
  careAbout: CareAboutCard;
  flaw: FlawCard;
  optionalQuestion: OptionalQuestionChoice | null;
  optionalAnswer: string;
}): SubmissionPayload {
  return {
    playerName: input.playerName.trim(),
    submittedAt: new Date().toISOString(),
    character: flattenCharacterForSubmission(
      input.character,
      input.appearance,
      input.characterName
    ),
    adventuringDrive: input.adventuringDrive,
    careAbout: input.careAbout,
    flaw: input.flaw,
    optionalQuestion: input.optionalQuestion,
    optionalAnswer: input.optionalAnswer.trim()
  };
}

export async function submitPayload(
  endpoint: string,
  payload: SubmissionPayload,
  submissionToken?: string
): Promise<SubmissionResult> {
  const networkPayload = buildNetworkPayload(payload, submissionToken);

  if (isGoogleAppsScriptEndpoint(endpoint)) {
    // Apps Script web apps do not provide a browser-readable CORS response for
    // cross-origin fetches, so use a simple no-cors request and treat it as a
    // fire-and-forget submission path.
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(networkPayload)
    });

    return "opaque";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(networkPayload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return "verified";
}

export function buildSubmissionFilename(playerName: string): string {
  const safeName = slugify(playerName) || "player";
  const date = new Date().toISOString().slice(0, 10);
  return `${safeName}-character-choice-${date}.json`;
}

function isGoogleAppsScriptEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return (
      url.hostname === "script.google.com" ||
      url.hostname.endsWith(".script.google.com") ||
      url.hostname === "script.googleusercontent.com" ||
      url.hostname.endsWith(".script.googleusercontent.com")
    );
  } catch {
    return false;
  }
}

function buildNetworkPayload(
  payload: SubmissionPayload,
  submissionToken?: string
): SubmissionNetworkPayload {
  if (!submissionToken?.trim()) {
    return payload;
  }

  return {
    ...payload,
    submissionToken: submissionToken.trim()
  };
}
