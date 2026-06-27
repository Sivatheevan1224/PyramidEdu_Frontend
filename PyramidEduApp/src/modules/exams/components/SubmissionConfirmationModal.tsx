import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ShieldAlert } from "lucide-react-native";
import { Colors } from "../../../constants/colors";

interface SubmissionConfirmationModalProps {
  visible: boolean;
  unansweredCount: number;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmissionConfirmationModal({
  visible,
  unansweredCount,
  isSubmitting,
  onClose,
  onConfirm,
}: SubmissionConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <ShieldAlert size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Submit Exam?</Text>
          
          <Text style={styles.desc}>
            Are you sure you want to submit your exam answers? You will not be able to change them afterwards.
          </Text>

          {unansweredCount > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ You have {unansweredCount} unanswered question(s).
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelBtnText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>Yes, Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: "#ffedd5",
    borderWidth: 1,
    borderColor: "#ffedd5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: "100%",
  },
  warningText: {
    color: "#c2410c",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
