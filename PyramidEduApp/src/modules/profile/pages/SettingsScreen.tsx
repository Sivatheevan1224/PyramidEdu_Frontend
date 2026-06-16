import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { 
  User, 
  BookOpen, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  ChevronRight, 
  Globe
} from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { useTheme } from "../../../store/uiStore";
import SecondaryTopBar from "../../../components/SecondaryTopBar";

export default function SettingsScreen() {
  const router = useRouter();
  const { student, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const displayName = student?.fullName || student?.student?.firstName || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Handle profile image formatting
  let avatarUri = "";
  if (student?.profileImage) {
    if (student.profileImage.startsWith("http")) {
      avatarUri = student.profileImage;
    } else {
      const host = "http://172.20.10.3:5000";
      avatarUri = `${host}${student.profileImage}`;
    }
  }

  const handleLogout = async () => {
    await signOut();
    router.replace("/(welcome)" as any);
  };

  // Icons mapping
  const UserIcon = User as any;
  const BookOpenIcon = BookOpen as any;
  const BellIcon = Bell as any;
  const MoonIcon = Moon as any;
  const SunIcon = Sun as any;
  const LogOutIcon = LogOut as any;
  const ChevronRightIcon = ChevronRight as any;
  const GlobeIcon = Globe as any;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["top", "bottom"]}>
      <SecondaryTopBar title="Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Section */}
        <TouchableOpacity 
          style={[styles.profileCard, isDark && styles.cardDark]} 
          onPress={() => router.push("/profile" as any)}
          activeOpacity={0.7}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <Text style={styles.avatarText}>{displayInitial}</Text>
              )}
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, isDark && styles.textWhite]}>{displayName}</Text>
              <Text style={[styles.profileIndex, isDark && styles.textMuted]}>
                {student?.student?.indexNumber || "STD2026A/L0001"}
              </Text>
              <Text style={[styles.profileBatch, isDark && styles.textMuted]}>
                {student?.student?.batch || "Batch 2026 A/L"}
              </Text>
              <View style={styles.viewProfileBadge}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={isDark ? "#8E8E93" : "#C7C7CC"} />
          </View>
        </TouchableOpacity>

        {/* Settings Options Group */}
        <View style={[styles.optionsGroup, isDark && styles.optionsGroupDark]}>
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => router.push("/profile" as any)}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: "#E8F5E9" }]}>
              <UserIcon size={20} color="#2E7D32" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.textWhite]}>Account</Text>
              <Text style={[styles.optionSubtitle, isDark && styles.textMuted]}>
                Personal details, parent info, school
              </Text>
            </View>
            <ChevronRightIcon size={18} color={isDark ? "#8E8E93" : "#C7C7CC"} />
          </TouchableOpacity>

          <View style={[styles.separator, isDark && styles.separatorDark]} />

          <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/announcements" as any)}>
            <View style={[styles.optionIconContainer, { backgroundColor: "#E3F2FD" }]}>
              <BellIcon size={20} color="#1565C0" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.textWhite]}>Notifications</Text>
              <Text style={[styles.optionSubtitle, isDark && styles.textMuted]}>
                Announcements feed, academic alerts
              </Text>
            </View>
            <ChevronRightIcon size={18} color={isDark ? "#8E8E93" : "#C7C7CC"} />
          </TouchableOpacity>

          <View style={[styles.separator, isDark && styles.separatorDark]} />

          <TouchableOpacity style={styles.optionRow} onPress={toggleTheme}>
            <View style={[styles.optionIconContainer, { backgroundColor: "#FFF8E1" }]}>
              {isDark ? <SunIcon size={20} color="#F57F17" /> : <MoonIcon size={20} color="#F57F17" />}
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.textWhite]}>Theme</Text>
              <Text style={[styles.optionSubtitle, isDark && styles.textMuted]}>
                Switch between Light and Dark mode
              </Text>
            </View>
            <Text style={[styles.themeValueText, isDark && styles.textMuted]}>
              {theme.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <View style={[styles.separator, isDark && styles.separatorDark]} />

          <TouchableOpacity style={styles.optionRow} disabled>
            <View style={[styles.optionIconContainer, { backgroundColor: "#F3E5F5" }]}>
              <GlobeIcon size={20} color="#6A1B9A" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isDark && styles.textWhite]}>App Language</Text>
              <Text style={[styles.optionSubtitle, isDark && styles.textMuted]}>English (device's language)</Text>
            </View>
            <ChevronRightIcon size={18} color={isDark ? "#8E8E93" : "#C7C7CC"} />
          </TouchableOpacity>
        </View>

        {/* Danger/Action Group */}
        <View style={[styles.optionsGroup, isDark && styles.optionsGroupDark, { marginTop: 16 }]}>
          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <View style={[styles.optionIconContainer, { backgroundColor: "#FFEBEE" }]}>
              <LogOutIcon size={20} color="#C62828" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: "#C62828" }]}>Logout</Text>
              <Text style={[styles.optionSubtitle, isDark && styles.textMuted]}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.textMuted]}>PyramidEdu Student Portal</Text>
          <Text style={[styles.footerVersion, isDark && styles.textMuted]}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  containerDark: {
    backgroundColor: "#0B141A",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#121B22",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 16,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileIndex: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  profileBatch: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  viewProfileBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  viewProfileText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textMuted: {
    color: "#8E8E93",
  },
  optionsGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  optionsGroupDark: {
    backgroundColor: "#121B22",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  optionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginLeft: 66,
  },
  separatorDark: {
    backgroundColor: "#222D34",
  },
  themeValueText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textTertiary,
  },
  footerVersion: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
