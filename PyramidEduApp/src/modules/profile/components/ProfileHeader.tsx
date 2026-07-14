import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Camera, Check, X } from "lucide-react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { BACKEND_HOST_URL } from "../../../api/config";

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
  const { colors } = useAppTheme();
  const displayName = student?.fullName || `${student?.student?.firstName || "Student"} ${student?.student?.lastName || ""}`.trim();
  const displayInitial = displayName.charAt(0).toUpperCase();

  let avatarUri = "";
  if (student?.profileImage) {
    if (student.profileImage.startsWith("http")) {
      avatarUri = student.profileImage;
    } else {
      avatarUri = `${BACKEND_HOST_URL}${student.profileImage}`;
    }
  }

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
    return <Text style={[styles.avatarText, { color: colors.surface }]}>{displayInitial}</Text>;
  };

  const CameraIcon = Camera as any;
  const CheckIcon = Check as any;
  const XIcon = X as any;

  return (
    <View style={[styles.profileHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          {renderAvatarContent()}
        </View>

        {uploading ? (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : previewUri ? (
          <View style={[styles.previewActions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity style={[styles.actionBadge, { backgroundColor: colors.error }]} onPress={onCancelPreview}>
              <XIcon size={14} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBadge, styles.confirmBadge]} onPress={onConfirmUpload}>
              <CheckIcon size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.cameraBadge, { backgroundColor: colors.primary, borderColor: colors.surface }]} onPress={onPickImage}>
            <CameraIcon size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.name, { color: colors.textPrimary }]}>{displayName}</Text>
      <Text style={[styles.rollNumber, { color: colors.textSecondary }]}>
        {student?.student?.indexNumber ? `Index No: ${student.student.indexNumber}` : "Logged in student"}
      </Text>
      <Text style={[styles.className, { color: colors.textTertiary }]}>
        {student?.email || "PyramidEdu Mobile"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
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
    padding: 2,
    borderRadius: 16,
    borderWidth: 1,
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
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 13,
    marginBottom: 2,
  },
  className: {
    fontSize: 12,
  },
});
