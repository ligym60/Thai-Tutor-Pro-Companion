import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import TipsScreen from "@/screens/TipsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type TipsStackParamList = {
  Tips: undefined;
};

const Stack = createNativeStackNavigator<TipsStackParamList>();

export default function TipsStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          headerTitle: t("tabs.travelTips"),
        }}
      />
    </Stack.Navigator>
  );
}
