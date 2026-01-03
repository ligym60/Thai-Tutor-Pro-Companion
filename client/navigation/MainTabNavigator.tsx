import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import LessonsStackNavigator from "@/navigation/LessonsStackNavigator";
import StoriesStackNavigator from "@/navigation/StoriesStackNavigator";
import TipsStackNavigator from "@/navigation/TipsStackNavigator";
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
  LeaderboardTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
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
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LessonsTab"
          component={LessonsStackNavigator}
          options={{
            title: "Lessons",
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="StoriesTab"
          component={StoriesStackNavigator}
          options={{
            title: "Stories",
            tabBarIcon: ({ color, size }) => (
              <Feather name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TipsTab"
          component={TipsStackNavigator}
          options={{
            title: "Tips",
            tabBarIcon: ({ color, size }) => (
              <Feather name="info" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LeaderboardTab"
          component={LeaderboardStackNavigator}
          options={{
            title: "Rank",
            tabBarIcon: ({ color, size }) => (
              <Feather name="award" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: "Profile",
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
