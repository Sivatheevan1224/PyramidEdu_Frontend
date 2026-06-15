import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExamStore } from "../store/examStore";
import { ExamListPage } from "./ExamListPage";
import { MCQExamPage } from "./MCQExamPage";
import { EssayExamPage } from "./EssayExamPage";
import { ExamSubmissionSuccessPage } from "./ExamSubmissionSuccessPage";
import { ExamHistoryPage } from "./ExamHistoryPage";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { Colors } from "../../../constants/colors";

export default function ExamsScreen() {
  const { activeView } = useExamStore();

  const renderContent = () => {
    switch (activeView) {
      case "list":
        return <ExamListPage />;
      case "mcq":
        return <MCQExamPage />;
      case "essay":
        return <EssayExamPage />;
      case "success":
        return <ExamSubmissionSuccessPage />;
      case "history":
        return <ExamHistoryPage />;
      default:
        return <ExamListPage />;
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </View>
      <BottomTabNavigator active="exams" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});
