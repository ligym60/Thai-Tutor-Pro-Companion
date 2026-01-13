export interface VocabularyWord {
  id: string;
  thai: string;
  romanization: string;
  english: string;
  category:
    | "greetings"
    | "numbers"
    | "food"
    | "travel"
    | "basics"
    | "phrases"
    | "time";
  difficulty: "beginner" | "intermediate" | "advanced";
  exampleSentence?: {
    thai: string;
    romanization: string;
    english: string;
  };
}

export const VOCABULARY: VocabularyWord[] = [
  {
    id: "v1",
    thai: "สวัสดี",
    romanization: "sa-wat-dee",
    english: "Hello / Goodbye",
    category: "greetings",
    difficulty: "beginner",
    exampleSentence: {
      thai: "สวัสดีครับ คุณสบายดีไหม",
      romanization: "sa-wat-dee khrap, khun sa-bai dee mai",
      english: "Hello, how are you?",
    },
  },
  {
    id: "v2",
    thai: "ขอบคุณ",
    romanization: "khawp-khun",
    english: "Thank you",
    category: "greetings",
    difficulty: "beginner",
    exampleSentence: {
      thai: "ขอบคุณมากครับ",
      romanization: "khawp-khun maak khrap",
      english: "Thank you very much",
    },
  },
  {
    id: "v3",
    thai: "ไม่เป็นไร",
    romanization: "mai-pen-rai",
    english: "No problem / Never mind",
    category: "greetings",
    difficulty: "beginner",
  },
  {
    id: "v4",
    thai: "ใช่",
    romanization: "chai",
    english: "Yes",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v5",
    thai: "ไม่",
    romanization: "mai",
    english: "No / Not",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v6",
    thai: "ครับ",
    romanization: "khrap",
    english: "Polite particle (male)",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v7",
    thai: "ค่ะ",
    romanization: "kha",
    english: "Polite particle (female)",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v8",
    thai: "หนึ่ง",
    romanization: "neung",
    english: "One (1)",
    category: "numbers",
    difficulty: "beginner",
  },
  {
    id: "v9",
    thai: "สอง",
    romanization: "sawng",
    english: "Two (2)",
    category: "numbers",
    difficulty: "beginner",
  },
  {
    id: "v10",
    thai: "สาม",
    romanization: "saam",
    english: "Three (3)",
    category: "numbers",
    difficulty: "beginner",
  },
  {
    id: "v11",
    thai: "สี่",
    romanization: "see",
    english: "Four (4)",
    category: "numbers",
    difficulty: "beginner",
  },
  {
    id: "v12",
    thai: "ห้า",
    romanization: "haa",
    english: "Five (5)",
    category: "numbers",
    difficulty: "beginner",
  },
  {
    id: "v13",
    thai: "อร่อย",
    romanization: "a-roi",
    english: "Delicious",
    category: "food",
    difficulty: "beginner",
    exampleSentence: {
      thai: "อาหารนี้อร่อยมาก",
      romanization: "aa-haan nee a-roi maak",
      english: "This food is very delicious",
    },
  },
  {
    id: "v14",
    thai: "น้ำ",
    romanization: "naam",
    english: "Water",
    category: "food",
    difficulty: "beginner",
  },
  {
    id: "v15",
    thai: "ข้าว",
    romanization: "khaao",
    english: "Rice",
    category: "food",
    difficulty: "beginner",
  },
  {
    id: "v16",
    thai: "เผ็ด",
    romanization: "phet",
    english: "Spicy",
    category: "food",
    difficulty: "beginner",
    exampleSentence: {
      thai: "ไม่เผ็ดนะครับ",
      romanization: "mai phet na khrap",
      english: "Not spicy please",
    },
  },
  {
    id: "v17",
    thai: "ไปไหน",
    romanization: "bpai nai",
    english: "Where are you going?",
    category: "travel",
    difficulty: "beginner",
  },
  {
    id: "v18",
    thai: "ที่นี่",
    romanization: "thee-nee",
    english: "Here",
    category: "travel",
    difficulty: "beginner",
  },
  {
    id: "v19",
    thai: "ที่นั่น",
    romanization: "thee-nan",
    english: "There",
    category: "travel",
    difficulty: "beginner",
  },
  {
    id: "v20",
    thai: "เท่าไหร่",
    romanization: "thao-rai",
    english: "How much?",
    category: "phrases",
    difficulty: "beginner",
    exampleSentence: {
      thai: "อันนี้เท่าไหร่ครับ",
      romanization: "an-nee thao-rai khrap",
      english: "How much is this?",
    },
  },
  {
    id: "v21",
    thai: "แพง",
    romanization: "phaeng",
    english: "Expensive",
    category: "phrases",
    difficulty: "beginner",
  },
  {
    id: "v22",
    thai: "ถูก",
    romanization: "thuuk",
    english: "Cheap",
    category: "phrases",
    difficulty: "beginner",
  },
  {
    id: "v23",
    thai: "วันนี้",
    romanization: "wan-nee",
    english: "Today",
    category: "time",
    difficulty: "beginner",
  },
  {
    id: "v24",
    thai: "พรุ่งนี้",
    romanization: "phroong-nee",
    english: "Tomorrow",
    category: "time",
    difficulty: "beginner",
  },
  {
    id: "v25",
    thai: "เมื่อวาน",
    romanization: "meua-waan",
    english: "Yesterday",
    category: "time",
    difficulty: "beginner",
  },
  {
    id: "v26",
    thai: "ผม",
    romanization: "phom",
    english: "I (male)",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v27",
    thai: "ดิฉัน",
    romanization: "di-chan",
    english: "I (female, formal)",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v28",
    thai: "คุณ",
    romanization: "khun",
    english: "You (polite)",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v29",
    thai: "รัก",
    romanization: "rak",
    english: "Love",
    category: "phrases",
    difficulty: "intermediate",
    exampleSentence: {
      thai: "ผมรักคุณ",
      romanization: "phom rak khun",
      english: "I love you",
    },
  },
  {
    id: "v30",
    thai: "สบายดี",
    romanization: "sa-bai-dee",
    english: "I'm fine / Feeling good",
    category: "greetings",
    difficulty: "beginner",
  },
  {
    id: "v31",
    thai: "ร้อน",
    romanization: "rawn",
    english: "Hot",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v32",
    thai: "เย็น",
    romanization: "yen",
    english: "Cold / Cool",
    category: "basics",
    difficulty: "beginner",
  },
  {
    id: "v33",
    thai: "สวย",
    romanization: "suay",
    english: "Beautiful",
    category: "phrases",
    difficulty: "beginner",
  },
  {
    id: "v34",
    thai: "หล่อ",
    romanization: "law",
    english: "Handsome",
    category: "phrases",
    difficulty: "beginner",
  },
  {
    id: "v35",
    thai: "กิน",
    romanization: "gin",
    english: "Eat",
    category: "food",
    difficulty: "beginner",
    exampleSentence: {
      thai: "กินข้าวหรือยัง",
      romanization: "gin khaao reu yang",
      english: "Have you eaten yet?",
    },
  },
  {
    id: "v36",
    thai: "ดื่ม",
    romanization: "deum",
    english: "Drink",
    category: "food",
    difficulty: "beginner",
  },
  {
    id: "v37",
    thai: "ช่วยด้วย",
    romanization: "chuay duay",
    english: "Help! / Please help",
    category: "phrases",
    difficulty: "intermediate",
  },
  {
    id: "v38",
    thai: "โรงพยาบาล",
    romanization: "rohng-pha-yaa-baan",
    english: "Hospital",
    category: "travel",
    difficulty: "intermediate",
  },
  {
    id: "v39",
    thai: "ตำรวจ",
    romanization: "dtam-ruat",
    english: "Police",
    category: "travel",
    difficulty: "intermediate",
  },
  {
    id: "v40",
    thai: "สนามบิน",
    romanization: "sa-naam-bin",
    english: "Airport",
    category: "travel",
    difficulty: "intermediate",
  },
];

export const getVocabularyByCategory = (
  category: VocabularyWord["category"],
) => {
  return VOCABULARY.filter((word) => word.category === category);
};

export const getVocabularyByDifficulty = (
  difficulty: VocabularyWord["difficulty"],
) => {
  return VOCABULARY.filter((word) => word.difficulty === difficulty);
};
