import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MuayThaiScreen from "@/screens/MuayThaiScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type MuayThaiStackParamList = {
  MuayThai: undefined;
};

const Stack = createNativeStackNavigator<MuayThaiStackParamList>();

export default function MuayThaiStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MuayThai"
        component={MuayThaiScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
