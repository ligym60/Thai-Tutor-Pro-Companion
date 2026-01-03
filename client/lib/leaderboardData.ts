export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarPreset: number;
  xp: number;
  trend: "up" | "down" | "same";
}

const MOCK_NAMES = [
  "Somchai",
  "Niran",
  "Priya",
  "Kanya",
  "Tawan",
  "Malee",
  "Chai",
  "Lek",
  "Ploy",
  "Nat",
  "Boon",
  "Dao",
  "Fah",
  "Joy",
  "Kim",
];

export function generateLeaderboard(userXP: number, userName: string): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  
  const baseXPs = [
    2500, 2100, 1800, 1500, 1200, 1000, 850, 700, 550, 400, 300, 200, 150, 100, 50
  ];
  
  for (let i = 0; i < 15; i++) {
    const variation = Math.floor(Math.random() * 200) - 100;
    entries.push({
      id: `user-${i}`,
      name: MOCK_NAMES[i],
      avatarPreset: i % 3,
      xp: Math.max(0, baseXPs[i] + variation),
      trend: ["up", "down", "same"][Math.floor(Math.random() * 3)] as "up" | "down" | "same",
    });
  }
  
  entries.push({
    id: "current-user",
    name: userName,
    avatarPreset: 0,
    xp: userXP,
    trend: "up",
  });
  
  entries.sort((a, b) => b.xp - a.xp);
  
  return entries;
}

export function getUserRank(entries: LeaderboardEntry[]): number {
  const userIndex = entries.findIndex((e) => e.id === "current-user");
  return userIndex + 1;
}
