import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import LeaderboardScreen from "@/screens/LeaderboardScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type LeaderboardStackParamList = {
  Leaderboard: undefined;
};

const Stack = createNativeStackNavigator<LeaderboardStackParamList>();

export default function LeaderboardStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          headerTitle: t("tabs.leaderboard"),
        }}
      />
    </Stack.Navigator>
  );
}
