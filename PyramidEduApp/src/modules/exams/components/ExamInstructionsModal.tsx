import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Clock, Award, ShieldAlert } from "lucide-react-native";
import { Exam } from "../types";
import { Colors } from "../../../constants/colors";

interface ExamInstructionsModalProps {
  visible: boolean;
  exam: Exam | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExamInstructionsModal({
  visible,
  exam,
  onClose,
  onConfirm,
}: ExamInstructionsModalProps) {
  if (!exam) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Exam Instructions</Text>
          <Text style={styles.examTitle}>{exam.examTitle}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
              <View style={styles.metaBox}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.metaVal}>{exam.duration} mins</Text>
                <Text style={styles.metaLbl}>Duration</Text>
              </View>

              <View style={styles.metaBox}>
                <Award size={20} color={Colors.primary} />
                <Text style={styles.metaVal}>{exam.totalMarks} Pts</Text>
                <Text style={styles.metaLbl}>Total Marks</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rules & Regulations</Text>
              
              <View style={styles.bulletRow}>
                <ShieldAlert size={16} color="#e11d48" style={styles.bulletIcon} />
                <Text style={styles.bulletText}>
                  Once you tap "Start Exam", the timer will begin and cannot be paused.
                </Text>
              </View>

              <View style={styles.bulletRow}>
                <ShieldAlert size={16} color="#e11d48" style={styles.bulletIcon} />
                <Text style={styles.bulletText}>
                  Navigating away from the screen or closing the app will NOT pause the timer.
                </Text>
              </View>

              {exam.examType === "MCQ" ? (
                <>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={Colors.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      Your responses will be autosaved locally.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={Colors.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      The exam will submit automatically when the timer reaches zero.
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={Colors.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      Write your answers clearly on sheets of paper.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={Colors.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      Use an external scanner app (e.g. Adobe Scan, CamScanner) to produce a PDF file.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={Colors.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      Upload the generated PDF file here before submitting. Max size is 20MB.
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Start Now</Text>
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
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  scroll: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  metaVal: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  metaLbl: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
