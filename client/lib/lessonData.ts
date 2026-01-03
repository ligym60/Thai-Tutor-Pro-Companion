export type Category = "basics" | "greetings" | "food" | "travel" | "numbers";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string;
  thai: string;
  romanization: string;
  english: string;
  options: string[];
  correctAnswer: number;
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
      },
      {
        id: "q2",
        thai: "ลาก่อน",
        romanization: "La-gorn",
        english: "Goodbye",
        options: ["Hello", "Goodbye", "Please", "Yes"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        thai: "ขอบคุณ",
        romanization: "Kob-khun",
        english: "Thank you",
        options: ["Sorry", "Please", "Thank you", "Welcome"],
        correctAnswer: 2,
      },
      {
        id: "q4",
        thai: "ไม่เป็นไร",
        romanization: "Mai-pen-rai",
        english: "No problem / You're welcome",
        options: ["Sorry", "No problem / You're welcome", "Hello", "Goodbye"],
        correctAnswer: 1,
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
      },
      {
        id: "q2",
        thai: "ไม่",
        romanization: "Mai",
        english: "No",
        options: ["Yes", "Maybe", "No", "Later"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "ไม่ใช่",
        romanization: "Mai-chai",
        english: "Not / It's not",
        options: ["Yes it is", "Not / It's not", "Maybe", "I don't know"],
        correctAnswer: 1,
      },
      {
        id: "q4",
        thai: "ครับ/ค่ะ",
        romanization: "Krap/Ka",
        english: "Polite particle (m/f)",
        options: ["Thank you", "Sorry", "Polite particle (m/f)", "Hello"],
        correctAnswer: 2,
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
      },
      {
        id: "q2",
        thai: "สอง",
        romanization: "Song",
        english: "Two",
        options: ["One", "Three", "Two", "Five"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "สาม",
        romanization: "Sam",
        english: "Three",
        options: ["Two", "Four", "Five", "Three"],
        correctAnswer: 3,
      },
      {
        id: "q4",
        thai: "สี่",
        romanization: "See",
        english: "Four",
        options: ["Four", "Three", "Five", "Six"],
        correctAnswer: 0,
      },
      {
        id: "q5",
        thai: "ห้า",
        romanization: "Ha",
        english: "Five",
        options: ["Four", "Six", "Three", "Five"],
        correctAnswer: 3,
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
      },
      {
        id: "q2",
        thai: "เจ็ด",
        romanization: "Jet",
        english: "Seven",
        options: ["Six", "Eight", "Seven", "Nine"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "แปด",
        romanization: "Paet",
        english: "Eight",
        options: ["Seven", "Nine", "Ten", "Eight"],
        correctAnswer: 3,
      },
      {
        id: "q4",
        thai: "เก้า",
        romanization: "Gao",
        english: "Nine",
        options: ["Nine", "Eight", "Ten", "Seven"],
        correctAnswer: 0,
      },
      {
        id: "q5",
        thai: "สิบ",
        romanization: "Sip",
        english: "Ten",
        options: ["Nine", "Eleven", "Eight", "Ten"],
        correctAnswer: 3,
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
      },
      {
        id: "q2",
        thai: "น้ำ",
        romanization: "Nam",
        english: "Water",
        options: ["Rice", "Juice", "Water", "Milk"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "ไก่",
        romanization: "Gai",
        english: "Chicken",
        options: ["Pork", "Beef", "Fish", "Chicken"],
        correctAnswer: 3,
      },
      {
        id: "q4",
        thai: "หมู",
        romanization: "Moo",
        english: "Pork",
        options: ["Pork", "Chicken", "Beef", "Shrimp"],
        correctAnswer: 0,
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
      },
      {
        id: "q2",
        thai: "เผ็ด",
        romanization: "Pet",
        english: "Spicy",
        options: ["Spicy", "Salty", "Sweet", "Sour"],
        correctAnswer: 0,
      },
      {
        id: "q3",
        thai: "ขอเมนู",
        romanization: "Kho menu",
        english: "May I have the menu?",
        options: ["Check please", "May I have the menu?", "One more", "Water please"],
        correctAnswer: 1,
      },
      {
        id: "q4",
        thai: "เช็คบิล",
        romanization: "Check bin",
        english: "Check please",
        options: ["More water", "Check please", "Thank you", "Excuse me"],
        correctAnswer: 1,
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
        options: ["How much?", "Where are you going?", "What time?", "Who is it?"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        thai: "ที่นี่",
        romanization: "Tee nee",
        english: "Here",
        options: ["There", "Here", "Where", "Everywhere"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        thai: "ที่นั่น",
        romanization: "Tee nan",
        english: "There",
        options: ["Here", "Where", "There", "Everywhere"],
        correctAnswer: 2,
      },
      {
        id: "q4",
        thai: "ซ้าย",
        romanization: "Sai",
        english: "Left",
        options: ["Right", "Straight", "Left", "Back"],
        correctAnswer: 2,
      },
      {
        id: "q5",
        thai: "ขวา",
        romanization: "Kwa",
        english: "Right",
        options: ["Left", "Right", "Straight", "Back"],
        correctAnswer: 1,
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
      },
      {
        id: "q2",
        thai: "รถเมล์",
        romanization: "Rot may",
        english: "Bus",
        options: ["Train", "Bus", "Taxi", "Motorcycle"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        thai: "แท็กซี่",
        romanization: "Taxi",
        english: "Taxi",
        options: ["Bus", "Train", "Motorcycle", "Taxi"],
        correctAnswer: 3,
      },
      {
        id: "q4",
        thai: "เครื่องบิน",
        romanization: "Kreuang bin",
        english: "Airplane",
        options: ["Airplane", "Helicopter", "Boat", "Train"],
        correctAnswer: 0,
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
      },
      {
        id: "q2",
        thai: "ยินดี",
        romanization: "Yin dee",
        english: "Glad / Happy",
        options: ["Sad", "Angry", "Glad / Happy", "Tired"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "สบายดี",
        romanization: "Sa-bai dee",
        english: "I'm fine / How are you?",
        options: ["I'm hungry", "I'm fine / How are you?", "I'm tired", "I'm sick"],
        correctAnswer: 1,
      },
      {
        id: "q4",
        thai: "โชคดี",
        romanization: "Chok dee",
        english: "Good luck",
        options: ["Goodbye", "Good luck", "See you", "Take care"],
        correctAnswer: 1,
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
      },
      {
        id: "q2",
        thai: "ทำไม",
        romanization: "Tam-mai",
        english: "Why?",
        options: ["How?", "When?", "Why?", "What?"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        thai: "เมื่อไหร่",
        romanization: "Mua-rai",
        english: "When?",
        options: ["Where?", "How?", "What?", "When?"],
        correctAnswer: 3,
      },
      {
        id: "q4",
        thai: "ใคร",
        romanization: "Krai",
        english: "Who?",
        options: ["Who?", "What?", "Where?", "Why?"],
        correctAnswer: 0,
      },
      {
        id: "q5",
        thai: "ที่ไหน",
        romanization: "Tee-nai",
        english: "Where?",
        options: ["What?", "When?", "Where?", "How?"],
        correctAnswer: 2,
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
