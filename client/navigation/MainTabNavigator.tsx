import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import LessonsStackNavigator from "@/navigation/LessonsStackNavigator";
import StoriesStackNavigator from "@/navigation/StoriesStackNavigator";
import TipsStackNavigator from "@/navigation/TipsStackNavigator";
import MuayThaiStackNavigator from "@/navigation/MuayThaiStackNavigator";
import LeaderboardStackNavigator from "@/navigation/LeaderboardStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export type MainTabParamList = {
  HomeTab: undefined;
  LessonsTab: undefined;
  StoriesTab: undefined;
  TipsTab: undefined;
  MuayThaiTab: undefined;
  LeaderboardTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePracticePress = () => {
    navigation.navigate("Practice");
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={{
          tabBarActiveTintColor: theme.tabIconSelected,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundRoot,
            }),
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={100}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            title: t("navigation:tabs.home"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LessonsTab"
          component={LessonsStackNavigator}
          options={{
            title: t("navigation:tabs.lessons"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="StoriesTab"
          component={StoriesStackNavigator}
          options={{
            title: t("navigation:tabs.stories"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TipsTab"
          component={TipsStackNavigator}
          options={{
            title: t("navigation:tabs.tips"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="info" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MuayThaiTab"
          component={MuayThaiStackNavigator}
          options={{
            title: t("navigation:tabs.muayThai"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="zap" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LeaderboardTab"
          component={LeaderboardStackNavigator}
          options={{
            title: t("navigation:tabs.rank"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="award" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: t("navigation:tabs.profile"),
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingActionButton onPress={handlePracticePress} />
    </>
  );
}
