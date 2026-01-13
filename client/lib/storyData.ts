export interface StoryWord {
  thai: string;
  romanization: string;
  english: string;
}

export interface Story {
  id: string;
  title: string;
  titleThai: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  words: StoryWord[];
  fullTranslation: string;
}

export const STORIES: Story[] = [
  {
    id: "story-1",
    title: "Morning Greeting",
    titleThai: "ทักทายตอนเช้า",
    difficulty: "beginner",
    description: "A simple morning conversation between friends",
    words: [
      { thai: "สวัสดี", romanization: "sa-wat-dee", english: "Hello" },
      { thai: "ตอน", romanization: "dtawn", english: "time/period" },
      { thai: "เช้า", romanization: "chao", english: "morning" },
      {
        thai: "ครับ",
        romanization: "khrap",
        english: "(polite particle, male)",
      },
      { thai: "คุณ", romanization: "khun", english: "you" },
      { thai: "สบาย", romanization: "sa-bai", english: "comfortable/well" },
      { thai: "ดี", romanization: "dee", english: "good" },
      { thai: "ไหม", romanization: "mai", english: "(question particle)" },
      {
        thai: "ค่ะ",
        romanization: "kha",
        english: "(polite particle, female)",
      },
      { thai: "ขอบคุณ", romanization: "khawp-khun", english: "thank you" },
      { thai: "ที่", romanization: "thee", english: "that/which" },
      { thai: "ถาม", romanization: "tham", english: "ask" },
    ],
    fullTranslation:
      "Good morning! How are you? I'm fine, thank you for asking.",
  },
  {
    id: "story-2",
    title: "At the Market",
    titleThai: "ที่ตลาด",
    difficulty: "beginner",
    description: "Buying fruits at a local Thai market",
    words: [
      { thai: "ตลาด", romanization: "dta-laat", english: "market" },
      { thai: "มะม่วง", romanization: "ma-muang", english: "mango" },
      { thai: "กี่", romanization: "gee", english: "how many" },
      { thai: "บาท", romanization: "baht", english: "baht (Thai currency)" },
      { thai: "สิบ", romanization: "sip", english: "ten" },
      { thai: "ห้า", romanization: "ha", english: "five" },
      { thai: "เอา", romanization: "ao", english: "want/take" },
      { thai: "สอง", romanization: "sawng", english: "two" },
      { thai: "กิโล", romanization: "gi-loh", english: "kilogram" },
      { thai: "นะ", romanization: "na", english: "(softening particle)" },
      {
        thai: "ค่ะ",
        romanization: "kha",
        english: "(polite particle, female)",
      },
      { thai: "ได้", romanization: "dai", english: "can/okay" },
    ],
    fullTranslation:
      "How much are the mangoes? Fifteen baht per kilo. I'll take two kilos please. Okay!",
  },
  {
    id: "story-3",
    title: "Finding the Way",
    titleThai: "หาทาง",
    difficulty: "intermediate",
    description: "Asking for directions to a famous temple",
    words: [
      { thai: "ขอโทษ", romanization: "khor-thot", english: "excuse me/sorry" },
      { thai: "วัด", romanization: "wat", english: "temple" },
      { thai: "อยู่", romanization: "yoo", english: "is located/stay" },
      { thai: "ที่ไหน", romanization: "tee-nai", english: "where" },
      { thai: "ตรง", romanization: "dtrong", english: "straight" },
      { thai: "ไป", romanization: "bpai", english: "go" },
      { thai: "เลี้ยว", romanization: "liaw", english: "turn" },
      { thai: "ขวา", romanization: "khwa", english: "right" },
      { thai: "ซ้าย", romanization: "sai", english: "left" },
      { thai: "ใกล้", romanization: "glai", english: "near" },
      { thai: "ไกล", romanization: "glai", english: "far" },
      { thai: "เดิน", romanization: "dern", english: "walk" },
      { thai: "นาที", romanization: "na-tee", english: "minute" },
      { thai: "ขอบคุณ", romanization: "khawp-khun", english: "thank you" },
      { thai: "มาก", romanization: "mak", english: "very much" },
    ],
    fullTranslation:
      "Excuse me, where is the temple? Go straight, then turn right. It's not far, about a 5 minute walk. Thank you very much!",
  },
  {
    id: "story-4",
    title: "Ordering Food",
    titleThai: "สั่งอาหาร",
    difficulty: "intermediate",
    description: "Ordering a meal at a Thai restaurant",
    words: [
      { thai: "อาหาร", romanization: "a-han", english: "food" },
      { thai: "เมนู", romanization: "may-noo", english: "menu" },
      { thai: "ผัดไทย", romanization: "phat-thai", english: "Pad Thai" },
      { thai: "ไม่", romanization: "mai", english: "not" },
      { thai: "เผ็ด", romanization: "phet", english: "spicy" },
      { thai: "น้ำ", romanization: "nam", english: "water" },
      { thai: "เย็น", romanization: "yen", english: "cold" },
      { thai: "หนึ่ง", romanization: "neung", english: "one" },
      { thai: "แก้ว", romanization: "gaew", english: "glass" },
      { thai: "รอ", romanization: "raw", english: "wait" },
      { thai: "สัก", romanization: "sak", english: "about/approximately" },
      { thai: "ครู่", romanization: "khru", english: "moment" },
      { thai: "อร่อย", romanization: "a-roi", english: "delicious" },
    ],
    fullTranslation:
      "Can I see the menu? I'd like Pad Thai, not spicy please. And one glass of cold water. Please wait a moment. The food is delicious!",
  },
  {
    id: "story-5",
    title: "A Day at the Beach",
    titleThai: "วันหนึ่งที่ชายหาด",
    difficulty: "advanced",
    description: "Describing a relaxing day at a Thai beach",
    words: [
      { thai: "ชายหาด", romanization: "chai-hat", english: "beach" },
      { thai: "ทะเล", romanization: "ta-lay", english: "sea" },
      { thai: "สวยงาม", romanization: "suay-ngam", english: "beautiful" },
      { thai: "ท้องฟ้า", romanization: "thawng-fa", english: "sky" },
      { thai: "สีฟ้า", romanization: "see-fa", english: "blue color" },
      { thai: "คลื่น", romanization: "khluen", english: "wave" },
      { thai: "ทราย", romanization: "sai", english: "sand" },
      { thai: "ขาว", romanization: "khao", english: "white" },
      { thai: "นั่ง", romanization: "nang", english: "sit" },
      { thai: "พักผ่อน", romanization: "phak-phawn", english: "relax" },
      { thai: "ว่ายน้ำ", romanization: "wai-nam", english: "swim" },
      { thai: "สนุก", romanization: "sa-nuk", english: "fun" },
      { thai: "มาก", romanization: "mak", english: "very" },
      { thai: "พระอาทิตย์", romanization: "phra-a-thit", english: "sun" },
      { thai: "ตก", romanization: "dtok", english: "set/fall" },
    ],
    fullTranslation:
      "The beach is very beautiful. The sky is blue and the waves are gentle. The sand is white. I sit and relax, then swim in the sea. It's very fun! I watch the sunset.",
  },
  {
    id: "story-6",
    title: "Thai New Year",
    titleThai: "สงกรานต์",
    difficulty: "advanced",
    description: "Celebrating Songkran, the Thai New Year festival",
    words: [
      {
        thai: "สงกรานต์",
        romanization: "song-kran",
        english: "Songkran (Thai New Year)",
      },
      { thai: "เทศกาล", romanization: "thet-sa-kan", english: "festival" },
      { thai: "เมษายน", romanization: "may-sa-yon", english: "April" },
      { thai: "ครอบครัว", romanization: "khrawp-khrua", english: "family" },
      { thai: "รดน้ำ", romanization: "rot-nam", english: "pour water" },
      { thai: "ผู้ใหญ่", romanization: "phu-yai", english: "elders" },
      { thai: "ขอพร", romanization: "khaw-phawn", english: "ask for blessing" },
      { thai: "สาดน้ำ", romanization: "sat-nam", english: "splash water" },
      { thai: "เล่น", romanization: "len", english: "play" },
      { thai: "ถนน", romanization: "tha-non", english: "street/road" },
      {
        thai: "สนุกสนาน",
        romanization: "sa-nuk-sa-nan",
        english: "enjoyable/merry",
      },
      { thai: "ปีใหม่", romanization: "bpee-mai", english: "new year" },
      { thai: "ไทย", romanization: "thai", english: "Thai" },
      { thai: "ประเพณี", romanization: "bpra-pay-nee", english: "tradition" },
    ],
    fullTranslation:
      "Songkran is the Thai New Year festival in April. Families gather together. We pour water on elders and ask for their blessings. People play by splashing water on the streets. It's a very enjoyable Thai tradition!",
  },
  {
    id: "story-7",
    title: "The Elephant Sanctuary",
    titleThai: "ศูนย์อนุรักษ์ช้าง",
    difficulty: "expert",
    description: "Visiting an elephant sanctuary in Northern Thailand",
    words: [
      { thai: "ช้าง", romanization: "chang", english: "elephant" },
      { thai: "ศูนย์", romanization: "soon", english: "center" },
      { thai: "อนุรักษ์", romanization: "a-nu-rak", english: "conservation" },
      { thai: "เชียงใหม่", romanization: "chiang-mai", english: "Chiang Mai" },
      { thai: "ธรรมชาติ", romanization: "tham-ma-chat", english: "nature" },
      { thai: "ป่า", romanization: "bpa", english: "forest" },
      { thai: "อาหาร", romanization: "a-han", english: "food" },
      { thai: "กล้วย", romanization: "gluay", english: "banana" },
      { thai: "อ้อย", romanization: "oy", english: "sugarcane" },
      { thai: "ให้", romanization: "hai", english: "give" },
      { thai: "อาบน้ำ", romanization: "ap-nam", english: "bathe" },
      { thai: "แม่น้ำ", romanization: "mae-nam", english: "river" },
      { thai: "ประทับใจ", romanization: "bpra-thap-jai", english: "impressed" },
      { thai: "สัตว์", romanization: "sat", english: "animal" },
      { thai: "ฉลาด", romanization: "cha-lat", english: "intelligent" },
      { thai: "น่ารัก", romanization: "na-rak", english: "cute/lovely" },
    ],
    fullTranslation:
      "I visited an elephant conservation center in Chiang Mai. The elephants live freely in nature and the forest. I fed them bananas and sugarcane. We helped bathe the elephants in the river. I was very impressed. Elephants are intelligent and lovely animals.",
  },
  {
    id: "story-8",
    title: "Living in Bangkok",
    titleThai: "ชีวิตในกรุงเทพ",
    difficulty: "expert",
    description: "Daily life experiences in Thailand's capital city",
    words: [
      { thai: "กรุงเทพ", romanization: "grung-thep", english: "Bangkok" },
      {
        thai: "เมืองหลวง",
        romanization: "mueang-luang",
        english: "capital city",
      },
      {
        thai: "รถไฟฟ้า",
        romanization: "rot-fai-fa",
        english: "BTS/electric train",
      },
      { thai: "สะดวก", romanization: "sa-duak", english: "convenient" },
      { thai: "รถติด", romanization: "rot-dtit", english: "traffic jam" },
      {
        thai: "ห้างสรรพสินค้า",
        romanization: "hang-sap-pa-sin-ka",
        english: "shopping mall",
      },
      {
        thai: "อาหารริมทาง",
        romanization: "a-han-rim-thang",
        english: "street food",
      },
      { thai: "หลากหลาย", romanization: "lak-lai", english: "diverse/variety" },
      { thai: "วัฒนธรรม", romanization: "wat-tha-na-tham", english: "culture" },
      { thai: "สมัยใหม่", romanization: "sa-mai-mai", english: "modern" },
      { thai: "โบราณ", romanization: "bo-ran", english: "ancient" },
      {
        thai: "ผสมผสาน",
        romanization: "pha-som-pha-san",
        english: "blend/mix",
      },
      { thai: "น่าสนใจ", romanization: "na-son-jai", english: "interesting" },
      {
        thai: "ประสบการณ์",
        romanization: "bpra-sop-gaan",
        english: "experience",
      },
    ],
    fullTranslation:
      "Bangkok is the capital of Thailand. I take the BTS train because it's convenient. Traffic jams are common. There are many shopping malls and diverse street food. Bangkok blends modern and ancient culture together. It's an interesting experience living here.",
  },
];

export const getStoriesByDifficulty = (difficulty: Story["difficulty"]) => {
  return STORIES.filter((story) => story.difficulty === difficulty);
};

export const getStoryById = (id: string) => {
  return STORIES.find((story) => story.id === id);
};
