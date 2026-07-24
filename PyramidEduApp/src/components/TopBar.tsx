import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from "react-native";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useAuth } from "../modules/auth";
import { useAppTheme } from "../hooks/useAppTheme";
import { BACKEND_HOST_URL } from "../api/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import client from "../api/client";

export default function TopBar() {
  const router = useRouter();
  const { student, accessToken } = useAuth();
  const { colors, isDark } = useAppTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const displayName = student?.fullName || student?.student?.firstName || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Handle profile image formatting (local relative path vs Cloudinary absolute URL)
  let avatarUri = "";
  if (student?.profileImage) {
    if (student.profileImage.startsWith("http")) {
      avatarUri = student.profileImage;
    } else {
      // Relative upload path, fallback to local dev host
      avatarUri = `${BACKEND_HOST_URL}${student.profileImage}`;
    }
  }

  useEffect(() => {
    const fetchCount = async () => {
      if (!accessToken) return;
      try {
        const response = await client.get('/notifications/unread-count');
        if (response.data?.success) {
          setUnreadCount(response.data.data.count || 0);
        }
      } catch (err) {
        console.warn("Failed to fetch unread notifications count:", err);
      }
    };

    fetchCount();

    // Listen for manual updates from the notification screen
    const subscription = DeviceEventEmitter.addListener("notificationCountChanged", fetchCount);

    // Also poll every 10 seconds for real-time updates
    const interval = setInterval(fetchCount, 10000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
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
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/notifications" as any)}>
          <BellIcon size={22} color={colors.headerText} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
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
    top: 2,
    right: 2,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: "white",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
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
