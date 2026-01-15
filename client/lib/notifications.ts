import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_ID_KEY = "@thaiboxer_notification_ids";

// Configure how notifications behave when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Motivational messages for workout reminders
const MOTIVATIONAL_MESSAGES = [
  {
    title: "Time to Train! 🥊",
    body: "Your Muay Thai workout is waiting. Let's build that warrior spirit!",
  },
  {
    title: "Chok Dee! (Good Luck) 🇹🇭",
    body: "Champions train every day. Ready for your session?",
  },
  {
    title: "Warrior Mode: ON 💪",
    body: "Your daily Muay Thai training awaits. No excuses!",
  },
  {
    title: "Train Like a Champion 🏆",
    body: "Consistency is key. Time for your workout!",
  },
  {
    title: "Sawadee! Time to Train 🙏",
    body: "Your body is ready. Let's practice those combinations!",
  },
  {
    title: "Stay Strong, Keep Training 🔥",
    body: "Every rep counts. Start your Muay Thai session now!",
  },
  {
    title: "The Ring is Calling 🥊",
    body: "Don't skip today's training. Your future self will thank you!",
  },
  {
    title: "Muay Thai Time! ⚡",
    body: "Sharpen your skills. Your workout is ready and waiting.",
  },
];

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  // Android requires a channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("workout-reminders", {
      name: "Workout Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#8B4FD9",
    });
  }

  return true;
}

export async function scheduleWorkoutNotifications(
  enabled: boolean,
  timeString: string // "HH:MM" format
): Promise<void> {
  // Cancel all existing notifications first
  await cancelAllNotifications();

  if (!enabled) {
    return;
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  const notificationIds: string[] = [];

  // Schedule notifications for the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const message =
      MOTIVATIONAL_MESSAGES[dayOffset % MOTIVATIONAL_MESSAGES.length];

    const trigger = new Date();
    trigger.setDate(trigger.getDate() + dayOffset);
    trigger.setHours(hours, minutes, 0, 0);

    // Don't schedule if the time has already passed today
    if (dayOffset === 0 && trigger.getTime() < Date.now()) {
      continue;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });

    notificationIds.push(id);
  }

  // Store notification IDs for later cancellation
  await AsyncStorage.setItem(
    NOTIFICATION_ID_KEY,
    JSON.stringify(notificationIds)
  );
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    // Cancel all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Clear stored IDs
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}

export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Helper to format time for display
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Helper to parse display time back to 24h format
export function parseTimeToString(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
