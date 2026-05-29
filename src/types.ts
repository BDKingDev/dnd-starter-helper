export interface CharacterAppearanceOption {
  id: CharacterAppearanceId;
  label: string;
  tokenImage: string;
  avatarImage: string;
}

export type CharacterAppearanceId = "female" | "male";

export interface CharacterCard {
  id: string;
  title: string;
  className: string;
  characterName: string;
  raceSpecies: string;
  role: string;
  bestFor: string;
  atTheTable: string;
  concept: string;
  funThingsToDo: string[];
  healingFocusedAddOns: string[];
  appearanceOptions: CharacterAppearanceOption[];
}

export interface CharacterSubmissionCard {
  id: string;
  title: string;
  className: string;
  characterName: string;
  role: string;
  bestFor: string;
  atTheTable: string;
  concept: string;
  funThingsToDo: string[];
  healingFocusedAddOns: string[];
  tokenImage: string;
  avatarImage: string;
}

export interface AdventuringDriveCard {
  id: string;
  title: string;
  description: string;
  question: string;
}

export interface CareAboutCard {
  id: string;
  title: string;
  description: string;
  question: string;
}

export interface FlawCard {
  id: string;
  title: string;
  description: string;
  question: string;
}

export type OptionalQuestionSource =
  | "character"
  | "adventuringDrive"
  | "careAbout"
  | "flaw"
  | null;

export interface DraftState {
  playerName: string;
  selectedCharacterId: string | null;
  selectedCharacterAppearanceId: string | null;
  selectedPresentationGender: CharacterAppearanceId;
  selectedAdventuringDriveId: string | null;
  selectedCareAboutId: string | null;
  selectedFlawId: string | null;
  selectedOptionalQuestionSource: OptionalQuestionSource;
  optionalAnswer: string;
}

export interface SubmissionPayload {
  playerName: string;
  submittedAt: string;
  character: CharacterSubmissionCard;
  adventuringDrive: AdventuringDriveCard;
  careAbout: CareAboutCard;
  flaw: FlawCard;
  optionalAnswer: string;
}

export interface IntroContent {
  title: string;
  subtitle: string;
  playerDecisionFlow: string[];
  choiceMeaning: Array<{
    label: string;
    description: string;
  }>;
  playerGuidance: string;
  dmGuidance: string[];
}

export interface OptionalQuestionChoice {
  source: Exclude<OptionalQuestionSource, null>;
  title: string;
  question: string;
}
