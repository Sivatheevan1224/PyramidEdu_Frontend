import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Home, Award, BookOpen, MessageCircle, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "../hooks/useAppTheme";

interface BottomTabProps {
  active: "home" | "exams" | "learning" | "chat" | "profile" | "attendance";
}

export default function BottomTabNavigator({ active }: BottomTabProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      route: "/dashboard",
    },
    {
      id: "exams",
      label: "Exams",
      icon: Award,
      route: "/exams",
    },
    {
      id: "learning",
      label: "Learning",
      icon: BookOpen,
      route: "/materials",
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageCircle,
      route: "/chatbot",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      route: "/profile",
    },
  ];

  const handlePress = (route: string, tabId: string) => {
    if (tabId !== active) {
      router.push(route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && { backgroundColor: colors.primarySurface }]}
              onPress={() => handlePress(tab.route, tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && { backgroundColor: colors.primarySurface },
                ]}
              >
                <Icon
                  size={24}
                  color={isActive ? colors.primary : colors.textTertiary}
                  strokeWidth={1.5}
                />
              </View>
              <Text style={[styles.label, { color: colors.textTertiary }, isActive && { color: colors.primary, fontWeight: "700" }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderTopWidth: 1,
    paddingBottom: 0,
  },
  tabsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
});
