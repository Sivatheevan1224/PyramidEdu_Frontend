import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useAuth } from "../modules/auth";
import { useAppTheme } from "../hooks/useAppTheme";
import { MOBILE_API_BASE_URL } from "../api/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopBar() {
  const router = useRouter();
  const { student, accessToken } = useAuth();
  const { colors, isDark } = useAppTheme();
  const [hasNotifications, setHasNotifications] = useState(false);
  
  const displayName = student?.fullName || student?.student?.firstName || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Handle profile image formatting (local relative path vs Cloudinary absolute URL)
  let avatarUri = "";
  if (student?.profileImage) {
    if (student.profileImage.startsWith("http")) {
      avatarUri = student.profileImage;
    } else {
      // Relative upload path, fallback to local dev host
      const host = "http://172.20.10.3:5000";
      avatarUri = `${host}${student.profileImage}`;
    }
  }

  useEffect(() => {
    // Fetch if there are any announcements to show a badge
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

  const handleAvatarPress = () => {
    router.push("/settings" as any);
  };

  const BellIcon = Bell as any;
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.headerBg, 
        borderBottomColor: colors.border,
        paddingTop: insets.top, 
        height: 56 + insets.top 
      }
    ]}>
      <View style={styles.leftSection}>
        <Text style={[styles.appName, { color: colors.headerText }]}>PyramidEdu</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {student?.student?.indexNumber || "Student Portal"}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/announcements" as any)}>
          <BellIcon size={22} color={colors.headerText} strokeWidth={1.5} />
          {hasNotifications && <View style={[styles.badge, { backgroundColor: colors.error }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarButton} onPress={handleAvatarPress}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                contentFit="cover"
                cachePolicy="disk"
              />
            ) : (
              <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>{displayInitial}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
