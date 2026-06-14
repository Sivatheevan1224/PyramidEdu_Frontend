import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Home, Award, BookOpen, MessageCircle, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";

interface BottomTabProps {
  active: "home" | "exams" | "learning" | "chat" | "profile" | "attendance";
}

export default function BottomTabNavigator({ active }: BottomTabProps) {
  const router = useRouter();

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
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handlePress(tab.route, tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && styles.iconWrapperActive,
                ]}
              >
                <Icon
                  size={24}
                  color={isActive ? Colors.primary : Colors.textTertiary}
                  strokeWidth={1.5}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
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
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
  tabActive: {
    backgroundColor: Colors.primarySurface,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primarySurface,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textTertiary,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
