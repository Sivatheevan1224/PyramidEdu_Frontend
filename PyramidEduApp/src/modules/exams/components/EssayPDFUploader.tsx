import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FileText, X } from "lucide-react-native";
import { EssayDraftState } from "../types";
import { Colors } from "../../../constants/colors";

interface EssayPDFUploaderProps {
  draft: EssayDraftState | null;
  onPick: () => void;
  onRemove: () => void;
  isSubmitting: boolean;
}

export function EssayPDFUploader({
  draft,
  onPick,
  onRemove,
  isSubmitting,
}: EssayPDFUploaderProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <View style={styles.container}>
      {draft ? (
        <View style={styles.fileCard}>
          <View style={styles.iconContainer}>
            <FileText size={24} color={Colors.primary} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {draft.fileName}
            </Text>
            <Text style={styles.fileSize}>{formatSize(draft.fileSize)}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={onRemove}
            disabled={isSubmitting}
          >
            <X size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={onPick}
          disabled={isSubmitting}
          activeOpacity={0.7}
        >
          <FileText size={32} color={Colors.primary} style={styles.uploadIcon} />
          <Text style={styles.uploadTitle}>Choose PDF Answer sheet</Text>
          <Text style={styles.uploadDesc}>
            Generate PDF externally and upload. Max 20MB.
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: Colors.primarySurface,
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  uploadDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
  },
});
