import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { 
  User, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Globe,
  Check
} from "lucide-react-native";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import SecondaryTopBar from "../../../components/SecondaryTopBar";

export default function SettingsScreen() {
  const router = useRouter();
  const { student, signOut } = useAuth();
  const { theme, setTheme, colors } = useAppTheme();

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
  const BellIcon = Bell as any;
  const LogOutIcon = LogOut as any;
  const ChevronRightIcon = ChevronRight as any;
  const GlobeIcon = Globe as any;
  const CheckIcon = Check as any;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Section */}
        <TouchableOpacity 
          style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} 
          onPress={() => router.push("/profile" as any)}
          activeOpacity={0.7}
        >
          <View style={styles.profileRow}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <Text style={[styles.avatarText, { color: colors.surface }]}>{displayInitial}</Text>
              )}
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{displayName}</Text>
              <Text style={[styles.profileIndex, { color: colors.textSecondary }]}>
                {student?.student?.indexNumber || "STD2026A/L0001"}
              </Text>
              <Text style={[styles.profileBatch, { color: colors.textTertiary }]}>
                {student?.student?.batch || "Batch 2026 A/L"}
              </Text>
              <View style={[styles.viewProfileBadge, { backgroundColor: colors.primarySurface }]}>
                <Text style={[styles.viewProfileText, { color: colors.primary }]}>View Profile</Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>

        {/* Settings Options Group */}
        <View style={[styles.optionsGroup, { backgroundColor: colors.cardBg }]}>
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => router.push("/profile" as any)}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primarySurface }]}>
              <UserIcon size={20} color={colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Account</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textTertiary }]}>
                Personal details, parent info, school
              </Text>
            </View>
            <ChevronRightIcon size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/announcements" as any)}>
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primarySurface }]}>
              <BellIcon size={20} color={colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Notifications</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textTertiary }]}>
                Announcements feed, academic alerts
              </Text>
            </View>
            <ChevronRightIcon size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.optionRow} disabled>
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primarySurface }]}>
              <GlobeIcon size={20} color={colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>App Language</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textTertiary }]}>English (device's language)</Text>
            </View>
            <ChevronRightIcon size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Dedicated Appearance Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.optionsGroup, { backgroundColor: colors.cardBg }]}>
          <View style={styles.appearanceHeaderRow}>
            <Text style={[styles.appearanceTitle, { color: colors.textPrimary }]}>Theme</Text>
          </View>
          
          {/* Light Mode Selector Option */}
          <TouchableOpacity 
            style={styles.themeOptionRow} 
            onPress={() => setTheme('LIGHT')}
            activeOpacity={0.7}
          >
            <View style={styles.themeOptionLeft}>
              <View style={[
                styles.radioButton, 
                { borderColor: colors.border },
                theme === 'LIGHT' && { borderColor: colors.primary }
              ]}>
                {theme === 'LIGHT' && <View style={[styles.radioButtonDot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[styles.themeOptionLabel, { color: colors.textPrimary }]}>Light Mode</Text>
            </View>
            {theme === 'LIGHT' && <CheckIcon size={20} color={colors.primary} />}
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          {/* Dark Mode Selector Option */}
          <TouchableOpacity 
            style={styles.themeOptionRow} 
            onPress={() => setTheme('DARK')}
            activeOpacity={0.7}
          >
            <View style={styles.themeOptionLeft}>
              <View style={[
                styles.radioButton, 
                { borderColor: colors.border },
                theme === 'DARK' && { borderColor: colors.primary }
              ]}>
                {theme === 'DARK' && <View style={[styles.radioButtonDot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[styles.themeOptionLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            {theme === 'DARK' && <CheckIcon size={20} color={colors.primary} />}
          </TouchableOpacity>
        </View>

        {/* Danger/Action Group */}
        <View style={[styles.optionsGroup, { backgroundColor: colors.cardBg, marginTop: 16 }]}>
          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primarySurface }]}>
              <LogOutIcon size={20} color={colors.error} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.error }]}>Logout</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textTertiary }]}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>PyramidEdu Student Portal</Text>
          <Text style={[styles.footerVersion, { color: colors.textTertiary }]}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileIndex: {
    fontSize: 13,
    marginBottom: 2,
  },
  profileBatch: {
    fontSize: 12,
    marginBottom: 6,
  },
  viewProfileBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  viewProfileText: {
    fontSize: 10,
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 16,
  },
  optionsGroup: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginLeft: 66,
  },
  appearanceHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  appearanceTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  themeOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  themeOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeOptionLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  footerVersion: {
    fontSize: 11,
  },
});
