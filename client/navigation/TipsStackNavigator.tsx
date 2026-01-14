import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TipsScreen from "@/screens/TipsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type TipsStackParamList = {
  Tips: undefined;
};

const Stack = createNativeStackNavigator<TipsStackParamList>();

export default function TipsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          headerTitle: "Travel Tips",
        }}
      />
    </Stack.Navigator>
  );
}
