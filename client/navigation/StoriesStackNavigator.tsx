import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import StoriesScreen from "@/screens/StoriesScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type StoriesStackParamList = {
  Stories: undefined;
};

const Stack = createNativeStackNavigator<StoriesStackParamList>();

export default function StoriesStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useTranslation("navigation");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Stories"
        component={StoriesScreen}
        options={{
          headerTitle: t("tabs.stories"),
        }}
      />
    </Stack.Navigator>
  );
}
