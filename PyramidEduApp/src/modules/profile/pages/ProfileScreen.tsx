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
import { useTheme } from "../../../store/uiStore";
import ProfileHeader from "../components/ProfileHeader";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { BASE_API_URL } from "../../../api/config";
import { Colors } from "../../../constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { student, accessToken, signOut, reloadStudentProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["top", "bottom"]}>
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
          <Text style={[styles.sectionTitleText, isDark && styles.textWhite]}>Personal Information</Text>
        </View>

        <View style={[styles.infoCard, isDark && styles.cardDark]}>
          <View style={styles.infoRow}>
            <UserIcon size={18} color={Colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Full Name</Text>
              <TextInput
                style={[styles.infoInput, isDark && styles.textWhite]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor={isDark ? "#8E8E93" : "#C7C7CC"}
              />
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <PhoneIcon size={18} color={Colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Phone Number</Text>
              <TextInput
                style={[styles.infoInput, isDark && styles.textWhite]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={isDark ? "#8E8E93" : "#C7C7CC"}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <MailIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Email Address (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>
                {student?.email || "student@pyramidedu.com"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Index Number (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>
                {student?.student?.indexNumber || "STD2026A/L0001"}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <CalendarIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Date of Birth (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{dobVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <UserIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Gender (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{genderVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <MapPinIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Address (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{addressVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>School (Read-Only)</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{schoolVal}</Text>
            </View>
          </View>
        </View>

        {/* 2. PARENT INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, isDark && styles.textWhite]}>Parent Information</Text>
        </View>

        <View style={[styles.infoCard, isDark && styles.cardDark]}>
          <View style={styles.infoRow}>
            <UsersIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Parent / Guardian Name</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{parentNameVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <PhoneIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Parent Phone Number</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{parentPhoneVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <UserIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Parent Occupation</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{parentOccupationVal}</Text>
            </View>
          </View>
        </View>

        {/* 3. ACADEMIC INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, isDark && styles.textWhite]}>Academic Information</Text>
        </View>

        <View style={[styles.infoCard, isDark && styles.cardDark]}>
          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Stream</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{streamVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <BookOpenIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Enrolled Subjects</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{subjectsVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <UsersIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Assigned Teachers</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{teachersVal}</Text>
            </View>
          </View>

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color="#8E8E93" style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, isDark && styles.textMuted]}>Batch</Text>
              <Text style={[styles.infoValueReadOnly, isDark && styles.textWhite]}>{batchVal}</Text>
            </View>
          </View>
        </View>

        {/* 4. PROFILE ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryActionButton} 
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <SaveIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryActionButtonText}>Save Details</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryActionButton, isDark && styles.actionButtonDark]} 
            onPress={handleChangePassword}
          >
            <LockIcon size={18} color={isDark ? "#FFFFFF" : Colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryActionButtonText, isDark && styles.textWhite]}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dangerActionButton} 
            onPress={handleLogout}
          >
            <LogOutIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.dangerActionButtonText}>Logout</Text>
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
    backgroundColor: "#F2F2F7",
  },
  containerDark: {
    backgroundColor: "#0B141A",
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
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: "#121B22",
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
    color: Colors.textTertiary,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoInput: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textPrimary,
    padding: 0,
  },
  infoValueReadOnly: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginLeft: 50,
  },
  dividerDark: {
    backgroundColor: "#222D34",
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryActionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDark: {
    backgroundColor: "#121B22",
    borderColor: "#222D34",
  },
  secondaryActionButtonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  dangerActionButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerActionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textMuted: {
    color: "#8E8E93",
  },
});
