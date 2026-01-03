export interface CulturalTip {
  id: string;
  title: string;
  titleThai: string;
  description: string;
  category: "etiquette" | "religion" | "social" | "food" | "general";
  icon: string;
}

export interface ThingToAvoid {
  id: string;
  rank: number;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  icon: string;
}

export const culturalTips: CulturalTip[] = [
  {
    id: "tip-1",
    title: "The Wai Greeting",
    titleThai: "การไหว้",
    description: "The traditional Thai greeting involves pressing palms together in a prayer-like gesture and bowing slightly. The higher the hands and deeper the bow, the more respect shown. Younger people wai to elders first.",
    category: "etiquette",
    icon: "heart",
  },
  {
    id: "tip-2",
    title: "Remove Shoes Indoors",
    titleThai: "ถอดรองเท้า",
    description: "Always remove your shoes before entering homes, temples, and some shops. Look for a pile of shoes at the entrance as a cue. This shows respect and keeps spaces clean.",
    category: "etiquette",
    icon: "home",
  },
  {
    id: "tip-3",
    title: "Respect for the Royal Family",
    titleThai: "เคารพราชวงศ์",
    description: "Thai people hold deep reverence for the monarchy. Speaking negatively about the royal family is illegal and deeply offensive. Stand when the royal anthem plays in cinemas.",
    category: "social",
    icon: "star",
  },
  {
    id: "tip-4",
    title: "Head is Sacred, Feet are Low",
    titleThai: "หัวศักดิ์สิทธิ์",
    description: "The head is considered the most sacred part of the body. Never touch someone's head, even children. Feet are the lowest, so never point them at people or Buddha images.",
    category: "religion",
    icon: "user",
  },
  {
    id: "tip-5",
    title: "Temple Etiquette",
    titleThai: "มารยาทในวัด",
    description: "Dress modestly at temples - cover shoulders and knees. Remove shoes before entering buildings. Women should never touch monks or hand things directly to them.",
    category: "religion",
    icon: "sun",
  },
  {
    id: "tip-6",
    title: "Thai Food Culture",
    titleThai: "วัฒนธรรมอาหาร",
    description: "Thai meals are shared family-style with many dishes in the center. Rice is the foundation of every meal. Use a spoon as your main utensil and fork to push food onto it.",
    category: "food",
    icon: "coffee",
  },
  {
    id: "tip-7",
    title: "Saving Face",
    titleThai: "รักษาหน้า",
    description: "Thais value keeping calm and avoiding public confrontation. Losing your temper or causing someone to 'lose face' publicly is very embarrassing. Stay patient and smile.",
    category: "social",
    icon: "smile",
  },
  {
    id: "tip-8",
    title: "The Thai Smile",
    titleThai: "รอยยิ้มไทย",
    description: "Thailand is called the 'Land of Smiles.' Smiling is used not just for happiness but also to apologize, show embarrassment, or ease tension. Return smiles graciously.",
    category: "social",
    icon: "smile",
  },
  {
    id: "tip-9",
    title: "Bargaining at Markets",
    titleThai: "ต่อรองราคา",
    description: "Bargaining is expected at markets and with street vendors, but not in malls or restaurants with fixed prices. Be friendly and don't bargain too aggressively - it should be fun.",
    category: "general",
    icon: "shopping-bag",
  },
  {
    id: "tip-10",
    title: "Tipping Culture",
    titleThai: "การให้ทิป",
    description: "Tipping is not mandatory but appreciated. Round up the bill at restaurants or leave small change. Hotel porters and spa staff appreciate tips of 20-50 baht.",
    category: "general",
    icon: "dollar-sign",
  },
  {
    id: "tip-11",
    title: "Buddhist Practices",
    titleThai: "ปฏิบัติธรรม",
    description: "Buddhism deeply influences Thai daily life. Making merit through temple visits, giving alms to monks, and respecting Buddha images is very important.",
    category: "religion",
    icon: "sun",
  },
  {
    id: "tip-12",
    title: "Thai Time",
    titleThai: "เวลาไทย",
    description: "Things often run on 'Thai time' - slightly more relaxed than Western schedules. Patience is valued, and rushing is considered rude. Embrace the slower pace.",
    category: "social",
    icon: "clock",
  },
];

