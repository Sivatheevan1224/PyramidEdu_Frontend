import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { 
  User, 
  LogOut, 
  ChevronRight,
  Lock
} from "lucide-react-native";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import { useConfirmation } from "../../../context/ConfirmationContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { student, signOut } = useAuth();
  const { theme, setTheme, colors } = useAppTheme();
  const { confirm } = useConfirmation();

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

  const handleLogout = () => {
    confirm({
      title: "Logout",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        await signOut();
        router.replace("/(welcome)" as any);
      }
    });
  };

  // Icons mapping
  const UserIcon = User as any;
  const LogOutIcon = LogOut as any;
  const ChevronRightIcon = ChevronRight as any;
  const LockIcon = Lock as any;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Settings" rightType="theme" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Centered Section */}
        <View style={styles.profileCenteredContainer}>
          <View style={[styles.avatarContainerLarge, { backgroundColor: colors.primary }]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={[styles.avatarTextLarge, { color: colors.surface }]}>{displayInitial}</Text>
            )}
          </View>
          <Text style={[styles.profileNameCentered, { color: colors.textPrimary }]}>{displayName}</Text>
        </View>

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

          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => router.push("/settings/change-password" as any)}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: colors.primarySurface }]}>
              <LockIcon size={20} color={colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Change Password</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textTertiary }]}>
                Update and secure your account password
              </Text>
            </View>
            <ChevronRightIcon size={18} color={colors.textTertiary} />
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
  profileCenteredContainer: {
    alignItems: "center",
    marginVertical: 28,
  },
  avatarContainerLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarTextLarge: {
    fontSize: 40,
    fontWeight: "700",
  },
  profileNameCentered: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
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
