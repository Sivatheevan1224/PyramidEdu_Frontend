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

const PILL_WIDTH = 56;
const PILL_HEIGHT = 32;

export default function BottomTabNavigator({ active }: BottomTabProps) {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { accessToken } = useAuth();

  const [badgeCounts, setBadgeCounts] = useState({
    home: 0,
    exams: 0,
    learning: 0,
    chat: 0,
  });

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
      label: "Notes",
      icon: BookOpen,
      route: "/materials",
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageCircle,
      route: "/chatbot",
    },
  ];

  // Fetch pending exams, announcements & study materials counts for live badges
  useEffect(() => {
    if (!accessToken) return;

    const fetchCounts = async () => {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");

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

      // 3. Fetch study materials count for learning/notes badge
      try {
        const response = await fetch(`${baseUrl}/study-materials`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setBadgeCounts((prev) => ({ ...prev, learning: json.data.length }));
        }
      } catch (err) {
        console.warn("Failed to fetch study materials count for badge:", err);
      }
    };

    fetchCounts();
  }, [accessToken]);

  const handlePress = (route: string, tabId: string) => {
    if (tabId !== active) {
      router.push(route as any);
    }
  };

  const activePillBg = isDark ? "rgba(37, 211, 102, 0.22)" : "rgba(37, 211, 102, 0.16)";
  const activePillBorder = isDark ? "rgba(37, 211, 102, 0.45)" : "rgba(37, 211, 102, 0.35)";
  const activeIconColor = isDark ? "#25D366" : "#059669";
  const inactiveIconColor = isDark ? "rgba(255, 255, 255, 0.60)" : "#64748B";

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
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {/* Active Highlight Background Pill */}
                {isActive && (
                  <View
                    style={[
                      styles.activeHighlight,
                      {
                        backgroundColor: activePillBg,
                        borderColor: activePillBorder,
                        borderWidth: 1,
                        width: PILL_WIDTH,
                        height: PILL_HEIGHT,
                        borderRadius: PILL_HEIGHT / 2,
                      },
                    ]}
                  />
                )}

                <Icon
                  size={20}
                  color={isActive ? activeIconColor : inactiveIconColor}
                  stroke={isActive ? activeIconColor : inactiveIconColor}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />

                {badgeCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.error, borderColor: colors.surface }]}>
                    <Text style={styles.badgeText}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? activeIconColor : inactiveIconColor,
                    fontWeight: isActive ? "700" : "500",
                  },
                ]}
              >
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
    height: 68,
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
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
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 4,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
  },
});

