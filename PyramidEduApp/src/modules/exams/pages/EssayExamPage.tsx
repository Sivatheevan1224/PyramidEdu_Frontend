import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
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
import * as WebBrowser from "expo-web-browser";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function EssayExamPage() {
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const { currentExam, setActiveView: setView } = useExamStore();

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
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textSecondary }}>Loading exam data...</Text>
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
    if (accessToken) {
      submitEssay(accessToken);
    }
  };

  return (
    <ErrorBoundary>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Info */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.titleCol}>
          <Text style={[styles.examTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {currentExam.examTitle}
          </Text>
          <Text style={[styles.examSubject, { color: colors.textSecondary }]}>
            {currentExam.subject?.subjectName || "Subject"}
          </Text>
        </View>
        <ExamTimer remainingSeconds={remainingTime} formattedTime={formattedTime} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Essay Info Message */}
        <View style={[styles.infoCard, { backgroundColor: colors.primarySurface, borderColor: colors.primary }]}>
          <ShieldAlert size={20} color={colors.primary} style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>How to submit your answers:</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              1. Write your answers on physical sheets of paper.{"\n"}
              2. Scan them using any document scanner app (e.g. Adobe Scan, CamScanner).{"\n"}
              3. Generate a single PDF file on your device.{"\n"}
              4. Return here, select, and submit the PDF.
            </Text>
          </View>
        </View>

        {/* Question Paper Block */}
        {currentExam.pdfUrl ? (
          <View style={[styles.pdfCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Question Paper</Text>
            <Text style={[styles.pdfDesc, { color: colors.textSecondary }]}>View or download the exam questions below.</Text>
            <View style={styles.pdfActions}>
              <TouchableOpacity
                style={[styles.pdfBtn, { backgroundColor: colors.primarySurface, borderColor: colors.primary }]}
                onPress={() => WebBrowser.openBrowserAsync(currentExam.pdfUrl!)}
              >
                <Text style={[styles.pdfBtnText, { color: colors.primary }]}>View PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pdfBtn, styles.pdfBtnOutline, { borderColor: colors.border }]}
                onPress={() => WebBrowser.openBrowserAsync(currentExam.pdfUrl!.replace("/upload/", "/upload/fl_attachment/"))}
              >
                <Text style={[styles.pdfBtnOutlineText, { color: colors.textPrimary }]}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.pdfCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
             <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Question Paper</Text>
             <Text style={[styles.pdfDesc, { color: colors.textSecondary }]}>No PDF question paper is attached to this exam.</Text>
          </View>
        )}

        {/* Upload Block */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upload Answer Sheet</Text>
        
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
      <View style={[styles.bottomNav, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.cancelBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={() => setView("list")}
          disabled={submissionState === "submitting"}
        >
          <ArrowLeft size={18} color={colors.textPrimary} style={{ marginRight: 6 }} />
          <Text style={[styles.cancelBtnText, { color: colors.textPrimary }]}>Back to List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }, !essayDraft && styles.disabledBtn]}
          onPress={handleManualSubmit}
          disabled={!essayDraft || submissionState === "submitting"}
        >
          {submissionState === "submitting" ? (
            <>
              <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submitting...</Text>
              <ActivityIndicator color={colors.surface} size="small" style={{ marginLeft: 8 }} />
            </>
          ) : (
            <>
              <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submit Essay</Text>
              <Check size={18} color={colors.surface} style={{ marginLeft: 6 }} />
            </>
          )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  examSubject: {
    fontSize: 12,
    fontWeight: "600",
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: "row",
    borderWidth: 1,
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
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
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
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  pdfCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  pdfDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  pdfActions: {
    flexDirection: "row",
    gap: 12,
  },
  pdfBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  pdfBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
  pdfBtnOutline: {
    backgroundColor: "transparent",
  },
  pdfBtnOutlineText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
