import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { useAuth } from "../modules/auth";
import { useTheme } from "../store/uiStore";
import { MOBILE_API_BASE_URL } from "../api/config";

interface SecondaryTopBarProps {
  title: string;
}

export default function SecondaryTopBar({ title }: SecondaryTopBarProps) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { theme } = useTheme();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const checkAnnouncements = async () => {
      if (!accessToken) return;
      try {
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        const response = await fetch(`${baseUrl}/announcements/received?limit=1`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && json.data && Array.isArray(json.data.data) && json.data.data.length > 0) {
          setHasNotifications(true);
        }
      } catch (err) {
        console.error("Failed to fetch notification status", err);
      }
    };
    checkAnnouncements();
  }, [accessToken]);

  const isDark = theme === "dark";
  const ArrowLeftIcon = ArrowLeft as any;
  const BellIcon = Bell as any;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={isDark ? "#FFFFFF" : Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/announcements" as any)}>
        <BellIcon size={22} color={isDark ? "#FFFFFF" : Colors.textPrimary} strokeWidth={1.5} />
        {hasNotifications && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerDark: {
    backgroundColor: "#1C1C1E",
    borderBottomColor: "#2C2C2E",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger || "#FF3B30",
  },
});
