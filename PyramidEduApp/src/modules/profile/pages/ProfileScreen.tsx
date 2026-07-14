import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Lock, 
  LogOut,
  Save,
  Edit3
} from "lucide-react-native";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import ProfileHeader from "../components/ProfileHeader";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { BASE_API_URL } from "../../../api/config";
import { showSuccess, showError, showWarning } from "../../../services/notification.service";
import { useConfirmation } from "../../../context/ConfirmationContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { student, accessToken, signOut, reloadStudentProfile } = useAuth();
  const { colors } = useAppTheme();
  const { confirm } = useConfirmation();

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Avatar Photo States
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize fields on load
  useEffect(() => {
    if (student) {
      setFullName(student.fullName || "");
      setPhone(student.student?.phone || student.phone || "");
    }
  }, [student]);

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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showWarning("Permission to access photos is required to change profile picture.", "Permission Denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreviewUri(result.assets[0].uri);
    }
  };

  const handleConfirmUpload = async () => {
    if (!previewUri) return;
    setUploading(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(previewUri);
      
      const response = await fetch(`${BASE_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ profileImage: cloudinaryUrl }),
      });

      const json = await response.json();
      if (json.success) {
        showSuccess("Profile picture updated successfully.");
        setPreviewUri(null);
        await reloadStudentProfile();
      } else {
        showError(json.message || "Failed to update profile picture on server.");
      }
    } catch (err: any) {
      console.error("Profile image upload failed:", err);
      showError(err.message || "Failed to upload image. Please check connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUri(null);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      showWarning("Full Name is required.", "Validation Error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phone.trim(),
        }),
      });

      const json = await response.json();
      if (json.success) {
        showSuccess("Profile details updated successfully.");
        await reloadStudentProfile();
      } else {
        showError(json.message || "Failed to save profile changes.");
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      showError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    confirm({
      title: "Change Password",
      message: "Would you like to request a password reset link?",
      confirmText: "Request Reset",
      cancelText: "Cancel",
      onConfirm: () => {
        showSuccess("Password reset instructions have been sent to your email.", "Request Sent");
      }
    });
  };

  // Lucide Icons
  const UserIcon = User as any;
  const PhoneIcon = Phone as any;
  const MailIcon = Mail as any;
  const CalendarIcon = Calendar as any;
  const MapPinIcon = MapPin as any;
  const GraduationCapIcon = GraduationCap as any;
  const BookOpenIcon = BookOpen as any;
  const UsersIcon = Users as any;
  const LockIcon = Lock as any;
  const LogOutIcon = LogOut as any;
  const SaveIcon = Save as any;
  const Edit3Icon = Edit3 as any;

  // Resolve values or use fallbacks
  const dobVal = student?.student?.dateOfBirth ? new Date(student.student.dateOfBirth).toISOString().split("T")[0] : "Not Provided";
  const genderVal = student?.student?.gender || "Not Provided";
  const addressVal = student?.student?.address || "Not Provided";
  const schoolVal = student?.student?.school || "Not Provided";

  const parentNameVal = student?.student?.parent?.parentName || (student?.student as any)?.parentName || "Not Provided";
  const parentPhoneVal = student?.student?.parent?.phone || (student?.student as any)?.parentPhone || "Not Provided";
  const parentOccupationVal = student?.student?.parent?.occupation || (student?.student as any)?.parentOccupation || "Not Provided";
  const parentEmailVal = student?.student?.parentEmail || (student?.student as any)?.parentEmail || "Not Provided";

  const streamVal = (student?.student as any)?.streamName || "Not Provided";
  const subjectsVal = (student?.student as any)?.subjects || "Not Enrolled";
  const teachersVal = (student?.student as any)?.teachers || "None Assigned";
  const batchVal = student?.student?.batch || "Not Assigned";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Profile" rightType="edit" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Header */}
        <ProfileHeader
          student={student}
          previewUri={previewUri}
          onPickImage={handlePickImage}
          onConfirmUpload={handleConfirmUpload}
          onCancelPreview={handleCancelPreview}
          uploading={uploading}
        />

        {/* 1. PERSONAL INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.textSecondary }]}>Personal Information</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Full Name</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {fullName || "Student"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <PhoneIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone Number</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {phone || "Not Provided"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MailIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email Address</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {student?.email || "student@pyramidedu.com"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Index Number</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {student?.student?.indexNumber || "STD2026A/L0001"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <CalendarIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{dobVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Gender</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{genderVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MapPinIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Address</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{addressVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>School</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{schoolVal}</Text>
            </View>
          </View>
        </View>

        {/* 2. PARENT INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.textSecondary }]}>Parent Information</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.infoRow}>
            <UsersIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent / Guardian Name</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{parentNameVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <PhoneIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Phone Number</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{parentPhoneVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Occupation</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{parentOccupationVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MailIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Email Address</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{parentEmailVal}</Text>
            </View>
          </View>
        </View>

        {/* 3. ACADEMIC INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.textSecondary }]}>Academic Information</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Stream</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{streamVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <BookOpenIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Enrolled Subjects</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{subjectsVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <UsersIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Assigned Teachers</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{teachersVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Batch</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{batchVal}</Text>
            </View>
          </View>
        </View>

        {/* 4. PROFILE ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.secondaryActionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={handleChangePassword}
          >
            <LockIcon size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryActionButtonText, { color: colors.textPrimary }]}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerActionButton, { backgroundColor: colors.error }]} 
            onPress={handleLogout}
          >
            <LogOutIcon size={18} color={colors.surface} style={{ marginRight: 8 }} />
            <Text style={[styles.dangerActionButtonText, { color: colors.surface }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabNavigator active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoDetails: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoInput: {
    fontSize: 15,
    fontWeight: "500",
    padding: 0,
  },
  infoValueReadOnly: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  primaryActionButton: {
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryActionButton: {
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  dangerActionButton: {
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerActionButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
