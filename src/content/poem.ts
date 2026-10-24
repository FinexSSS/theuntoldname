/**
 * নিশিপদ্ম — the poem. Ten pages, each one breath, one image.
 * Content is data so the interface can be rebuilt without rewriting the poem.
 */

export type PoemPageId =
  | "darkness"
  | "path"
  | "lamp"
  | "window"
  | "name"
  | "gratitude"
  | "sky"
  | "light"
  | "reflection"
  | "final";

export type PoemPage = {
  id: PoemPageId;
  numeral: string;
  title: string;
  lines: string[];
};

export const POEM_PAGES: PoemPage[] = [
  {
    id: "darkness",
    numeral: "১",
    title: "অন্ধকারেরও ভেতর",
    lines: [
      "একটা সময় সন্ধ্যাগুলো",
      "খুব তাড়াতাড়ি নেমে আসত,",
      "শহর জ্বলে উঠত—",
      "আমার ভেতরটা",
      "আরও একটু নিভে যেত।",
    ],
  },
  {
    id: "path",
    numeral: "২",
    title: "পথ",
    lines: [
      "পথ ছিল,",
      "দিশা ছিল না।",
      "",
      "জানালা ছিল,",
      "জোছনা ছিল না।",
      "",
      "কিছু রাত",
      "শুধু কেটে যায় না—",
      "মানুষকে একটু একটু করে",
      "বদলে দেয়।",
    ],
  },
  {
    id: "lamp",
    numeral: "৩",
    title: "অচেনা আলো",
    lines: [
      "সেই সময়",
      "কথা খুব বেশি হয়নি,",
      "",
      "তবু কিছু আলফাজ",
      "নিঃশব্দে এসে",
      "পাশে বসেছিল।",
      "",
      "যেন ভাটার জলের ঘাটে",
      "কেউ রেখে গেছে",
      "একটি জ্বলা প্রদীপ।",
    ],
  },
  {
    id: "window",
    numeral: "৪",
    title: "রেশ",
    lines: [
      "আপনি হয়তো জানেন না,",
      "",
      "কিছু কথা",
      "কথা হয়ে থাকে না—",
      "",
      "দিন ফুরোলেও",
      "তাদের রেশ",
      "জানালার কাঁচে",
      "আলো হয়ে লেগে থাকে।",
    ],
  },
  {
    id: "name",
    numeral: "৫",
    title: "নাম",
    lines: [
      "তাই নামের ভিড়ে",
      "একটি নাম আলাদা করে রাখলাম।",
      "",
      "নিশি—",
      "যেখানে সব শব্দ ধীরে যায়।",
      "",
      "পদ্ম—",
      "যে অন্ধকারের জল ঠেলে",
      "আলোয় মুখ তোলে।",
      "",
      "নিশিপদ্ম।",
    ],
  },
  {
    id: "gratitude",
    numeral: "৬",
    title: "নীরবতার পাতা",
    lines: [
      "সব ঋণ",
      "ফেরত দিতে হয় না।",
      "",
      "কিছু কৃতজ্ঞতা",
      "শুধু নীরব থাকে,",
      "",
      "কোনো পুরোনো গানের মতো",
      "মাঝে মাঝে ফিরে আসে",
      "অকারণেই।",
    ],
  },
  {
    id: "sky",
    numeral: "৭",
    title: "আপনার আকাশ",
    lines: [
      "এবার আপনার আকাশের কথা থাক।",
      "",
      "যে স্বপ্নগুলো",
      "এখনও নাম পায়নি,",
      "",
      "তাদের জন্য",
      "দিগন্ত একটু ফাঁকা থাকুক।",
      "",
      "যে পথগুলো কঠিন—",
      "সেগুলোতেই",
      "আপনার পায়ের শব্দ",
      "শুনতে থাকুক ভোর।",
    ],
  },
  {
    id: "light",
    numeral: "৮",
    title: "আলো",
    lines: [
      "সব আলো",
      "সূর্যের হতে হয় না।",
      "",
      "কিছু আলো",
      "একটি মানুষের কথায় থাকে,",
      "",
      "কিছু আলো",
      "একটি অসমাপ্ত সাহসে,",
      "",
      "আর কিছু আলো",
      "শুধু মনে পড়লে",
      "জ্বলে ওঠে।",
    ],
  },
  {
    id: "reflection",
    numeral: "৯",
    title: "শেষ নয়",
    lines: [
      "রাত শেষ হলে",
      "পদ্মটাকে আর দেখা যায় না।",
      "",
      "তাই বলে",
      "সে কি ডুবে যায়?",
      "",
      "হয়তো কিছু সৌন্দর্য",
      "দেখার জন্য নয়—",
      "",
      "শুধু মনে রাখার জন্য।",
    ],
  },
  {
    id: "final",
    numeral: "১০",
    title: "নিশিপদ্ম",
    lines: [
      "যদি কোনোদিন",
      "নিজের পথটাই",
      "আবছা লাগে,",
      "",
      "আকাশের দিকে তাকাবেন না।",
      "",
      "জলের দিকে তাকাবেন।",
      "",
      "অন্ধকারের বুকেও",
      "কখনও কখনও",
      "একটি ফুল",
      "নিজের আলোয় ফুটে থাকে।",
      "",
      "নিশিপদ্ম।",
    ],
  },
];

export function poemPage(id: PoemPageId): PoemPage {
  return POEM_PAGES.find((p) => p.id === id)!;
}

/** Words that make the page itself respond. No tooltips. */
export type LiveWord = "আলো" | "রেশ" | "নিশি" | "পদ্ম" | "প্রদীপ" | "দিশা" | "নীরবতা" | "জোছনা";

export type FxKind = "glow" | "warm-horizon" | "lamp" | "star" | "hush" | "lake-lamp";

export const WORD_FX: Record<LiveWord, FxKind> = {
  আলো: "glow",
  রেশ: "warm-horizon",
  নিশি: "hush",
  পদ্ম: "lake-lamp",
  প্রদীপ: "lamp",
  দিশা: "star",
  নীরবতা: "hush",
  জোছনা: "star",
};

export const LIVE_WORDS = Object.keys(WORD_FX) as LiveWord[];

/** The five lights of page VIII. */
export const LIGHTS = [
  { id: "kotha", word: "কথা" },
  { id: "sahos", word: "সাহস" },
  { id: "smriti", word: "স্মৃতি" },
  { id: "asha", word: "আশা" },
  { id: "nirobota", word: "নীরবতা" },
] as const;

export type LightId = (typeof LIGHTS)[number]["id"];
