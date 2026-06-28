import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Home, Award, BookOpen, MessageCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuth } from "../modules/auth";
import { ExamService } from "../modules/exams/services/api";
import { MOBILE_API_BASE_URL } from "../api/config";

interface BottomTabProps {
  active: "home" | "exams" | "learning" | "chat" | "profile" | "attendance";
}

const PILL_WIDTH = 64;
const PILL_HEIGHT = 42;

export default function BottomTabNavigator({ active }: BottomTabProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { accessToken } = useAuth();

  const [badgeCounts, setBadgeCounts] = useState({
    home: 0,
    exams: 0,
    learning: 2, // Mock count for premium visual feel
    chat: 1,     // Mock count for chatbot welcome message
  });

  const tabs = [
    {
      id: "home",
      icon: Home,
      route: "/dashboard",
    },
    {
      id: "exams",
      icon: Award,
      route: "/exams",
    },
    {
      id: "learning",
      icon: BookOpen,
      route: "/materials",
    },
    {
      id: "chat",
      icon: MessageCircle,
      route: "/chatbot",
    },
  ];

  // Fetch pending exams & announcements counts for live badges
  useEffect(() => {
    if (!accessToken) return;

    const fetchCounts = async () => {
      // 1. Fetch pending exams
      try {
        const availableExams = await ExamService.getAvailableExams();
        const unsubmittedCount = availableExams.filter(
          (e) => !e.submissions || e.submissions.length === 0
        ).length;
        setBadgeCounts((prev) => ({ ...prev, exams: unsubmittedCount }));
      } catch (err) {
        console.warn("Failed to fetch pending exams count for badge:", err);
      }

      // 2. Fetch announcements count for home badge
      try {
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        const response = await fetch(`${baseUrl}/announcements/received?limit=10`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && json.data && Array.isArray(json.data.data)) {
          setBadgeCounts((prev) => ({ ...prev, home: json.data.data.length }));
        }
      } catch (err) {
        console.warn("Failed to fetch announcements count for badge:", err);
      }
    };

    fetchCounts();
  }, [accessToken]);

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
          const badgeCount = badgeCounts[tab.id as keyof typeof badgeCounts];

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handlePress(tab.route, tab.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {/* Static Active Highlight Background */}
                {isActive && (
                  <View
                    style={[
                      styles.activeHighlight,
                      {
                        backgroundColor: colors.primarySurface,
                        width: PILL_WIDTH,
                        height: PILL_HEIGHT,
                        borderRadius: PILL_HEIGHT / 2,
                      },
                    ]}
                  />
                )}

                <Icon
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />

                {/* Badge Overlay */}
                {badgeCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.error, borderColor: colors.surface }]}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  tabsWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  activeHighlight: {
    position: "absolute",
    alignSelf: "center",
  },
  tab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 12,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
  },
});
