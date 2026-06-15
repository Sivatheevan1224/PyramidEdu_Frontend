import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Colors } from "../constants/colors";
import { useAuth } from "../modules/auth";

export default function TopBar() {
  const router = useRouter();
  const { student } = useAuth();
  
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

  const handleAvatarPress = () => {
    router.push("/profile" as any);
  };

  const BellIcon = Bell as any;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.appName}>PyramidEdu</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {student?.student?.indexNumber || "Student Portal"}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/announcements" as any)}>
          <BellIcon size={24} color={Colors.textPrimary} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton} onPress={handleAvatarPress}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                contentFit="cover"
                cachePolicy="disk"
              />
            ) : (
              <Text style={styles.avatarText}>{displayInitial}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
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
    color: Colors.textInverse,
  },
});
