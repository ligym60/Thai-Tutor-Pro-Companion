import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeaderboardScreen from "@/screens/LeaderboardScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type LeaderboardStackParamList = {
  Leaderboard: undefined;
};

const Stack = createNativeStackNavigator<LeaderboardStackParamList>();

export default function LeaderboardStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          headerTitle: "Leaderboard",
        }}
      />
    </Stack.Navigator>
  );
}
