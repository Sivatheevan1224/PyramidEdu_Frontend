import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { styles } from "./styles";
import ProfileHeader from "../components/ProfileHeader";
import StatsSection from "../components/StatsSection";
import ContactInfo from "../components/ContactInfo";
import AcademicDetails from "../components/AcademicDetails";
import ProfileActions from "../components/ProfileActions";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { BASE_API_URL } from "../../../api/config";

export default function ProfileScreen() {
  const router = useRouter();
  const { student, accessToken, signOut, reloadStudentProfile } = useAuth();

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

  // Image Selection
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

  // Image Upload Confirmation
  const handleConfirmUpload = async () => {
    if (!previewUri) return;
    setUploading(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(previewUri);
      
      // Update backend via PUT /users/profile
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
        await reloadStudentProfile(); // Refresh global profile state
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

  // Save Text Fields (Full Name & Phone Number)
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
        await reloadStudentProfile(); // Refresh global profile state
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

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          student={student}
          previewUri={previewUri}
          onPickImage={handlePickImage}
          onConfirmUpload={handleConfirmUpload}
          onCancelPreview={handleCancelPreview}
          uploading={uploading}
        />
        <StatsSection
          attendancePercentage={student?.student?.attendancePercentage}
          rewardPoints={student?.student?.rewardPoints}
        />
        <ContactInfo
          fullName={fullName}
          phone={phone}
          email={student?.email || ""}
          role={student?.role || "STUDENT"}
          status={student?.isActive ? "ACTIVE" : "DISABLED"}
          onChangeFullName={setFullName}
          onChangePhone={setPhone}
          onSave={handleSaveProfile}
          saving={saving}
        />
        <AcademicDetails
          school={student?.student?.school}
          batch={student?.student?.batch}
          performanceStatus={student?.student?.performanceStatus}
        />
        <ProfileActions onLogout={handleLogout} />
        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="profile" />
    </SafeAreaView>
  );
}
