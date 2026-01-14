import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LessonsScreen from "@/screens/LessonsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type LessonsStackParamList = {
  Lessons: undefined;
};

const Stack = createNativeStackNavigator<LessonsStackParamList>();

export default function LessonsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          headerTitle: "Lessons",
        }}
      />
    </Stack.Navigator>
  );
}
