import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Check, ShieldAlert } from "lucide-react-native";
import { useAuth } from "../../auth";
import { useExamStore } from "../store/examStore";
import { useExamTimer, useEssayExam, useExamSubmission } from "../hooks";
import {
  ExamTimer,
  EssayPDFUploader,
  UploadProgressIndicator,
  SubmissionConfirmationModal,
} from "../components";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { Colors } from "../../../constants/colors";
import * as WebBrowser from "expo-web-browser";

export function EssayExamPage() {
  const { accessToken } = useAuth();
  const { currentExam, setView } = useExamStore();

  const { essayDraft, uploadState, handlePickPDF, handleRemoveFile } = useEssayExam();
  const { submitEssay, submissionState } = useExamSubmission();

  const handleAutoSubmit = () => {
    // Essay exam auto-submits draft if uploaded, or exits
    if (accessToken && essayDraft && uploadState.status !== "uploading") {
      submitEssay(accessToken);
    } else {
      setView("list");
    }
  };

  const { remainingTime, formattedTime } = useExamTimer(handleAutoSubmit);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // TEMPORARY DEBUG LOGGING
  React.useEffect(() => {
    if (currentExam) {
      console.log("=== ESSAY EXAM MOUNTED ===");
      console.log("Exam ID:", currentExam.id);
      console.log("Exam Type:", currentExam.examType);
      console.log("Duration:", currentExam.duration);
      console.log("PDF URL:", currentExam.pdfUrl);
    }
  }, [currentExam]);

  if (!currentExam) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: Colors.textSecondary }}>Loading exam data...</Text>
      </View>
    );
  }

  const handleManualSubmit = () => {
    if (!essayDraft) {
      alert("Please upload your PDF answer sheet before submitting.");
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmVisible(false);
    if (accessToken) {
      submitEssay(accessToken);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.examTitle} numberOfLines={1}>
            {currentExam.examTitle}
          </Text>
          <Text style={styles.examSubject}>
            {currentExam.subject?.subjectName || "Subject"}
          </Text>
        </View>
        <ExamTimer remainingSeconds={remainingTime} formattedTime={formattedTime} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Essay Info Message */}
        <View style={styles.infoCard}>
          <ShieldAlert size={20} color={Colors.primary} style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How to submit your answers:</Text>
            <Text style={styles.infoText}>
              1. Write your answers on physical sheets of paper.{"\n"}
              2. Scan them using any document scanner app (e.g. Adobe Scan, CamScanner).{"\n"}
              3. Generate a single PDF file on your device.{"\n"}
              4. Return here, select, and submit the PDF.
            </Text>
          </View>
        </View>

        {/* Question Paper Block */}
        {currentExam.pdfUrl ? (
          <View style={styles.pdfCard}>
            <Text style={styles.sectionTitle}>Question Paper</Text>
            <Text style={styles.pdfDesc}>View or download the exam questions below.</Text>
            <View style={styles.pdfActions}>
              <TouchableOpacity
                style={styles.pdfBtn}
                onPress={() => WebBrowser.openBrowserAsync(currentExam.pdfUrl!)}
              >
                <Text style={styles.pdfBtnText}>View PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pdfBtn, styles.pdfBtnOutline]}
                onPress={() => WebBrowser.openBrowserAsync(currentExam.pdfUrl!.replace("/upload/", "/upload/fl_attachment/"))}
              >
                <Text style={styles.pdfBtnOutlineText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.pdfCard}>
             <Text style={styles.sectionTitle}>Question Paper</Text>
             <Text style={styles.pdfDesc}>No PDF question paper is attached to this exam.</Text>
          </View>
        )}

        {/* Upload Block */}
        <Text style={styles.sectionTitle}>Upload Answer Sheet</Text>
        
        <EssayPDFUploader
          draft={essayDraft}
          onPick={handlePickPDF}
          onRemove={handleRemoveFile}
          isSubmitting={submissionState === "submitting"}
        />

        {uploadState.status === "uploading" && (
          <UploadProgressIndicator
            progress={uploadState.progress}
            status="Uploading PDF answer sheet..."
          />
        )}
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setView("list")}
          disabled={submissionState === "submitting"}
        >
          <ArrowLeft size={18} color={Colors.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.cancelBtnText}>Back to List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, !essayDraft && styles.disabledBtn]}
          onPress={handleManualSubmit}
          disabled={!essayDraft || submissionState === "submitting"}
        >
          <Text style={styles.submitBtnText}>Submit Essay</Text>
          <Check size={18} color="#ffffff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <SubmissionConfirmationModal
        visible={confirmVisible}
        unansweredCount={0}
        isSubmitting={submissionState === "submitting"}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleConfirmSubmit}
      />
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  examSubject: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  pdfCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  pdfDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  pdfActions: {
    flexDirection: "row",
    gap: 12,
  },
  pdfBtn: {
    flex: 1,
    backgroundColor: Colors.primarySurface,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pdfBtnText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  pdfBtnOutline: {
    backgroundColor: "transparent",
    borderColor: Colors.border,
  },
  pdfBtnOutlineText: {
    color: Colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
});
