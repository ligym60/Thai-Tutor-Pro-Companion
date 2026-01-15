import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import LessonsScreen from "@/screens/LessonsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type LessonsStackParamList = {
  Lessons: undefined;
};

const Stack = createNativeStackNavigator<LessonsStackParamList>();

export default function LessonsStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{
          headerTitle: t("tabs.lessons"),
        }}
      />
    </Stack.Navigator>
  );
}
