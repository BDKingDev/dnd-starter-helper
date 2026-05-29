import type { IntroContent } from "../types";

export const introContent: IntroContent = {
  title: "Rescue One-Shot Character Picker",
  subtitle:
    "Make a few meaningful choices, get a character that already works, and show up ready to play.",
  playerDecisionFlow: [
    "Pick one Character/Class.",
    "Pick one Adventuring Drive.",
    "Pick Someone or Something You Care About.",
    "Pick one Flaw.",
    "Answer one optional question from any card you picked.",
    "Save your result and send it to the DM if needed."
  ],
  choiceMeaning: [
    {
      label: "Character/Class",
      description: "What you do during play."
    },
    {
      label: "Adventuring Drive",
      description: "Why you became an adventurer in the first place."
    },
    {
      label: "Someone or Something You Care About",
      description:
        "One concrete person, place, object, promise, group, pet, rival, or memory that matters to you."
    },
    {
      label: "Flaw",
      description:
        "How you make things complicated in an interesting but party-friendly way."
    }
  ],
  playerGuidance:
    "You do not need a full backstory. Choose what sounds fun and discover the rest during play.",
  dmGuidance: [
    "Everyone has already been hired for the rescue mission. These cards explain who the characters are beyond the job.",
    "Good flaws create tension, comedy, or hard choices without preventing the party from cooperating."
  ]
};
