import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Users, 
  Save,
  Mail
} from "lucide-react-native";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { BASE_API_URL } from "../../../api/config";

export default function EditProfileScreen() {
  const router = useRouter();
  const { student, accessToken, reloadStudentProfile } = useAuth();
  const { colors } = useAppTheme();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [school, setSchool] = useState("");
  const [dob, setDob] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentOccupation, setParentOccupation] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  
  const [saving, setSaving] = useState(false);

  // Initialize fields on load
  useEffect(() => {
    if (student) {
      setFullName(student.fullName || "");
      setPhone(student.student?.phone || student.phone || "");
      setAddress(student.student?.address || "");
      
      const rawGender = student.student?.gender;
      if (rawGender === "MALE" || rawGender === "FEMALE" || rawGender === "OTHER") {
        setGender(rawGender);
      } else {
        setGender("MALE");
      }

      setSchool(student.student?.school || "");

      // Date of Birth format
      const rawDob = student.student?.dateOfBirth;
      if (rawDob) {
        setDob(new Date(rawDob).toISOString().split("T")[0]);
      } else {
        setDob("");
      }

      const pInfo = student.student?.parent;
      setParentName(pInfo?.parentName || (student.student as any)?.parentName || "");
      setParentPhone(pInfo?.phone || (student.student as any)?.parentPhone || "");
      setParentOccupation(pInfo?.occupation || (student.student as any)?.parentOccupation || "");
      setParentEmail(pInfo?.email || student.student?.parentEmail || (student.student as any)?.parentEmail || "");
    }
  }, [student]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full Name is required.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/mobile/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phone.trim(),
          address: address.trim(),
          gender: gender,
          school: school.trim(),
          dateOfBirth: dob.trim() || undefined,
          parentName: parentName.trim(),
          parentPhone: parentPhone.trim(),
          parentOccupation: parentOccupation.trim(),
          parentEmail: parentEmail.trim()
        }),
      });

      const json = await response.json();
      if (json.success) {
        Alert.alert("Success", "Profile details updated successfully.", [
          { text: "OK", onPress: () => router.back() }
        ]);
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

  const UserIcon = User as any;
  const PhoneIcon = Phone as any;
  const CalendarIcon = Calendar as any;
  const MapPinIcon = MapPin as any;
  const GraduationCapIcon = GraduationCap as any;
  const UsersIcon = Users as any;
  const SaveIcon = Save as any;
  const MailIcon = Mail as any;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Edit Profile" rightType="none" />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. PERSONAL INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.textSecondary }]}>Personal Details</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
          {/* Full Name */}
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

          {/* Phone Number */}
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

          {/* Date of Birth */}
          <View style={styles.infoRow}>
            <CalendarIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={dob}
                onChangeText={setDob}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Gender */}
          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Gender</Text>
              <View style={styles.genderContainer}>
                {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderButton,
                      { borderColor: colors.border },
                      gender === g && { backgroundColor: colors.primarySurface, borderColor: colors.primary }
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[
                      styles.genderText,
                      { color: colors.textSecondary },
                      gender === g && { color: colors.primary, fontWeight: "700" }
                    ]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Address */}
          <View style={styles.infoRow}>
            <MapPinIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Address</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* School */}
          <View style={styles.infoRow}>
            <GraduationCapIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>School</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={school}
                onChangeText={setSchool}
                placeholder="Enter school name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* 2. PARENT INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitleText, { color: colors.textSecondary }]}>Parent Information</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
          {/* Parent Name */}
          <View style={styles.infoRow}>
            <UsersIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Name</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={parentName}
                onChangeText={setParentName}
                placeholder="Enter parent name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Parent Phone */}
          <View style={styles.infoRow}>
            <PhoneIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Phone Number</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={parentPhone}
                onChangeText={setParentPhone}
                placeholder="Enter parent phone number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Parent Occupation */}
          <View style={styles.infoRow}>
            <UserIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Occupation</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={parentOccupation}
                onChangeText={setParentOccupation}
                placeholder="Enter parent occupation"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Parent Email */}
          <View style={styles.infoRow}>
            <MailIcon size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoDetails}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Parent Email Address</Text>
              <TextInput
                style={[styles.infoInput, { color: colors.textPrimary }]}
                value={parentEmail}
                onChangeText={setParentEmail}
                placeholder="Enter parent email address"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* PROFILE ACTIONS */}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
},
scrollContent: {
  paddingBottom: 80,
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
  divider: {
    height: 1,
    marginLeft: 50,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  genderButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  genderText: {
    fontSize: 13,
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
});
