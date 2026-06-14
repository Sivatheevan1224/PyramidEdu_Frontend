import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Camera, Check, X } from "lucide-react-native";
import { Colors } from "../../../constants/colors";

interface ProfileHeaderProps {
  student: any;
  previewUri: string | null;
  onPickImage: () => void;
  onConfirmUpload: () => void;
  onCancelPreview: () => void;
  uploading: boolean;
}

export default function ProfileHeader({
  student,
  previewUri,
  onPickImage,
  onConfirmUpload,
  onCancelPreview,
  uploading,
}: ProfileHeaderProps) {
  const displayName = student?.fullName || `${student?.student?.firstName || "Student"} ${student?.student?.lastName || ""}`.trim();
  const displayInitial = displayName.charAt(0).toUpperCase();

  let avatarUri = "";
  if (student?.profileImage) {
    if (student.profileImage.startsWith("http")) {
      avatarUri = student.profileImage;
    } else {
      avatarUri = `http://172.20.10.3:5000${student.profileImage}`;
    }
  }

  // Display either the selected preview image, the uploaded avatar, or initials
  const renderAvatarContent = () => {
    if (previewUri) {
      return (
        <Image
          source={{ uri: previewUri }}
          style={styles.avatarImage}
          contentFit="cover"
        />
      );
    }
    if (avatarUri) {
      return (
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatarImage}
          contentFit="cover"
          cachePolicy="disk"
        />
      );
    }
    return <Text style={styles.avatarText}>{displayInitial}</Text>;
  };

  const CameraIcon = Camera as any;
  const CheckIcon = Check as any;
  const XIcon = X as any;

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          {renderAvatarContent()}
        </View>

        {uploading ? (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : previewUri ? (
          // Preview state: confirm or cancel buttons
          <View style={styles.previewActions}>
            <TouchableOpacity style={[styles.actionBadge, styles.cancelBadge]} onPress={onCancelPreview}>
              <XIcon size={14} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBadge, styles.confirmBadge]} onPress={onConfirmUpload}>
              <CheckIcon size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // Edit state: pick image button
          <TouchableOpacity style={styles.cameraBadge} onPress={onPickImage}>
            <CameraIcon size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.rollNumber}>
        {student?.student?.indexNumber ? `Index No: ${student.student.indexNumber}` : "Logged in student"}
      </Text>
      <Text style={styles.className}>
        {student?.email || "PyramidEdu Mobile"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewActions: {
    position: "absolute",
    bottom: -6,
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.surface,
    padding: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBadge: {
    backgroundColor: "#10B981", // Emerald green
  },
  cancelBadge: {
    backgroundColor: Colors.danger,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  className: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
