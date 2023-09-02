import { Ageless } from "../data";

export const Pantheon: Ageless[] = [
  {
    name: "Chitai",
    epithet: "the Perfected Form",
    associates: [],
    enemies: [],
    gifts: [
      {
        name: "Stability",
        description: "The Ageless grants you additional stability.",
        minFavor: 0,
        maxFavor: 100,
        function: "increaseAttr",
        args: ["stability", "2", "4"],
        canHaveMultiple: true,
      },
      {
        name: "Perfected Appendage",
        description:
          "A limb is replaced by a perfect geometric form of marble.  Makes you durable, but unable to equip any items on it",
        minFavor: -20,
        maxFavor: 80,
        function: "perfectedAppendage",
        args: [],
        canHaveMultiple: true,
      },
      {
        name: "Nothing",
        description:
          "You feel theit amusement as they simply remove their presence, leaving you nothing in return. Perhaps you offended them in some way?",
        minFavor: -100,
        maxFavor: 0,
        function: "nothing",
        args: [],
        canHaveMultiple: true,
      },
    ],
  },
  {
    name: "Enchan",
    epithet: "the Shadow Haven",
    associates: ["Lamalesain"],
    enemies: ["Nim Ling Xia"],
    gifts: [
      {
        name: "Agility",
        description: "The Ageless grants you additional agility.",
        minFavor: 0,
        maxFavor: 100,
        function: "increaseAttr",
        args: ["agility", "2", "4"],
        canHaveMultiple: true,
      },
      {
        name: "Shadow Slip",
        description:
          "Enchan gifts you the ability to become as intangible as shadow, slipping through cracks, passing through solid stone",
        minFavor: 25,
        maxFavor: 100,
        function: "shadowSlip",
        args: [],
        canHaveMultiple: false,
      },
      {
        name: "Nothing",
        description:
          "You feel theit amusement as they simply remove their presence, leaving you nothing in return. Perhaps you offended them in some way?",
        minFavor: -100,
        maxFavor: 0,
        function: "nothing",
        args: [],
        canHaveMultiple: true,
      },
    ],
  },
  {
    name: "Nim Ling Xia",
    epithet: "the Hungering Maw",
    associates: ["Ambikanghou"],
    enemies: ["Enchan"],
    gifts: [
      {
        name: "Might",
        description: "The Ageless grants you additional might.",
        minFavor: 0,
        maxFavor: 100,
        function: "increaseAttr",
        args: ["might", "2", "4"],
        canHaveMultiple: true,
      },
      {
        name: "Hunger",
        description:
          "Your body will randomly spawn a mouth that will consume a piece of your equipment.  Your body will be purified in the process",
        minFavor: -25,
        maxFavor: 75,
        function: "hunger",
        args: [],
        canHaveMultiple: false,
      },
      {
        name: "Nothing",
        description:
          "You feel theit amusement as they simply remove their presence, leaving you nothing in return. Perhaps you offended them in some way?",
        minFavor: -100,
        maxFavor: 0,
        function: "nothing",
        args: [],
        canHaveMultiple: true,
      },
    ],
  },
  {
    name: "Ambikanghou",
    epithet: "the Mass of Tendrils",
    associates: ["Nim Ling Xia"],
    enemies: ["Lamalesain"],
    gifts: [
      {
        name: "Might",
        description: "The Ageless grants you additional might.",
        minFavor: 0,
        maxFavor: 100,
        function: "increaseAttr",
        args: ["might", "2", "4"],
        canHaveMultiple: true,
      },
      {
        name: "Tendrils",
        description: "",
        minFavor: 25,
        maxFavor: 100,
        function: "tendrils",
        args: [],
        canHaveMultiple: true,
      },
      {
        name: "Nothing",
        description:
          "You feel theit amusement as they simply remove their presence, leaving you nothing in return. Perhaps you offended them in some way?",
        minFavor: -100,
        maxFavor: 0,
        function: "nothing",
        args: [],
        canHaveMultiple: true,
      },
    ],
  },
  {
    name: "Lamalesain",
    epithet: "the Proselytic Whisper",
    associates: ["Enchan"],
    enemies: ["Ambikanghou"],
    gifts: [
      {
        name: "Intellect",
        description: "The Ageless grants you additional intellect.",
        minFavor: 0,
        maxFavor: 100,
        function: "increaseAttr",
        args: ["intellect", "2", "4"],
        canHaveMultiple: true,
      },
      {
        name: "Puppeteer",
        description:
          "Lamalesain gives you the ability to transfer your consciousness into another's, abandoning your body for theirs",
        minFavor: 25,
        maxFavor: 100,
        function: "puppeteer",
        args: [],
        canHaveMultiple: false,
      },
      {
        name: "Nothing",
        description:
          "You feel theit amusement as they simply remove their presence, leaving you nothing in return. Perhaps you offended them in some way?",
        minFavor: -100,
        maxFavor: 0,
        function: "nothing",
        args: [],
        canHaveMultiple: true,
      },
    ],
  },
];
