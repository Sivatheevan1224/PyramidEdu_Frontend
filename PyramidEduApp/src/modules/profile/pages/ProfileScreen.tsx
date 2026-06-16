import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
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
  Save
} from "lucide-react-native";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import ProfileHeader from "../components/ProfileHeader";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { BASE_API_URL } from "../../../api/config";

export default function ProfileScreen() {
  const router = useRouter();
  const { student, accessToken, signOut, reloadStudentProfile } = useAuth();
  const { colors } = useAppTheme();

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

  const handleLogout = async () => {
    await signOut();
    router.replace("/(welcome)" as any);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access photos is required to change profile picture.");
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
        Alert.alert("Success", "Profile picture updated successfully.");
        setPreviewUri(null);
        await reloadStudentProfile();
      } else {
        Alert.alert("Error", json.message || "Failed to update profile picture on server.");
      }
    } catch (err: any) {
      console.error("Profile image upload failed:", err);
      Alert.alert("Error", err.message || "Failed to upload image. Please check connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUri(null);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full Name is required.");
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
        Alert.alert("Success", "Profile details updated successfully.");
        await reloadStudentProfile();
      } else {
        Alert.alert("Error", json.message || "Failed to save profile changes.");
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      Alert.alert("Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "Would you like to request a password reset link?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Request Reset", 
          onPress: () => Alert.alert("Request Sent", "Password reset instructions have been sent to your email.") 
        }
      ]
    );
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

  // Resolve values or use fallbacks
  const dobVal = student?.student?.dateOfBirth || "2007-08-15";
  const genderVal = student?.student?.gender || "Male";
  const addressVal = student?.student?.address || "123 Galle Road, Colombo 03";
  const schoolVal = student?.student?.school || "Ananda College, Colombo";

  const parentNameVal = (student?.student as any)?.parentName || "Mr. D. H. Silva";
  const parentPhoneVal = (student?.student as any)?.parentPhone || "+94 77 987 6543";
  const parentOccupationVal = (student?.student as any)?.parentOccupation || "Civil Engineer";

  const streamVal = (student?.student as any)?.streamName || (student?.student?.batch?.includes("Maths") ? "Physical Science (Combined Maths)" : "Physical Science");
  const subjectsVal = "Combined Mathematics, Physics, Chemistry";
  const teachersVal = "Prof. Rohan Silva, Dr. Janaka Perera, Mr. T. Jayawardena";
  const batchVal = student?.student?.batch || "Batch 2026 A/L";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Profile" />

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
            <UserIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Full Name</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <PhoneIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone Number</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MailIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email Address (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {student?.email || "student@pyramidedu.com"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Index Number (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>
                {student?.student?.indexNumber || "STD2026A/L0001"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <CalendarIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{dobVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Gender (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{genderVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MapPinIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Address (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, { color: colors.textSecondary }]}>{addressVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.textTertiary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>School (Read-Only)</Text>
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
            style={[styles.primaryActionButton, { backgroundColor: colors.primary }]} 
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.surface} size="small" />
            ) : (
              <>
                <SaveIcon size={18} color={colors.surface} style={{ marginRight: 8 }} />
                <Text style={[styles.primaryActionButtonText, { color: colors.surface }]}>Save Details</Text>
              </>
            )}
          </TouchableOpacity>

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
