import type { CharacterAppearanceOption, CharacterCard } from "../types";

const characterAssetRoot = "/assets/characters";

function appearanceSet(classSlug: string): CharacterAppearanceOption[] {
  return [
    {
      id: "female",
      label: "Female",
      tokenImage: `${characterAssetRoot}/${classSlug}-female-token.png`,
      avatarImage: `${characterAssetRoot}/${classSlug}-female-avatar.png`
    },
    {
      id: "male",
      label: "Male",
      tokenImage: `${characterAssetRoot}/${classSlug}-male-token.png`,
      avatarImage: `${characterAssetRoot}/${classSlug}-male-avatar.png`
    }
  ];
}

export const characterCards: CharacterCard[] = [
  {
    id: "barbarian-mara-stonejaw",
    title: "Barbarian",
    className: "Barbarian",
    characterName: "Barbarian",
    raceSpecies: "Half-Orc",
    role: "Frontline bruiser",
    bestFor: "A player who wants simple, direct action.",
    atTheTable:
      "Stand between your friends and danger, rage when things get serious, and solve physical problems boldly.",
    concept:
      "You are a hard-hitting survivor who has lived through ambushes, hard roads, bad weather, and worse people. You may not have fancy training, but when danger appears, everyone is glad you are there.",
    funThingsToDo: [
      "Break a weak door, chain, or barricade.",
      "Carry the captive during an escape.",
      "Intimidate guards by saying very little.",
      "Throw furniture, crates, or enemies.",
      "Take the lead when a fight starts."
    ],
    healingFocusedAddOns: [
      "Start with 2 healing potions instead of 1.",
      "Gain proficiency in Medicine.",
      "Carry the party's healer's kit.",
      "Once per session, when you would drop to 0 hit points, drop to 1 hit point instead.",
      "Optional table rule: you can administer a potion to an adjacent ally as a bonus action once per scene."
    ],
    appearanceOptions: appearanceSet("barbarian")
  },
  {
    id: "bard-pip-goodfellow",
    title: "Bard",
    className: "Bard",
    characterName: "Bard",
    raceSpecies: "Lightfoot Halfling",
    role: "Social expert, support caster, backup healer",
    bestFor:
      "A player who likes jokes, voices, tricks, or talking their way out of trouble.",
    atTheTable:
      "Distract people, inspire allies, talk boldly, and heal someone when things go wrong.",
    concept:
      "You are a traveling performer, storyteller, liar, negotiator, or professional distraction. You are not always the strongest person in the room, but you are often the reason the group gets through the room alive.",
    funThingsToDo: [
      "Distract a guard with flattery, gossip, or a song.",
      "Give Bardic Inspiration before a risky roll.",
      "Convince someone your terrible plan is official.",
      "Cast Healing Word when an ally falls.",
      "Turn a failure into a dramatic performance."
    ],
    healingFocusedAddOns: [
      "Recommended spells: Healing Word, Cure Wounds, Heroism, Sleep, to prevent damage before it happens.",
      "Carry a healer's kit hidden in a prop bag.",
      "Start with one extra healing potion.",
      "Once per scene, your encouragement can grant a small amount of temporary hit points."
    ],
    appearanceOptions: appearanceSet("bard")
  },
  {
    id: "cleric-sister-elian-voss",
    title: "Cleric",
    className: "Cleric",
    characterName: "Cleric",
    raceSpecies: "Human",
    role: "Dedicated healer, protector, moral center",
    bestFor:
      "A player who likes helping others and having clear useful things to do.",
    atTheTable:
      "Bless the group, heal fallen allies, protect vulnerable people, and stand firm when others panic.",
    concept:
      "You are a traveling priest, shrine-keeper, battlefield medic, or servant of a sacred calling. Your faith may be gentle or stern, but it gives you the courage to walk into danger.",
    funThingsToDo: [
      "Cast Bless before a dangerous scene.",
      "Use Healing Word when someone drops.",
      "Calm frightened civilians.",
      "Rebuke cruel guards or corrupt officials.",
      "Use Guidance before important checks."
    ],
    healingFocusedAddOns: [
      "Recommended spells: Healing Word, Cure Wounds, Bless, Sanctuary, Shield of Faith, Spare the Dying.",
      "Start with one extra healing potion to give away.",
      "Your holy symbol lets you cast Spare the Dying at range.",
      "Gain advantage on checks to identify poison, disease, or injury."
    ],
    appearanceOptions: appearanceSet("cleric")
  },
  {
    id: "druid-rowan-briarstep",
    title: "Druid",
    className: "Druid",
    characterName: "Druid",
    raceSpecies: "Wood Elf",
    role: "Nature magic, healing, scouting, battlefield control",
    bestFor:
      "A creative player who likes animals, plants, and environmental problem-solving.",
    atTheTable:
      "Read the land, use nature as a tool, heal allies, and control the battlefield.",
    concept:
      "You are a wandering herbalist, wild guardian, omen-reader, or keeper of old roads and hidden places. You understand that cities have laws, but the world has older rules.",
    funThingsToDo: [
      "Find useful herbs, tracks, water, or hidden paths.",
      "Speak gently to animals or suspicious villagers.",
      "Restrain enemies with vines, roots, or terrain.",
      "Heal allies with natural magic.",
      "Scout carefully before the group commits."
    ],
    healingFocusedAddOns: [
      "Recommended spells: Cure Wounds, Healing Word, Goodberry, Entangle, Faerie Fire.",
      "Begin with 10 goodberries already prepared.",
      "Carry an herbalism kit.",
      "During a short rest, make one healing salve."
    ],
    appearanceOptions: appearanceSet("druid")
  },
  {
    id: "fighter-garrick-vale",
    title: "Fighter",
    className: "Fighter",
    characterName: "Fighter",
    raceSpecies: "Mountain Dwarf",
    role: "Reliable weapon expert",
    bestFor: "A player who wants straightforward heroic action.",
    atTheTable:
      "Protect the group, hold the line, hit reliably, and use your practical experience.",
    concept:
      "You are a trained guard, soldier, duelist, bodyguard, or veteran of dangerous work. You understand weapons, armor, tactics, and the difference between courage and stupidity.",
    funThingsToDo: [
      "Challenge enemy soldiers.",
      "Protect spellcasters and wounded allies.",
      "Notice suspicious guard routines.",
      "Use Second Wind to stay standing.",
      "Hold a doorway while others escape."
    ],
    healingFocusedAddOns: [
      "Gain proficiency in Medicine.",
      "Carry the party's healer's kit.",
      "Start with 2 healing potions instead of 1.",
      "Once per session, use Second Wind on an adjacent ally instead of yourself.",
      "Once per scene, reduce damage dealt to a nearby ally."
    ],
    appearanceOptions: appearanceSet("fighter")
  },
  {
    id: "monk-lio-swiftwater",
    title: "Monk",
    className: "Monk",
    characterName: "Monk",
    raceSpecies: "High Elf",
    role: "Fast striker, scout, stunt character",
    bestFor: "A player who wants movement, agility, and cinematic action.",
    atTheTable:
      "Move quickly, get to the important place first, and solve problems with speed and discipline.",
    concept:
      "You are a disciplined wanderer trained by a monastery, messenger order, fighting school, or secret tradition. You need little equipment because your body and focus are your tools.",
    funThingsToDo: [
      "Run across rooftops, carts, or narrow walls.",
      "Reach an alarm bell before anyone rings it.",
      "Snatch a key from a table.",
      "Dash through a closing gate.",
      "Knock a weapon from someone's hand."
    ],
    healingFocusedAddOns: [
      "Start with 2 healing potions.",
      "Gain proficiency in Medicine.",
      "Carry a healer's kit.",
      "Once per session, touch a creature at 0 hit points to restore 1 hit point.",
      "Optional table rule: administer a potion as a bonus action once per scene."
    ],
    appearanceOptions: appearanceSet("monk")
  },
  {
    id: "paladin-dame-corin-ashford",
    title: "Paladin",
    className: "Paladin",
    characterName: "Paladin",
    raceSpecies: "Human",
    role: "Protector, emergency healer, honorable warrior",
    bestFor: "A player who wants to feel like a classic fantasy hero.",
    atTheTable:
      "Protect allies, stand up to villains, heal in emergencies, and make bold moral choices.",
    concept:
      "You are a sworn champion, knight, oathkeeper, holy warrior, or defender of a cause. Your strength comes from conviction as much as training.",
    funThingsToDo: [
      "Stand between the captive and enemies.",
      "Use Lay on Hands to heal someone.",
      "Demand surrender from villains.",
      "Smite a dangerous foe.",
      "Detect evil, corruption, or supernatural danger."
    ],
    healingFocusedAddOns: [
      "Default healing: Lay on Hands.",
      "Recommended spells: Cure Wounds, Bless, Shield of Faith, Heroism.",
      "Increase your Lay on Hands pool slightly for this one-shot.",
      "Carry one holy bandage that automatically stabilizes a creature.",
      "Once per session, take damage in place of an adjacent ally."
    ],
    appearanceOptions: appearanceSet("paladin")
  },
  {
    id: "ranger-nessa-thorn",
    title: "Ranger",
    className: "Ranger",
    characterName: "Ranger",
    raceSpecies: "Human",
    role: "Scout, tracker, archer, backup healer",
    bestFor: "A player who likes wilderness skills and ranged combat.",
    atTheTable:
      "Spot danger early, track enemies, attack from range, and patch people up after trouble.",
    concept:
      "You are a border scout, monster hunter, pathfinder, bounty tracker, or wilderness guide. You notice what others miss and know that every creature leaves a trail.",
    funThingsToDo: [
      "Spot an ambush early.",
      "Track patrols, footprints, or wagon marks.",
      "Shoot ropes, lanterns, or alarm bells.",
      "Find hidden paths.",
      "Calm animals or read their behavior."
    ],
    healingFocusedAddOns: [
      "Recommended spells: Cure Wounds, Goodberry, if available, Hunter's Mark, if the player wants more offense instead.",
      "Carry a pouch of healing herbs.",
      "Gain proficiency with an herbalism kit.",
      "Identify safe food, poison, tracks, and natural remedies."
    ],
    appearanceOptions: appearanceSet("ranger")
  },
  {
    id: "rogue-silas-crow",
    title: "Rogue",
    className: "Rogue",
    characterName: "Rogue",
    raceSpecies: "Half-Elf (Wood)",
    role: "Sneak, lockpicker, infiltrator",
    bestFor:
      "A player who wants to be clever, sneaky, and useful during the heist.",
    atTheTable:
      "Look for locks, traps, shadows, shortcuts, and opportunities no one else sees.",
    concept:
      "You are a former thief, spy, locksmith, informant, scout, or \"independent security consultant.\" You know that most rules are just locks waiting for the right tool.",
    funThingsToDo: [
      "Pick the cell lock.",
      "Copy or steal a key.",
      "Sneak through a guardroom.",
      "Disable an alarm.",
      "Use Sneak Attack when an ally distracts an enemy."
    ],
    healingFocusedAddOns: [
      "Gain proficiency in Medicine.",
      "Carry a healer's kit.",
      "Start with 2 healing potions.",
      "Carry a stolen physician's satchel with 3 uses.",
      "Optional table rule: administer potions as a bonus action once per scene."
    ],
    appearanceOptions: appearanceSet("rogue")
  },
  {
    id: "sorcerer-mira-vey",
    title: "Sorcerer",
    className: "Sorcerer",
    characterName: "Sorcerer",
    raceSpecies: "Abyssal Tiefling",
    role: "Flashy magic, deception, burst damage",
    bestFor: "A player who wants instinctive magic and dramatic moments.",
    atTheTable:
      "Use magic boldly, create distractions, blast threats, and bend reality when plans fail.",
    concept:
      "Your magic comes from bloodline, accident, blessing, curse, storm, dream, or raw talent. You did not study power from a book. Power found you.",
    funThingsToDo: [
      "Create magical distractions.",
      "Blast clustered enemies.",
      "Use illusions or minor magic to support a disguise.",
      "Burn through ropes, barricades, or documents.",
      "Make a dramatic entrance while glowing slightly."
    ],
    healingFocusedAddOns: [
      "Use a divine-touched version and add Healing Word or Cure Wounds.",
      "Carry a once-per-day healing charm.",
      "Start with 2 healing potions.",
      "Gain proficiency in Medicine.",
      "Spend a spell slot to stabilize a creature at range as a custom beginner-friendly feature."
    ],
    appearanceOptions: appearanceSet("sorcerer")
  },
  {
    id: "warlock-orin-blackglass",
    title: "Warlock",
    className: "Warlock",
    characterName: "Warlock",
    raceSpecies: "Half-Elf (High)",
    role: "Strange magic, social tension, ranged damage",
    bestFor: "A player who wants mystery, bargains, and weird powers.",
    atTheTable:
      "Use unsettling magic, ask strange questions, and make powerful things nervous.",
    concept:
      "You made a pact, bargain, promise, mistake, or discovery that connected you to something beyond the ordinary world. Your magic always feels like it has a shadow.",
    funThingsToDo: [
      "Blast enemies from a distance.",
      "Ask your patron for unsettling clues.",
      "Frighten or manipulate guards.",
      "Recognize occult symbols.",
      "Turn a simple situation into a supernatural one."
    ],
    healingFocusedAddOns: [
      "Choose a benevolent or celestial patron.",
      "Gain a once-per-short-rest healing pulse.",
      "Add Cure Wounds as a patron spell.",
      "Carry a mirror shard, charm, or token that stabilizes one dying creature per day.",
      "Start with 2 healing potions."
    ],
    appearanceOptions: appearanceSet("warlock")
  },
  {
    id: "wizard-theo-quill",
    title: "Wizard",
    className: "Wizard",
    characterName: "Wizard",
    raceSpecies: "Forest Gnome",
    role: "Planner, utility caster, puzzle-solver",
    bestFor: "A player who likes thinking, clues, and clever spell use.",
    atTheTable:
      "Use knowledge, maps, utility magic, and careful planning to solve problems.",
    concept:
      "You are a scholar, apprentice mage, map-reader, ritualist, or collector of dangerous knowledge. You may not be the toughest adventurer, but you often know which detail matters.",
    funThingsToDo: [
      "Use Mage Hand to grab keys.",
      "Put weak enemies to sleep.",
      "Identify old symbols, ruins, laws, or magical effects.",
      "Find hidden rooms.",
      "Use illusions to distract guards."
    ],
    healingFocusedAddOns: [
      "Carry a scroll of Cure Wounds.",
      "Start with 2 healing potions.",
      "Gain proficiency in Medicine.",
      "Carry an alchemical field kit with 2 healing draughts.",
      "Once per day, use Emergency Stitching to restore 1 hit point to a creature at 0 hit points."
    ],
    appearanceOptions: appearanceSet("wizard")
  },
  {
    id: "artificer-tessa-cog",
    title: "Artificer",
    className: "Artificer",
    characterName: "Artificer",
    raceSpecies: "Rock Gnome",
    role: "Gadgeteer, lock expert, backup healer",
    bestFor: "A player who likes inventions, tools, and practical problem-solving.",
    atTheTable:
      "Use tools, gadgets, quick repairs, and practical magic to make plans work.",
    concept:
      "You are a locksmith, alchemist, inventor, engineer, trapbreaker, or magical craftsperson. Your solutions usually involve tools, sparks, labels, and one safety warning no one reads.",
    funThingsToDo: [
      "Copy a key.",
      "Jam an alarm bell.",
      "Create a fake seal or document.",
      "Repair broken gear.",
      "Heal someone with a gadget.",
      "Turn a random object into a useful device."
    ],
    healingFocusedAddOns: [
      "Recommended spells: Cure Wounds, Faerie Fire, Mending, Mage Hand.",
      "Carry a clockwork syringe that casts Cure Wounds once per day.",
      "Gain alchemist's supplies.",
      "Once per session, convert a found object into a single-use healing gadget."
    ],
    appearanceOptions: appearanceSet("artificer")
  }
];
