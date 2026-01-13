export type Category =
  | "basics"
  | "greetings"
  | "food"
  | "travel"
  | "numbers"
  | "sentences"
  | "conversations";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string;
  thai: string;
  romanization: string;
  english: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  xpReward: number;
  questions: Question[];
  icon: string;
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "basics", label: "Basics", icon: "home" },
  { id: "greetings", label: "Greetings", icon: "message-circle" },
  { id: "food", label: "Food", icon: "coffee" },
  { id: "travel", label: "Travel", icon: "map" },
  { id: "numbers", label: "Numbers", icon: "hash" },
  { id: "sentences", label: "Sentences", icon: "type" },
  { id: "conversations", label: "Conversations", icon: "users" },
];

export const DIFFICULTIES: { id: Difficulty; label: string; color: string }[] =
  [
    { id: "beginner", label: "Beginner", color: "#4CAF50" },
    { id: "intermediate", label: "Intermediate", color: "#FF9800" },
    { id: "advanced", label: "Advanced", color: "#F44336" },
  ];

export const LESSONS: Lesson[] = [
  {
    id: "basics-1",
    title: "Hello & Goodbye",
    category: "greetings",
    difficulty: "beginner",
    xpReward: 10,
    icon: "message-circle",
    questions: [
      {
        id: "q1",
        thai: "สวัสดี",
        romanization: "Sa-wat-dee",
        english: "Hello",
        options: ["Hello", "Goodbye", "Thank you", "Sorry"],
        correctAnswer: 0,
        hint: "This is the most common greeting in Thailand - you'll hear it everywhere!",
        explanation:
          "สวัสดี (Sa-wat-dee) is the universal Thai greeting used for both 'hello' and 'goodbye'. Add ครับ (krap) if you're male or ค่ะ (ka) if you're female to be polite.",
      },
      {
        id: "q2",
        thai: "ลาก่อน",
        romanization: "La-gorn",
        english: "Goodbye",
        options: ["Hello", "Goodbye", "Please", "Yes"],
        correctAnswer: 1,
        hint: "This is what you say when leaving someone - think of 'leaving'.",
        explanation:
          "ลาก่อน (La-gorn) is a more formal way to say goodbye, often used when parting for a longer time. สวัสดี can also be used for goodbye in casual situations.",
      },
      {
        id: "q3",
        thai: "ขอบคุณ",
        romanization: "Kob-khun",
        english: "Thank you",
        options: ["Sorry", "Please", "Thank you", "Welcome"],
        correctAnswer: 2,
        hint: "You say this when someone gives you something or helps you.",
        explanation:
          "ขอบคุณ (Kob-khun) means 'thank you'. Add ครับ/ค่ะ for politeness. For extra gratitude, say ขอบคุณมาก (Kob-khun maak) meaning 'thank you very much'.",
      },
      {
        id: "q4",
        thai: "ไม่เป็นไร",
        romanization: "Mai-pen-rai",
        english: "No problem / You're welcome",
        options: ["Sorry", "No problem / You're welcome", "Hello", "Goodbye"],
        correctAnswer: 1,
        hint: "This phrase means 'don't worry about it' - a very Thai attitude!",
        explanation:
          "ไม่เป็นไร (Mai-pen-rai) is a very common Thai expression meaning 'no problem', 'never mind', or 'you're welcome'. It reflects the Thai philosophy of not worrying about small things.",
      },
    ],
  },
  {
    id: "basics-2",
    title: "Yes & No",
    category: "basics",
    difficulty: "beginner",
    xpReward: 10,
    icon: "check-circle",
    questions: [
      {
        id: "q1",
        thai: "ใช่",
        romanization: "Chai",
        english: "Yes",
        options: ["No", "Yes", "Maybe", "Later"],
        correctAnswer: 1,
        hint: "This is the positive response - sounds like 'chai' tea!",
        explanation:
          "ใช่ (Chai) means 'yes' or 'correct'. It's used to confirm something is true or right.",
      },
      {
        id: "q2",
        thai: "ไม่",
        romanization: "Mai",
        english: "No",
        options: ["Yes", "Maybe", "No", "Later"],
        correctAnswer: 2,
        hint: "The opposite of yes - a simple one-syllable word.",
        explanation:
          "ไม่ (Mai) means 'no' or 'not'. It's placed before verbs or adjectives to negate them. For example: ไม่ดี (mai dee) = not good.",
      },
      {
        id: "q3",
        thai: "ไม่ใช่",
        romanization: "Mai-chai",
        english: "Not / It's not",
        options: ["Yes it is", "Not / It's not", "Maybe", "I don't know"],
        correctAnswer: 1,
        hint: "It combines 'no' + 'yes' to mean 'no, it isn't'.",
        explanation:
          "ไม่ใช่ (Mai-chai) means 'it's not' or 'that's not right'. It's the opposite of ใช่ (chai).",
      },
      {
        id: "q4",
        thai: "ครับ/ค่ะ",
        romanization: "Krap/Ka",
        english: "Polite particle (m/f)",
        options: ["Thank you", "Sorry", "Polite particle (m/f)", "Hello"],
        correctAnswer: 2,
        hint: "These words don't have a meaning on their own - they show respect.",
        explanation:
          "ครับ (Krap) is used by males, and ค่ะ (Ka) is used by females. These particles are added at the end of sentences to show politeness and respect.",
      },
    ],
  },
  {
    id: "basics-3",
    title: "Common Questions",
    category: "basics",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "help-circle",
    questions: [
      {
        id: "q1",
        thai: "อะไร",
        romanization: "A-rai",
        english: "What?",
        options: ["Who?", "What?", "Where?", "When?"],
        correctAnswer: 1,
        hint: "Think about asking for information about a thing or object.",
        explanation:
          "อะไร (A-rai) means 'what'. In Thai, question words usually come at the end of the sentence. Example: นี่คืออะไร (Nee kue a-rai) = What is this?",
      },
      {
        id: "q2",
        thai: "ทำไม",
        romanization: "Tam-mai",
        english: "Why?",
        options: ["How?", "When?", "Why?", "What?"],
        correctAnswer: 2,
        hint: "This asks for a reason or cause.",
        explanation:
          "ทำไม (Tam-mai) means 'why'. It can be placed at the beginning or end of a question. Example: ทำไมมาสาย (Tam-mai ma sai) = Why are you late?",
      },
      {
        id: "q3",
        thai: "เมื่อไหร่",
        romanization: "Mua-rai",
        english: "When?",
        options: ["Where?", "How?", "What?", "When?"],
        correctAnswer: 3,
        hint: "This asks about time.",
        explanation:
          "เมื่อไหร่ (Mua-rai) means 'when'. Example: คุณจะมาเมื่อไหร่ (Khun ja ma mua-rai) = When will you come?",
      },
      {
        id: "q4",
        thai: "ใคร",
        romanization: "Krai",
        english: "Who?",
        options: ["Who?", "What?", "Where?", "Why?"],
        correctAnswer: 0,
        hint: "This asks about a person's identity.",
        explanation:
          "ใคร (Krai) means 'who'. Example: นั่นคือใคร (Nan kue krai) = Who is that?",
      },
      {
        id: "q5",
        thai: "ที่ไหน",
        romanization: "Tee-nai",
        english: "Where?",
        options: ["What?", "When?", "Where?", "How?"],
        correctAnswer: 2,
        hint: "This asks about a place or location.",
        explanation:
          "ที่ไหน (Tee-nai) means 'where'. Example: ห้องน้ำอยู่ที่ไหน (Hong-nam yoo tee-nai) = Where is the bathroom?",
      },
    ],
  },
  {
    id: "basics-4",
    title: "Pronouns",
    category: "basics",
    difficulty: "beginner",
    xpReward: 15,
    icon: "user",
    questions: [
      {
        id: "q1",
        thai: "ผม",
        romanization: "Phom",
        english: "I (male)",
        options: ["You", "He", "I (male)", "We"],
        correctAnswer: 2,
        hint: "This is what men use to refer to themselves.",
        explanation:
          "ผม (Phom) means 'I' when spoken by a male. It's the polite form used in most situations.",
      },
      {
        id: "q2",
        thai: "ฉัน",
        romanization: "Chan",
        english: "I (female)",
        options: ["I (female)", "She", "They", "You"],
        correctAnswer: 0,
        hint: "This is what women use to refer to themselves.",
        explanation:
          "ฉัน (Chan) means 'I' when spoken by a female. ดิฉัน (Di-chan) is more formal.",
      },
      {
        id: "q3",
        thai: "คุณ",
        romanization: "Khun",
        english: "You",
        options: ["I", "You", "He", "She"],
        correctAnswer: 1,
        hint: "Used when talking to someone - the person you're speaking to.",
        explanation:
          "คุณ (Khun) means 'you' and is used for both genders. It's polite and respectful.",
      },
      {
        id: "q4",
        thai: "เขา",
        romanization: "Khao",
        english: "He/She/They",
        options: ["I", "You", "We", "He/She/They"],
        correctAnswer: 3,
        hint: "Used when talking about someone else - a third person.",
        explanation:
          "เขา (Khao) can mean 'he', 'she', or 'they'. Thai doesn't distinguish gender in third-person pronouns.",
      },
      {
        id: "q5",
        thai: "เรา",
        romanization: "Rao",
        english: "We",
        options: ["We", "They", "You all", "Everyone"],
        correctAnswer: 0,
        hint: "Used when referring to yourself and others together.",
        explanation:
          "เรา (Rao) means 'we' or 'us'. It can also be used informally to mean 'I'.",
      },
    ],
  },
  {
    id: "basics-5",
    title: "This & That",
    category: "basics",
    difficulty: "beginner",
    xpReward: 15,
    icon: "target",
    questions: [
      {
        id: "q1",
        thai: "นี่",
        romanization: "Nee",
        english: "This",
        options: ["That", "This", "Here", "There"],
        correctAnswer: 1,
        explanation:
          "นี่ (Nee) means 'this' for things close to the speaker. Example: นี่คืออะไร (Nee kue a-rai) = What is this?",
      },
      {
        id: "q2",
        thai: "นั่น",
        romanization: "Nan",
        english: "That",
        options: ["This", "That", "Here", "There"],
        correctAnswer: 1,
        explanation:
          "นั่น (Nan) means 'that' for things away from the speaker but not too far. Example: นั่นคืออะไร (Nan kue a-rai) = What is that?",
      },
      {
        id: "q3",
        thai: "โน่น",
        romanization: "Noon",
        english: "That over there",
        options: ["This", "That", "That over there", "Here"],
        correctAnswer: 2,
        explanation:
          "โน่น (Noon) means 'that over there' for things far from both the speaker and listener.",
      },
      {
        id: "q4",
        thai: "นี้",
        romanization: "Nee",
        english: "This (modifier)",
        options: ["This (modifier)", "That (modifier)", "Which", "Some"],
        correctAnswer: 0,
        explanation:
          "นี้ (Nee) is used after nouns to mean 'this'. Example: หนังสือนี้ (Nang-sue nee) = this book.",
      },
    ],
  },
  {
    id: "numbers-1",
    title: "Numbers 1-5",
    category: "numbers",
    difficulty: "beginner",
    xpReward: 15,
    icon: "hash",
    questions: [
      {
        id: "q1",
        thai: "หนึ่ง",
        romanization: "Neung",
        english: "One",
        options: ["Two", "One", "Three", "Four"],
        correctAnswer: 1,
        explanation:
          "หนึ่ง (Neung) is the number one. When counting objects, it often becomes เอ็ด (et) at the end of larger numbers.",
      },
      {
        id: "q2",
        thai: "สอง",
        romanization: "Song",
        english: "Two",
        options: ["One", "Three", "Two", "Five"],
        correctAnswer: 2,
        explanation:
          "สอง (Song) is the number two. Thai uses classifiers when counting objects, placed after the number.",
      },
      {
        id: "q3",
        thai: "สาม",
        romanization: "Sam",
        english: "Three",
        options: ["Two", "Four", "Five", "Three"],
        correctAnswer: 3,
        hint: "Count after two: one, two, ___",
        explanation: "สาม (Sam) is the number three.",
      },
      {
        id: "q4",
        thai: "สี่",
        romanization: "See",
        english: "Four",
        options: ["Four", "Three", "Five", "Six"],
        correctAnswer: 0,
        hint: "This comes after three.",
        explanation:
          "สี่ (See) is the number four. Note: สี (See) without the tone mark means 'color'.",
      },
      {
        id: "q5",
        thai: "ห้า",
        romanization: "Ha",
        english: "Five",
        options: ["Four", "Six", "Three", "Five"],
        correctAnswer: 3,
        hint: "Count the fingers on one hand.",
        explanation: "ห้า (Ha) is the number five.",
      },
    ],
  },
  {
    id: "numbers-2",
    title: "Numbers 6-10",
    category: "numbers",
    difficulty: "beginner",
    xpReward: 15,
    icon: "hash",
    questions: [
      {
        id: "q1",
        thai: "หก",
        romanization: "Hok",
        english: "Six",
        options: ["Five", "Six", "Seven", "Eight"],
        correctAnswer: 1,
        hint: "One more than five.",
        explanation: "หก (Hok) is the number six.",
      },
      {
        id: "q2",
        thai: "เจ็ด",
        romanization: "Jet",
        english: "Seven",
        options: ["Six", "Eight", "Seven", "Nine"],
        correctAnswer: 2,
        hint: "Days in a week.",
        explanation: "เจ็ด (Jet) is the number seven.",
      },
      {
        id: "q3",
        thai: "แปด",
        romanization: "Paet",
        english: "Eight",
        options: ["Seven", "Nine", "Ten", "Eight"],
        correctAnswer: 3,
        hint: "Sounds like 'pet' in the romanization.",
        explanation: "แปด (Paet) is the number eight.",
      },
      {
        id: "q4",
        thai: "เก้า",
        romanization: "Gao",
        english: "Nine",
        options: ["Nine", "Eight", "Ten", "Seven"],
        correctAnswer: 0,
        hint: "One before ten.",
        explanation: "เก้า (Gao) is the number nine.",
      },
      {
        id: "q5",
        thai: "สิบ",
        romanization: "Sip",
        english: "Ten",
        options: ["Nine", "Eleven", "Eight", "Ten"],
        correctAnswer: 3,
        hint: "Fingers on both hands.",
        explanation:
          "สิบ (Sip) is the number ten. For 11-19, add the unit after สิบ: สิบเอ็ด (11), สิบสอง (12), etc.",
      },
    ],
  },
  {
    id: "numbers-3",
    title: "Bigger Numbers",
    category: "numbers",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "hash",
    questions: [
      {
        id: "q1",
        thai: "ยี่สิบ",
        romanization: "Yee-sip",
        english: "Twenty",
        options: ["Twelve", "Twenty", "Thirty", "Twenty-two"],
        correctAnswer: 1,
        explanation:
          "ยี่สิบ (Yee-sip) means twenty. Note that the word for 'two' changes to ยี่ when it's in the tens place.",
      },
      {
        id: "q2",
        thai: "ร้อย",
        romanization: "Roy",
        english: "Hundred",
        options: ["Ten", "Fifty", "Hundred", "Thousand"],
        correctAnswer: 2,
        explanation:
          "ร้อย (Roy) means hundred. หนึ่งร้อย (Neung roy) = 100, สองร้อย (Song roy) = 200.",
      },
      {
        id: "q3",
        thai: "พัน",
        romanization: "Pan",
        english: "Thousand",
        options: ["Hundred", "Thousand", "Ten thousand", "Million"],
        correctAnswer: 1,
        explanation: "พัน (Pan) means thousand. หนึ่งพัน (Neung pan) = 1,000.",
      },
      {
        id: "q4",
        thai: "หมื่น",
        romanization: "Meun",
        english: "Ten thousand",
        options: ["Thousand", "Ten thousand", "Hundred thousand", "Million"],
        correctAnswer: 1,
        explanation:
          "หมื่น (Meun) means ten thousand. Thai has a unique word for this unit, unlike English.",
      },
      {
        id: "q5",
        thai: "ล้าน",
        romanization: "Lan",
        english: "Million",
        options: ["Hundred thousand", "Million", "Billion", "Ten million"],
        correctAnswer: 1,
        explanation:
          "ล้าน (Lan) means million. หนึ่งล้าน (Neung lan) = 1,000,000.",
      },
    ],
  },
  {
    id: "food-1",
    title: "Basic Food Words",
    category: "food",
    difficulty: "beginner",
    xpReward: 15,
    icon: "coffee",
    questions: [
      {
        id: "q1",
        thai: "ข้าว",
        romanization: "Khao",
        english: "Rice",
        options: ["Water", "Rice", "Noodles", "Soup"],
        correctAnswer: 1,
        explanation:
          "ข้าว (Khao) means rice, the staple food in Thailand. It's also used in many dish names like ข้าวผัด (Khao pad) = fried rice.",
      },
      {
        id: "q2",
        thai: "น้ำ",
        romanization: "Nam",
        english: "Water",
        options: ["Rice", "Juice", "Water", "Milk"],
        correctAnswer: 2,
        explanation:
          "น้ำ (Nam) means water. น้ำเปล่า (Nam plao) specifically means plain water.",
      },
      {
        id: "q3",
        thai: "ไก่",
        romanization: "Gai",
        english: "Chicken",
        options: ["Pork", "Beef", "Fish", "Chicken"],
        correctAnswer: 3,
        explanation:
          "ไก่ (Gai) means chicken. ไก่ทอด (Gai tod) = fried chicken.",
      },
      {
        id: "q4",
        thai: "หมู",
        romanization: "Moo",
        english: "Pork",
        options: ["Pork", "Chicken", "Beef", "Shrimp"],
        correctAnswer: 0,
        explanation:
          "หมู (Moo) means pork, the most commonly used meat in Thai cuisine.",
      },
    ],
  },
  {
    id: "food-2",
    title: "Restaurant Phrases",
    category: "food",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "coffee",
    questions: [
      {
        id: "q1",
        thai: "อร่อย",
        romanization: "A-roi",
        english: "Delicious",
        options: ["Spicy", "Sweet", "Delicious", "Sour"],
        correctAnswer: 2,
        explanation:
          "อร่อย (A-roi) means delicious. อร่อยมาก (A-roi maak) = very delicious!",
      },
      {
        id: "q2",
        thai: "เผ็ด",
        romanization: "Pet",
        english: "Spicy",
        options: ["Spicy", "Salty", "Sweet", "Sour"],
        correctAnswer: 0,
        explanation:
          "เผ็ด (Pet) means spicy. ไม่เผ็ด (Mai pet) = not spicy. เผ็ดนิดหน่อย (Pet nit noi) = a little spicy.",
      },
      {
        id: "q3",
        thai: "ขอเมนู",
        romanization: "Kho menu",
        english: "May I have the menu?",
        options: [
          "Check please",
          "May I have the menu?",
          "One more",
          "Water please",
        ],
        correctAnswer: 1,
        explanation:
          "ขอเมนู (Kho menu) means 'may I have the menu'. ขอ (Kho) means 'to request' or 'please give me'.",
      },
      {
        id: "q4",
        thai: "เช็คบิล",
        romanization: "Check bin",
        english: "Check please",
        options: ["More water", "Check please", "Thank you", "Excuse me"],
        correctAnswer: 1,
        explanation:
          "เช็คบิล (Check bin) means 'check please' or 'bill please'. This is borrowed from English.",
      },
    ],
  },
  {
    id: "food-3",
    title: "Thai Dishes",
    category: "food",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "coffee",
    questions: [
      {
        id: "q1",
        thai: "ผัดไทย",
        romanization: "Pad Thai",
        english: "Stir-fried Thai noodles",
        options: [
          "Fried rice",
          "Stir-fried Thai noodles",
          "Tom Yum soup",
          "Green curry",
        ],
        correctAnswer: 1,
        explanation:
          "ผัดไทย (Pad Thai) is Thailand's famous stir-fried rice noodle dish with eggs, tofu, shrimp, and tamarind sauce.",
      },
      {
        id: "q2",
        thai: "ต้มยำกุ้ง",
        romanization: "Tom Yam Goong",
        english: "Spicy shrimp soup",
        options: [
          "Coconut soup",
          "Spicy shrimp soup",
          "Noodle soup",
          "Clear soup",
        ],
        correctAnswer: 1,
        explanation:
          "ต้มยำกุ้ง (Tom Yam Goong) is the famous hot and sour soup with shrimp. ต้ม = boil, ยำ = mixed/spicy, กุ้ง = shrimp.",
      },
      {
        id: "q3",
        thai: "แกงเขียวหวาน",
        romanization: "Gaeng Kiew Wan",
        english: "Green curry",
        options: ["Red curry", "Yellow curry", "Green curry", "Massaman curry"],
        correctAnswer: 2,
        explanation:
          "แกงเขียวหวาน (Gaeng Kiew Wan) literally means 'sweet green curry'. It's made with green chillies and coconut milk.",
      },
      {
        id: "q4",
        thai: "ส้มตำ",
        romanization: "Som Tam",
        english: "Papaya salad",
        options: [
          "Mango salad",
          "Papaya salad",
          "Cucumber salad",
          "Glass noodle salad",
        ],
        correctAnswer: 1,
        explanation:
          "ส้มตำ (Som Tam) is a spicy green papaya salad from Isaan (Northeast Thailand). ส้ม = sour, ตำ = pounded.",
      },
    ],
  },
  {
    id: "food-4",
    title: "Ordering Food",
    category: "food",
    difficulty: "advanced",
    xpReward: 30,
    icon: "coffee",
    questions: [
      {
        id: "q1",
        thai: "ขอข้าวผัดหนึ่งจาน",
        romanization: "Kho khao pad neung jan",
        english: "One fried rice please",
        options: [
          "Two fried rice please",
          "One fried rice please",
          "One noodle please",
          "One curry please",
        ],
        correctAnswer: 1,
        explanation:
          "ขอข้าวผัดหนึ่งจาน: ขอ (kho) = please give me, ข้าวผัด (khao pad) = fried rice, หนึ่ง (neung) = one, จาน (jan) = plate/dish.",
      },
      {
        id: "q2",
        thai: "ไม่ใส่พริก",
        romanization: "Mai sai prik",
        english: "No chilli please",
        options: [
          "Extra chilli",
          "No chilli please",
          "A little chilli",
          "Very spicy",
        ],
        correctAnswer: 1,
        explanation:
          "ไม่ใส่พริก: ไม่ (mai) = no/not, ใส่ (sai) = put/add, พริก (prik) = chilli. Very useful phrase for those who can't handle spice!",
      },
      {
        id: "q3",
        thai: "อาหารเจ",
        romanization: "A-han jay",
        english: "Vegetarian food",
        options: ["Halal food", "Vegetarian food", "Seafood", "Street food"],
        correctAnswer: 1,
        explanation:
          "อาหารเจ (A-han jay) means vegetarian food. เจ (jay) comes from Chinese and means following a vegan diet.",
      },
      {
        id: "q4",
        thai: "ขอน้ำเปล่าสองขวด",
        romanization: "Kho nam plao song kuat",
        english: "Two bottles of water please",
        options: [
          "One bottle of water",
          "Two bottles of water please",
          "Two glasses of water",
          "Cold water please",
        ],
        correctAnswer: 1,
        explanation:
          "ขอน้ำเปล่าสองขวด: น้ำเปล่า (nam plao) = plain water, สอง (song) = two, ขวด (kuat) = bottle.",
      },
    ],
  },
  {
    id: "travel-1",
    title: "Getting Around",
    category: "travel",
    difficulty: "beginner",
    xpReward: 15,
    icon: "map",
    questions: [
      {
        id: "q1",
        thai: "ไปไหน",
        romanization: "Pai nai",
        english: "Where are you going?",
        options: [
          "How much?",
          "Where are you going?",
          "What time?",
          "Who is it?",
        ],
        correctAnswer: 1,
        explanation:
          "ไปไหน (Pai nai) literally means 'go where?' It's a very common casual greeting in Thailand, similar to 'What's up?'",
      },
      {
        id: "q2",
        thai: "ที่นี่",
        romanization: "Tee nee",
        english: "Here",
        options: ["There", "Here", "Where", "Everywhere"],
        correctAnswer: 1,
        explanation:
          "ที่นี่ (Tee nee) means 'here' or 'this place'. ที่ (tee) means 'place' and นี่ (nee) means 'this'.",
      },
      {
        id: "q3",
        thai: "ที่นั่น",
        romanization: "Tee nan",
        english: "There",
        options: ["Here", "Where", "There", "Everywhere"],
        correctAnswer: 2,
        explanation: "ที่นั่น (Tee nan) means 'there' or 'that place'.",
      },
      {
        id: "q4",
        thai: "ซ้าย",
        romanization: "Sai",
        english: "Left",
        options: ["Right", "Straight", "Left", "Back"],
        correctAnswer: 2,
        explanation:
          "ซ้าย (Sai) means left. เลี้ยวซ้าย (Liew sai) = turn left.",
      },
      {
        id: "q5",
        thai: "ขวา",
        romanization: "Kwa",
        english: "Right",
        options: ["Left", "Right", "Straight", "Back"],
        correctAnswer: 1,
        explanation:
          "ขวา (Kwa) means right. เลี้ยวขวา (Liew kwa) = turn right.",
      },
    ],
  },
  {
    id: "travel-2",
    title: "Transportation",
    category: "travel",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "map",
    questions: [
      {
        id: "q1",
        thai: "รถไฟ",
        romanization: "Rot fai",
        english: "Train",
        options: ["Bus", "Car", "Train", "Boat"],
        correctAnswer: 2,
        explanation:
          "รถไฟ (Rot fai) means train. รถ (rot) = vehicle, ไฟ (fai) = fire/electric. รถไฟฟ้า (Rot fai fa) = electric train (BTS/MRT).",
      },
      {
        id: "q2",
        thai: "รถเมล์",
        romanization: "Rot may",
        english: "Bus",
        options: ["Train", "Bus", "Taxi", "Motorcycle"],
        correctAnswer: 1,
        explanation:
          "รถเมล์ (Rot may) means bus. The word comes from 'mail' as buses used to carry mail.",
      },
      {
        id: "q3",
        thai: "แท็กซี่",
        romanization: "Taxi",
        english: "Taxi",
        options: ["Bus", "Train", "Motorcycle", "Taxi"],
        correctAnswer: 3,
        explanation: "แท็กซี่ (Taxi) is borrowed directly from English.",
      },
      {
        id: "q4",
        thai: "เครื่องบิน",
        romanization: "Kreuang bin",
        english: "Airplane",
        options: ["Airplane", "Helicopter", "Boat", "Train"],
        correctAnswer: 0,
        explanation:
          "เครื่องบิน (Kreuang bin) means airplane. เครื่อง (kreuang) = machine, บิน (bin) = fly.",
      },
    ],
  },
  {
    id: "travel-3",
    title: "At the Hotel",
    category: "travel",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "home",
    questions: [
      {
        id: "q1",
        thai: "ห้องพัก",
        romanization: "Hong pak",
        english: "Room",
        options: ["Bathroom", "Room", "Lobby", "Restaurant"],
        correctAnswer: 1,
        explanation:
          "ห้องพัก (Hong pak) means room (for staying). ห้อง (hong) = room, พัก (pak) = rest/stay.",
      },
      {
        id: "q2",
        thai: "มีห้องว่างไหม",
        romanization: "Mee hong wang mai",
        english: "Do you have a vacant room?",
        options: [
          "How much is the room?",
          "Do you have a vacant room?",
          "Where is my room?",
          "I want to check out",
        ],
        correctAnswer: 1,
        explanation:
          "มีห้องว่างไหม: มี (mee) = have, ห้อง (hong) = room, ว่าง (wang) = vacant/free, ไหม (mai) = question particle.",
      },
      {
        id: "q3",
        thai: "เช็คอิน",
        romanization: "Check in",
        english: "Check in",
        options: ["Check out", "Check in", "Book a room", "Cancel"],
        correctAnswer: 1,
        explanation:
          "เช็คอิน is borrowed from English. ขอเช็คอิน (Kho check in) = I'd like to check in.",
      },
      {
        id: "q4",
        thai: "กุญแจห้อง",
        romanization: "Goon-jae hong",
        english: "Room key",
        options: ["Room number", "Room key", "Room service", "Door lock"],
        correctAnswer: 1,
        explanation:
          "กุญแจห้อง (Goon-jae hong) means room key. กุญแจ (goon-jae) = key.",
      },
    ],
  },
  {
    id: "travel-4",
    title: "Asking for Directions",
    category: "travel",
    difficulty: "advanced",
    xpReward: 30,
    icon: "compass",
    questions: [
      {
        id: "q1",
        thai: "ไปสถานีรถไฟยังไง",
        romanization: "Pai sa-ta-nee rot fai yang-ngai",
        english: "How do I get to the train station?",
        options: [
          "Where is the train station?",
          "How do I get to the train station?",
          "Is this the train station?",
          "When does the train leave?",
        ],
        correctAnswer: 1,
        explanation:
          "ไปสถานีรถไฟยังไง: ไป (pai) = go, สถานี (sa-ta-nee) = station, รถไฟ (rot fai) = train, ยังไง (yang-ngai) = how.",
      },
      {
        id: "q2",
        thai: "ตรงไป",
        romanization: "Trong pai",
        english: "Go straight",
        options: ["Turn left", "Turn right", "Go straight", "Go back"],
        correctAnswer: 2,
        explanation:
          "ตรงไป (Trong pai) means go straight. ตรง (trong) = straight, ไป (pai) = go.",
      },
      {
        id: "q3",
        thai: "ใกล้ไหม",
        romanization: "Glai mai",
        english: "Is it near?",
        options: ["Is it far?", "Is it near?", "Is it here?", "Is it open?"],
        correctAnswer: 1,
        explanation:
          "ใกล้ไหม: ใกล้ (glai) = near, ไหม (mai) = question particle. Note: ไกล (gai) with different tone means 'far'.",
      },
      {
        id: "q4",
        thai: "อยู่ตรงข้าม",
        romanization: "Yoo trong kham",
        english: "It's across the street",
        options: [
          "It's next door",
          "It's across the street",
          "It's nearby",
          "It's upstairs",
        ],
        correctAnswer: 1,
        explanation:
          "อยู่ตรงข้าม: อยู่ (yoo) = is located, ตรงข้าม (trong kham) = opposite/across from.",
      },
    ],
  },
  {
    id: "greetings-2",
    title: "Polite Expressions",
    category: "greetings",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "message-circle",
    questions: [
      {
        id: "q1",
        thai: "ขอโทษ",
        romanization: "Kho thot",
        english: "Sorry / Excuse me",
        options: ["Thank you", "Hello", "Sorry / Excuse me", "Goodbye"],
        correctAnswer: 2,
        explanation:
          "ขอโทษ (Kho thot) means 'sorry' or 'excuse me'. Use it to apologize or to get someone's attention politely.",
      },
      {
        id: "q2",
        thai: "ยินดี",
        romanization: "Yin dee",
        english: "Glad / Happy",
        options: ["Sad", "Angry", "Glad / Happy", "Tired"],
        correctAnswer: 2,
        explanation:
          "ยินดี (Yin dee) means glad or happy. ยินดีต้อนรับ (Yin dee torn rap) = welcome!",
      },
      {
        id: "q3",
        thai: "สบายดี",
        romanization: "Sa-bai dee",
        english: "I'm fine / How are you?",
        options: [
          "I'm hungry",
          "I'm fine / How are you?",
          "I'm tired",
          "I'm sick",
        ],
        correctAnswer: 1,
        explanation:
          "สบายดี (Sa-bai dee) can be both a question 'How are you?' and an answer 'I'm fine'. สบาย (sa-bai) = comfortable/well.",
      },
      {
        id: "q4",
        thai: "โชคดี",
        romanization: "Chok dee",
        english: "Good luck",
        options: ["Goodbye", "Good luck", "See you", "Take care"],
        correctAnswer: 1,
        explanation:
          "โชคดี (Chok dee) means 'good luck'. โชค (chok) = luck, ดี (dee) = good.",
      },
    ],
  },
  {
    id: "greetings-3",
    title: "Meeting People",
    category: "greetings",
    difficulty: "intermediate",
    xpReward: 20,
    icon: "users",
    questions: [
      {
        id: "q1",
        thai: "คุณชื่ออะไร",
        romanization: "Khun chue a-rai",
        english: "What is your name?",
        options: [
          "Where are you from?",
          "What is your name?",
          "How old are you?",
          "What do you do?",
        ],
        correctAnswer: 1,
        explanation:
          "คุณชื่ออะไร: คุณ (khun) = you, ชื่อ (chue) = name, อะไร (a-rai) = what.",
      },
      {
        id: "q2",
        thai: "ผม/ฉันชื่อ...",
        romanization: "Phom/Chan chue...",
        english: "My name is...",
        options: ["I am from...", "My name is...", "I work at...", "I like..."],
        correctAnswer: 1,
        explanation:
          "ผมชื่อ (Phom chue) for males, ฉันชื่อ (Chan chue) for females, followed by your name.",
      },
      {
        id: "q3",
        thai: "ยินดีที่ได้รู้จัก",
        romanization: "Yin dee tee dai roo jak",
        english: "Nice to meet you",
        options: [
          "See you later",
          "Nice to meet you",
          "Good morning",
          "Take care",
        ],
        correctAnswer: 1,
        explanation:
          "ยินดีที่ได้รู้จัก literally means 'glad to have met you'. This is the formal way to say 'nice to meet you'.",
      },
      {
        id: "q4",
        thai: "คุณมาจากไหน",
        romanization: "Khun ma jak nai",
        english: "Where are you from?",
        options: [
          "Where are you from?",
          "Where are you going?",
          "Where do you live?",
          "Where do you work?",
        ],
        correctAnswer: 0,
        explanation:
          "คุณมาจากไหน: มา (ma) = come, จาก (jak) = from, ไหน (nai) = where.",
      },
    ],
  },
  {
    id: "sentences-1",
    title: "Simple Sentences",
    category: "sentences",
    difficulty: "beginner",
    xpReward: 20,
    icon: "type",
    questions: [
      {
        id: "q1",
        thai: "ผมหิวข้าว",
        romanization: "Phom hiu khao",
        english: "I am hungry",
        options: ["I am tired", "I am hungry", "I am thirsty", "I am full"],
        correctAnswer: 1,
        explanation:
          "ผมหิวข้าว: ผม (phom) = I (male), หิว (hiu) = hungry, ข้าว (khao) = rice/food. Thai structure is Subject + Verb.",
      },
      {
        id: "q2",
        thai: "ฉันรักคุณ",
        romanization: "Chan rak khun",
        english: "I love you",
        options: ["I miss you", "I love you", "I like you", "I need you"],
        correctAnswer: 1,
        explanation:
          "ฉันรักคุณ: ฉัน (chan) = I (female), รัก (rak) = love, คุณ (khun) = you. One of the most important phrases to know!",
      },
      {
        id: "q3",
        thai: "วันนี้อากาศดี",
        romanization: "Wan nee a-gat dee",
        english: "Today the weather is nice",
        options: [
          "Tomorrow will be hot",
          "Today the weather is nice",
          "Yesterday was rainy",
          "It's cold today",
        ],
        correctAnswer: 1,
        explanation:
          "วันนี้อากาศดี: วันนี้ (wan nee) = today, อากาศ (a-gat) = weather, ดี (dee) = good/nice.",
      },
      {
        id: "q4",
        thai: "ฉันชอบอาหารไทย",
        romanization: "Chan chop a-han Thai",
        english: "I like Thai food",
        options: [
          "I cook Thai food",
          "I like Thai food",
          "Thai food is spicy",
          "I want Thai food",
        ],
        correctAnswer: 1,
        explanation:
          "ฉันชอบอาหารไทย: ชอบ (chop) = like, อาหาร (a-han) = food, ไทย (Thai) = Thai.",
      },
    ],
  },
  {
    id: "sentences-2",
    title: "Daily Activities",
    category: "sentences",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "type",
    questions: [
      {
        id: "q1",
        thai: "ผมตื่นแต่เช้า",
        romanization: "Phom teun tae chao",
        english: "I wake up early",
        options: [
          "I wake up late",
          "I wake up early",
          "I go to bed early",
          "I sleep late",
        ],
        correctAnswer: 1,
        explanation:
          "ผมตื่นแต่เช้า: ตื่น (teun) = wake up, แต่เช้า (tae chao) = early morning.",
      },
      {
        id: "q2",
        thai: "ฉันกำลังทำงาน",
        romanization: "Chan gam-lang tam ngan",
        english: "I am working",
        options: [
          "I finished work",
          "I am working",
          "I want to work",
          "I don't work",
        ],
        correctAnswer: 1,
        explanation:
          "กำลัง (gam-lang) indicates ongoing action (like English '-ing'). ทำงาน (tam ngan) = work.",
      },
      {
        id: "q3",
        thai: "เขาไปโรงเรียนทุกวัน",
        romanization: "Khao pai rong rian took wan",
        english: "He/She goes to school every day",
        options: [
          "He goes to work every day",
          "He/She goes to school every day",
          "He doesn't go to school",
          "He went to school yesterday",
        ],
        correctAnswer: 1,
        explanation:
          "โรงเรียน (rong rian) = school, ทุกวัน (took wan) = every day.",
      },
      {
        id: "q4",
        thai: "พวกเรากินข้าวด้วยกัน",
        romanization: "Puak rao gin khao duay gan",
        english: "We eat together",
        options: [
          "We cook together",
          "We eat together",
          "We live together",
          "We work together",
        ],
        correctAnswer: 1,
        explanation:
          "พวกเรา (puak rao) = we (plural), กินข้าว (gin khao) = eat, ด้วยกัน (duay gan) = together.",
      },
    ],
  },
  {
    id: "sentences-3",
    title: "Expressing Feelings",
    category: "sentences",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "heart",
    questions: [
      {
        id: "q1",
        thai: "ฉันมีความสุข",
        romanization: "Chan mee kwaam suk",
        english: "I am happy",
        options: ["I am sad", "I am happy", "I am tired", "I am angry"],
        correctAnswer: 1,
        explanation:
          "มีความสุข (mee kwaam suk) = to have happiness = to be happy. This is a common pattern in Thai.",
      },
      {
        id: "q2",
        thai: "ผมเหนื่อยมาก",
        romanization: "Phom neuy maak",
        english: "I am very tired",
        options: [
          "I am a little tired",
          "I am very tired",
          "I am not tired",
          "I was tired",
        ],
        correctAnswer: 1,
        explanation:
          "เหนื่อย (neuy) = tired, มาก (maak) = very/a lot. มาก intensifies the adjective.",
      },
      {
        id: "q3",
        thai: "เธอโกรธฉัน",
        romanization: "Thoe grot chan",
        english: "She is angry at me",
        options: [
          "She loves me",
          "She is angry at me",
          "She misses me",
          "She knows me",
        ],
        correctAnswer: 1,
        explanation: "เธอ (thoe) = she/her (informal), โกรธ (grot) = angry.",
      },
      {
        id: "q4",
        thai: "ฉันคิดถึงบ้าน",
        romanization: "Chan kit teung baan",
        english: "I miss home",
        options: [
          "I love home",
          "I miss home",
          "I left home",
          "I want to go home",
        ],
        correctAnswer: 1,
        explanation:
          "คิดถึง (kit teung) = to miss (someone/something), บ้าน (baan) = home/house.",
      },
    ],
  },
  {
    id: "sentences-4",
    title: "Making Plans",
    category: "sentences",
    difficulty: "advanced",
    xpReward: 30,
    icon: "calendar",
    questions: [
      {
        id: "q1",
        thai: "พรุ่งนี้ฉันจะไปเที่ยว",
        romanization: "Prung nee chan ja pai tiew",
        english: "Tomorrow I will go traveling",
        options: [
          "Yesterday I traveled",
          "Tomorrow I will go traveling",
          "I like traveling",
          "I want to travel",
        ],
        correctAnswer: 1,
        explanation:
          "พรุ่งนี้ (prung nee) = tomorrow, จะ (ja) = will (future marker), ไปเที่ยว (pai tiew) = go traveling/sightseeing.",
      },
      {
        id: "q2",
        thai: "เราจะเจอกันตอนเย็น",
        romanization: "Rao ja jur gan ton yen",
        english: "We will meet in the evening",
        options: [
          "We met yesterday",
          "We will meet in the evening",
          "We always meet",
          "We want to meet",
        ],
        correctAnswer: 1,
        explanation:
          "เจอกัน (jur gan) = meet each other, ตอนเย็น (ton yen) = in the evening.",
      },
      {
        id: "q3",
        thai: "คุณว่างวันเสาร์ไหม",
        romanization: "Khun wang wan sao mai",
        english: "Are you free on Saturday?",
        options: [
          "Do you work on Saturday?",
          "Are you free on Saturday?",
          "What day is it?",
          "Is Saturday a holiday?",
        ],
        correctAnswer: 1,
        explanation:
          "ว่าง (wang) = free/available, วันเสาร์ (wan sao) = Saturday, ไหม (mai) = question particle.",
      },
      {
        id: "q4",
        thai: "ไว้เจอกันใหม่",
        romanization: "Wai jur gan mai",
        english: "See you again",
        options: [
          "Nice to meet you",
          "See you again",
          "Let's meet now",
          "I'll call you",
        ],
        correctAnswer: 1,
        explanation:
          "ไว้ (wai) = later/in the future, เจอกันใหม่ (jur gan mai) = meet again. A common way to say goodbye.",
      },
    ],
  },
  {
    id: "conversations-1",
    title: "At a Restaurant",
    category: "conversations",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "users",
    questions: [
      {
        id: "q1",
        thai: "โต๊ะสำหรับสองคน",
        romanization: "Toe sam-rap song kon",
        english: "A table for two people",
        options: [
          "A table for one",
          "A table for two people",
          "The bill please",
          "Is this table free?",
        ],
        correctAnswer: 1,
        hint: "You're asking for seating - 'song' means two.",
        explanation:
          "โต๊ะ (toe) = table, สำหรับ (sam-rap) = for, สองคน (song kon) = two people. คน (kon) is the classifier for people.",
      },
      {
        id: "q2",
        thai: "แนะนำอะไรดี",
        romanization: "Nae-nam a-rai dee",
        english: "What do you recommend?",
        options: [
          "What is this?",
          "What do you recommend?",
          "Is this spicy?",
          "How much is this?",
        ],
        correctAnswer: 1,
        hint: "Ask the waiter for their suggestion - 'nae-nam' means suggest.",
        explanation:
          "แนะนำ (nae-nam) = recommend, อะไรดี (a-rai dee) = what is good? A useful phrase when ordering!",
      },
      {
        id: "q3",
        thai: "ขอน้ำแข็งด้วย",
        romanization: "Kho nam kaeng duay",
        english: "With ice please",
        options: [
          "No ice please",
          "With ice please",
          "Cold water please",
          "Hot water please",
        ],
        correctAnswer: 1,
        hint: "'Nam kaeng' is frozen water - perfect for hot days!",
        explanation:
          "น้ำแข็ง (nam kaeng) = ice, ด้วย (duay) = also/as well. Essential for those hot Thai days!",
      },
      {
        id: "q4",
        thai: "อร่อยมากครับ",
        romanization: "A-roi maak krap",
        english: "Very delicious! (male speaker)",
        options: [
          "Not so good",
          "Very delicious! (male speaker)",
          "Too spicy",
          "I'm full",
        ],
        correctAnswer: 1,
        hint: "A positive compliment about the food - 'maak' means very.",
        explanation:
          "A compliment to the chef! อร่อย (a-roi) = delicious, มาก (maak) = very, ครับ (krap) = polite particle (male).",
      },
      {
        id: "q5",
        thai: "ขอเช็คบิลด้วยครับ",
        romanization: "Kho check bill duay krap",
        english: "Can I have the bill please? (male)",
        options: [
          "More food please",
          "Can I have the bill please? (male)",
          "Where is the restroom?",
          "Is service included?",
        ],
        correctAnswer: 1,
        hint: "You're finished eating and ready to pay.",
        explanation:
          "เช็คบิล (check bill) is borrowed from English. ขอ (kho) = request, ด้วย (duay) = please.",
      },
      {
        id: "q6",
        thai: "ไม่ใส่ผักชี",
        romanization: "Mai sai pak chee",
        english: "No coriander please",
        options: [
          "Extra coriander please",
          "No coriander please",
          "I love coriander",
          "What is coriander?",
        ],
        correctAnswer: 1,
        hint: "Use 'mai sai' to exclude an ingredient you don't want.",
        explanation:
          "ไม่ใส่ (mai sai) = don't add, ผักชี (pak chee) = coriander/cilantro. Very useful if you don't like certain ingredients!",
      },
    ],
  },
  {
    id: "conversations-2",
    title: "Shopping",
    category: "conversations",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "shopping-bag",
    questions: [
      {
        id: "q1",
        thai: "ราคาเท่าไหร่",
        romanization: "Ra-ka tao-rai",
        english: "How much does it cost?",
        options: [
          "What is this?",
          "How much does it cost?",
          "Do you have this?",
          "Where is it?",
        ],
        correctAnswer: 1,
        hint: "You want to know the price - 'ra-ka' means price.",
        explanation:
          "ราคา (ra-ka) = price, เท่าไหร่ (tao-rai) = how much. The essential shopping phrase!",
      },
      {
        id: "q2",
        thai: "ลดราคาได้ไหม",
        romanization: "Lot ra-ka dai mai",
        english: "Can you reduce the price?",
        options: [
          "Is this on sale?",
          "Can you reduce the price?",
          "Is this expensive?",
          "Do you accept cards?",
        ],
        correctAnswer: 1,
        hint: "You're bargaining - 'lot' means lower/reduce.",
        explanation:
          "ลดราคา (lot ra-ka) = reduce price, ได้ไหม (dai mai) = can you? Bargaining is common in Thai markets!",
      },
      {
        id: "q3",
        thai: "มีไซส์อื่นไหม",
        romanization: "Mee size eun mai",
        english: "Do you have other sizes?",
        options: [
          "Do you have other colors?",
          "Do you have other sizes?",
          "Is this too big?",
          "Can I try this?",
        ],
        correctAnswer: 1,
        hint: "You need a different fit - 'size' is borrowed from English.",
        explanation:
          "ไซส์ (size) = size (borrowed from English), อื่น (eun) = other.",
      },
      {
        id: "q4",
        thai: "เอาอันนี้",
        romanization: "Ao an nee",
        english: "I'll take this one",
        options: [
          "I don't want this",
          "I'll take this one",
          "Show me another",
          "This is too expensive",
        ],
        correctAnswer: 1,
        hint: "You've decided to buy - 'ao' means to take/want.",
        explanation:
          "เอา (ao) = take/want, อันนี้ (an nee) = this one. อัน (an) is a general classifier for objects.",
      },
      {
        id: "q5",
        thai: "รับบัตรเครดิตไหม",
        romanization: "Rap bat credit mai",
        english: "Do you accept credit cards?",
        options: [
          "Cash only please",
          "Do you accept credit cards?",
          "I'll pay by cash",
          "Where is the ATM?",
        ],
        correctAnswer: 1,
        hint: "You want to know the payment method - 'bat credit' sounds like 'credit card'.",
        explanation:
          "รับ (rap) = accept/receive, บัตรเครดิต (bat credit) = credit card. Many shops in Thailand prefer cash!",
      },
      {
        id: "q6",
        thai: "ขอลองได้ไหม",
        romanization: "Kho long dai mai",
        english: "Can I try it on?",
        options: [
          "Can I buy this?",
          "Can I try it on?",
          "Is this new?",
          "Do you have a mirror?",
        ],
        correctAnswer: 1,
        hint: "You want to test before buying - 'long' means to try.",
        explanation:
          "ลอง (long) = try, ได้ไหม (dai mai) = can I? Essential for clothes shopping!",
      },
    ],
  },
  {
    id: "conversations-3",
    title: "Making Small Talk",
    category: "conversations",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "message-circle",
    questions: [
      {
        id: "q1",
        thai: "คุณทำงานอะไร",
        romanization: "Khun tam ngan a-rai",
        english: "What do you do for work?",
        options: [
          "Where do you work?",
          "What do you do for work?",
          "Do you like your job?",
          "When do you work?",
        ],
        correctAnswer: 1,
        hint: "Asking about someone's job - 'tam ngan' means work.",
        explanation:
          "ทำงาน (tam ngan) = work, อะไร (a-rai) = what. A common question when meeting new people.",
      },
      {
        id: "q2",
        thai: "คุณอยู่ที่ไหน",
        romanization: "Khun yoo tee nai",
        english: "Where do you live?",
        options: [
          "Where are you going?",
          "Where do you live?",
          "Where are you from?",
          "Where is your home?",
        ],
        correctAnswer: 1,
        hint: "Asking about residence - 'yoo' means live/stay.",
        explanation: "อยู่ (yoo) = live/stay, ที่ไหน (tee nai) = where.",
      },
      {
        id: "q3",
        thai: "ชอบเมืองไทยไหม",
        romanization: "Chop muang Thai mai",
        english: "Do you like Thailand?",
        options: [
          "Have you been to Thailand?",
          "Do you like Thailand?",
          "Are you Thai?",
          "Is Thailand beautiful?",
        ],
        correctAnswer: 1,
        hint: "Asking about preference - 'chop' means to like.",
        explanation:
          "เมืองไทย (muang Thai) = Thailand (literally 'Thai country'), ชอบ (chop) = like.",
      },
      {
        id: "q4",
        thai: "มาเมืองไทยนานเท่าไหร่",
        romanization: "Ma muang Thai nan tao-rai",
        english: "How long have you been in Thailand?",
        options: [
          "When did you come to Thailand?",
          "How long have you been in Thailand?",
          "Is this your first time?",
          "Do you like Thailand?",
        ],
        correctAnswer: 1,
        hint: "Asking about duration - 'nan tao-rai' means how long.",
        explanation:
          "นาน (nan) = long (time), เท่าไหร่ (tao-rai) = how much/how long.",
      },
      {
        id: "q5",
        thai: "คุณมีพี่น้องไหม",
        romanization: "Khun mee pee nong mai",
        english: "Do you have siblings?",
        options: [
          "Do you have siblings?",
          "Do you have children?",
          "Are you married?",
          "Do you have family here?",
        ],
        correctAnswer: 0,
        hint: "Asking about brothers and sisters - 'pee nong' means siblings.",
        explanation:
          "พี่น้อง (pee nong) = siblings. พี่ (pee) = older sibling, น้อง (nong) = younger sibling.",
      },
      {
        id: "q6",
        thai: "วันนี้อากาศดีนะ",
        romanization: "Wan nee a-gat dee na",
        english: "The weather is nice today",
        options: [
          "It's very hot today",
          "The weather is nice today",
          "Is it going to rain?",
          "I like cold weather",
        ],
        correctAnswer: 1,
        hint: "Commenting on pleasant weather - 'a-gat dee' means good weather.",
        explanation:
          "อากาศ (a-gat) = weather, ดี (dee) = good, นะ (na) = softening particle for friendly tone.",
      },
    ],
  },
  {
    id: "conversations-4",
    title: "Emergency Phrases",
    category: "conversations",
    difficulty: "advanced",
    xpReward: 30,
    icon: "alert-triangle",
    questions: [
      {
        id: "q1",
        thai: "ช่วยด้วย",
        romanization: "Chuay duay",
        english: "Help!",
        options: ["Thank you", "Help!", "Excuse me", "I'm sorry"],
        correctAnswer: 1,
        hint: "Urgent call for assistance - 'chuay' means help.",
        explanation:
          "ช่วยด้วย (Chuay duay) means 'Help!' ช่วย (chuay) = help, ด้วย (duay) = please/also. An important phrase to know!",
      },
      {
        id: "q2",
        thai: "ฉันไม่สบาย",
        romanization: "Chan mai sa-bai",
        english: "I don't feel well",
        options: [
          "I am fine",
          "I don't feel well",
          "I am tired",
          "I am hungry",
        ],
        correctAnswer: 1,
        hint: "Expressing illness - 'mai sa-bai' is the opposite of feeling good.",
        explanation:
          "ไม่สบาย (mai sa-bai) = not well/sick. สบาย (sa-bai) = comfortable/well.",
      },
      {
        id: "q3",
        thai: "โทรเรียกหมอ",
        romanization: "Toh riak mor",
        english: "Call a doctor",
        options: [
          "I need medicine",
          "Call a doctor",
          "Where is the hospital?",
          "I have insurance",
        ],
        correctAnswer: 1,
        hint: "Requesting medical help - 'mor' means doctor.",
        explanation:
          "โทร (toh) = call (phone), เรียก (riak) = summon/call for, หมอ (mor) = doctor.",
      },
      {
        id: "q4",
        thai: "โรงพยาบาลอยู่ที่ไหน",
        romanization: "Rong pa-ya-ban yoo tee nai",
        english: "Where is the hospital?",
        options: [
          "Where is the pharmacy?",
          "Where is the hospital?",
          "I need to see a doctor",
          "Is there a clinic nearby?",
        ],
        correctAnswer: 1,
        hint: "Asking for directions to medical care - 'rong pa-ya-ban' is a large medical facility.",
        explanation:
          "โรงพยาบาล (rong pa-ya-ban) = hospital. A critical phrase for emergencies.",
      },
      {
        id: "q5",
        thai: "ฉันแพ้อาหาร",
        romanization: "Chan pae a-han",
        english: "I have a food allergy",
        options: [
          "I don't like this food",
          "I have a food allergy",
          "This food is bad",
          "I'm not hungry",
        ],
        correctAnswer: 1,
        hint: "Medical condition with food - 'pae' means allergic to.",
        explanation:
          "แพ้ (pae) = allergic to, อาหาร (a-han) = food. Very important if you have allergies!",
      },
      {
        id: "q6",
        thai: "โทรเรียกตำรวจ",
        romanization: "Toh riak tam-ruat",
        english: "Call the police",
        options: [
          "Where is the police station?",
          "Call the police",
          "I lost my passport",
          "I need a lawyer",
        ],
        correctAnswer: 1,
        hint: "Requesting law enforcement - 'tam-ruat' means police.",
        explanation:
          "ตำรวจ (tam-ruat) = police. Important for emergencies involving safety or crime.",
      },
    ],
  },
  {
    id: "sentences-5",
    title: "Time Expressions",
    category: "sentences",
    difficulty: "intermediate",
    xpReward: 25,
    icon: "clock",
    questions: [
      {
        id: "q1",
        thai: "ตอนนี้กี่โมง",
        romanization: "Ton nee gee mong",
        english: "What time is it now?",
        options: [
          "When do we meet?",
          "What time is it now?",
          "Is it late?",
          "What day is it?",
        ],
        correctAnswer: 1,
        explanation:
          "ตอนนี้ (ton nee) = now, กี่โมง (gee mong) = what time/how many o'clock. โมง is used for telling time.",
      },
      {
        id: "q2",
        thai: "เมื่อวานฉันไปตลาด",
        romanization: "Muea wan chan pai ta-lat",
        english: "Yesterday I went to the market",
        options: [
          "Today I go to the market",
          "Yesterday I went to the market",
          "Tomorrow I will go to the market",
          "I often go to the market",
        ],
        correctAnswer: 1,
        explanation:
          "เมื่อวาน (muea wan) = yesterday, ตลาด (ta-lat) = market. Thai doesn't change verb forms for past tense.",
      },
      {
        id: "q3",
        thai: "ทุกเช้าฉันดื่มกาแฟ",
        romanization: "Took chao chan deum ga-fae",
        english: "Every morning I drink coffee",
        options: [
          "I drink coffee now",
          "Every morning I drink coffee",
          "I like coffee",
          "I want coffee",
        ],
        correctAnswer: 1,
        explanation:
          "ทุกเช้า (took chao) = every morning, ดื่ม (deum) = drink, กาแฟ (ga-fae) = coffee.",
      },
      {
        id: "q4",
        thai: "อาทิตย์หน้าเราไปทะเล",
        romanization: "A-tit na rao pai ta-lay",
        english: "Next week we go to the beach",
        options: [
          "Last week we went to the beach",
          "Next week we go to the beach",
          "We like the beach",
          "The beach is beautiful",
        ],
        correctAnswer: 1,
        explanation:
          "อาทิตย์หน้า (a-tit na) = next week, ทะเล (ta-lay) = sea/beach.",
      },
    ],
  },
  {
    id: "sentences-6",
    title: "Comparisons",
    category: "sentences",
    difficulty: "advanced",
    xpReward: 30,
    icon: "bar-chart-2",
    questions: [
      {
        id: "q1",
        thai: "อันนี้แพงกว่า",
        romanization: "An nee paeng gwa",
        english: "This one is more expensive",
        options: [
          "This one is cheaper",
          "This one is more expensive",
          "This one is the same price",
          "How much is this?",
        ],
        correctAnswer: 1,
        explanation:
          "กว่า (gwa) is the comparative marker meaning 'more than'. แพง (paeng) = expensive + กว่า = more expensive.",
      },
      {
        id: "q2",
        thai: "ภาษาไทยยากกว่าภาษาอังกฤษ",
        romanization: "Pa-sa Thai yak gwa pa-sa Ang-grit",
        english: "Thai is harder than English",
        options: [
          "Thai is easier than English",
          "Thai is harder than English",
          "Thai and English are the same",
          "I speak Thai and English",
        ],
        correctAnswer: 1,
        explanation:
          "ยาก (yak) = difficult, ภาษา (pa-sa) = language, อังกฤษ (Ang-grit) = English.",
      },
      {
        id: "q3",
        thai: "ที่นี่ร้อนที่สุด",
        romanization: "Tee nee ron tee sut",
        english: "This place is the hottest",
        options: [
          "This place is hot",
          "This place is the hottest",
          "It's very hot here",
          "Is it hot here?",
        ],
        correctAnswer: 1,
        explanation:
          "ที่สุด (tee sut) is the superlative marker meaning 'the most'. ร้อน (ron) = hot + ที่สุด = the hottest.",
      },
      {
        id: "q4",
        thai: "เหมือนกัน",
        romanization: "Muan gan",
        english: "The same / Similar",
        options: ["Different", "The same / Similar", "Better", "Worse"],
        correctAnswer: 1,
        explanation:
          "เหมือนกัน (muan gan) means 'the same' or 'similar'. เหมือน (muan) = like/similar, กัน (gan) = each other.",
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonsByCategory(category: Category): Lesson[] {
  return LESSONS.filter((lesson) => lesson.category === category);
}

export function getRandomPracticeQuestions(count: number = 5): Question[] {
  const allQuestions = LESSONS.flatMap((lesson) => lesson.questions);
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case "beginner":
      return "#4CAF50";
    case "intermediate":
      return "#FF9800";
    case "advanced":
      return "#F44336";
    default:
      return "#757575";
  }
}
