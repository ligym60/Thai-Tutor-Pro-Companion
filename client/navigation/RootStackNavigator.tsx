import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import LessonDetailScreen from "@/screens/LessonDetailScreen";
import PracticeScreen from "@/screens/PracticeScreen";
import SpeakingPracticeScreen from "@/screens/SpeakingPracticeScreen";
import ReviewScreen from "@/screens/ReviewScreen";
import StoryReaderScreen from "@/screens/StoryReaderScreen";
import StoryQuizScreen from "@/screens/StoryQuizScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  LessonDetail: { lessonId: string };
  Practice: undefined;
  SpeakingPractice: undefined;
  Review: undefined;
  StoryReader: { storyId: string };
  StoryQuiz: { storyId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SpeakingPractice"
        component={SpeakingPracticeScreen}
        options={{
          presentation: "card",
          headerTitle: "Speaking Practice",
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          presentation: "card",
          headerTitle: "Vocabulary Review",
        }}
      />
      <Stack.Screen
        name="StoryReader"
        component={StoryReaderScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StoryQuiz"
        component={StoryQuizScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