export const thingsToAvoid: ThingToAvoid[] = [
  {
    id: "avoid-1",
    rank: 1,
    title: "Disrespecting the Royal Family",
    description: "Never criticize, mock, or speak negatively about the King or royal family. This is illegal under lese-majeste laws and can result in serious legal consequences.",
    severity: "high",
    icon: "alert-triangle",
  },
  {
    id: "avoid-2",
    rank: 2,
    title: "Touching Someone's Head",
    description: "The head is considered the most sacred part of the body in Thai culture. Never pat anyone on the head, including children, as this is highly disrespectful.",
    severity: "high",
    icon: "x-circle",
  },
  {
    id: "avoid-3",
    rank: 3,
    title: "Pointing Feet at Buddha or People",
    description: "Feet are considered the lowest and dirtiest part of the body. Never point your feet at Buddha statues, temples, or people. Sit with feet tucked away.",
    severity: "high",
    icon: "x-circle",
  },
  {
    id: "avoid-4",
    rank: 4,
    title: "Stepping on Money",
    description: "Thai currency features the King's image. Stepping on money to stop it from blowing away is extremely disrespectful. Always pick it up with your hands.",
    severity: "high",
    icon: "dollar-sign",
  },
  {
    id: "avoid-5",
    rank: 5,
    title: "Disrespecting Buddha Images",
    description: "Never climb on Buddha statues for photos, point at them, or treat them as decoration. Buddha images are sacred objects deserving reverence.",
    severity: "high",
    icon: "alert-triangle",
  },
  {
    id: "avoid-6",
    rank: 6,
    title: "Public Displays of Anger",
    description: "Losing your temper in public is seen as losing control and causes everyone involved to 'lose face.' Stay calm and handle disagreements privately.",
    severity: "medium",
    icon: "frown",
  },
  {
    id: "avoid-7",
    rank: 7,
    title: "Women Touching Monks",
    description: "Women should never touch Buddhist monks or hand objects directly to them. Place items on a cloth or table for the monk to pick up.",
    severity: "high",
    icon: "user-x",
  },
  {
    id: "avoid-8",
    rank: 8,
    title: "Wearing Shoes Indoors",
    description: "Always remove shoes before entering homes, temples, and some businesses. Look for shoes at the doorway as a cue. Wearing shoes inside is rude.",
    severity: "medium",
    icon: "home",
  },
  {
    id: "avoid-9",
    rank: 9,
    title: "Dressing Inappropriately at Temples",
    description: "Cover shoulders and knees when visiting temples. Avoid tight, revealing, or see-through clothing. Some temples provide cover-ups if needed.",
    severity: "medium",
    icon: "eye-off",
  },
  {
    id: "avoid-10",
    rank: 10,
    title: "Public Displays of Affection",
    description: "Kissing, hugging, or other intimate gestures in public are considered inappropriate. Holding hands is acceptable, but keep affection private.",
    severity: "low",
    icon: "heart",
  },
  {
    id: "avoid-11",
    rank: 11,
    title: "Pointing with Your Finger",
    description: "Pointing at people or things with your index finger is rude. Use your whole hand with palm facing up, or nod with your chin to indicate direction.",
    severity: "low",
    icon: "hand",
  },
  {
    id: "avoid-12",
    rank: 12,
    title: "Refusing Food Offered by Hosts",
    description: "When Thai hosts offer food or drinks, it's polite to accept. Flat refusal can seem ungracious. Take a small portion if you're not hungry.",
    severity: "low",
    icon: "coffee",
  },
  {
    id: "avoid-13",
    rank: 13,
    title: "Ignoring the National Anthem",
    description: "The national anthem plays at 8am and 6pm in public spaces. Thais stop and stand still. Do the same out of respect, even as a tourist.",
    severity: "medium",
    icon: "music",
  },
  {
    id: "avoid-14",
    rank: 14,
    title: "Overly Aggressive Bargaining",
    description: "While bargaining is expected at markets, being too aggressive or rude damages relationships. Keep it friendly and know when to walk away gracefully.",
    severity: "low",
    icon: "shopping-bag",
  },
  {
    id: "avoid-15",
    rank: 15,
    title: "Talking Loudly in Temples",
    description: "Temples are places of quiet reflection. Keep your voice low, turn off phone ringers, and move calmly. Running or shouting is very disrespectful.",
    severity: "medium",
    icon: "volume-x",
  },
  {
    id: "avoid-16",
    rank: 16,
    title: "Sunbathing Topless",
    description: "Thailand is more conservative than some tourists expect. Topless sunbathing is illegal on public beaches and highly offensive locally.",
    severity: "medium",
    icon: "sun",
  },
  {
    id: "avoid-17",
    rank: 17,
    title: "Littering",
    description: "Thailand has strict littering laws with fines. Beyond legal issues, keep beaches and natural areas clean. Many Thais volunteer for cleanup efforts.",
    severity: "low",
    icon: "trash-2",
  },
  {
    id: "avoid-18",
    rank: 18,
    title: "Riding Elephants",
    description: "Many elephant tourism operations involve animal cruelty. Choose ethical sanctuaries where elephants aren't ridden or forced to perform.",
    severity: "medium",
    icon: "alert-circle",
  },
  {
    id: "avoid-19",
    rank: 19,
    title: "Drinking Tap Water",
    description: "Tap water in Thailand is not safe to drink. Always use bottled water, even for brushing teeth. Ice in restaurants is usually made from purified water.",
    severity: "low",
    icon: "droplet",
  },
  {
    id: "avoid-20",
    rank: 20,
    title: "Ignoring Scam Warnings",
    description: "Common scams include gem deals, tuk-tuk tours to 'special' shops, and 'closed temple' redirects. If a deal seems too good, it probably is. Be cautious.",
    severity: "low",
    icon: "alert-circle",
  },
];

export const getCulturalTipsByCategory = (category: CulturalTip["category"]) => {
  return culturalTips.filter((tip) => tip.category === category);
};

export const getThingsToAvoidBySeverity = (severity: ThingToAvoid["severity"]) => {
  return thingsToAvoid.filter((item) => item.severity === severity);
};
