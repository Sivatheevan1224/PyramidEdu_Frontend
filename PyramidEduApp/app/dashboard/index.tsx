import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Wallet,
  BrainCircuit,
  QrCode,
  TrendingUp,
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react-native";
import { styles } from "./_styles_new";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { Colors } from "../../src/constants/colors";

export default function DashboardScreen() {
  // Live Exam Simulation State
  const [exam, setExam] = React.useState({
    title: "Vector MCQ Exam",
    subject: "Combined Mathematics",
    startTime: new Date(Date.now() - 9 * 60 * 1000), // Started 9 mins ago (1 min remaining)
    duration: 10, // 10 minutes total duration
    totalMarks: 100,
    isSubmitted: false,
    submissionStatus: "",
  });

  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [examStatus, setExamStatus] = React.useState<"ACTIVE" | "COMPLETED">("ACTIVE");

  React.useEffect(() => {
    const interval = setInterval(() => {
      const startMs = exam.startTime.getTime();
      const endMs = startMs + exam.duration * 60 * 1000;
      const nowMs = Date.now();
      const diffSecs = Math.max(0, Math.floor((endMs - nowMs) / 1000));
      
      setTimeLeft(diffSecs);
      if (diffSecs <= 0) {
        setExamStatus("COMPLETED");
      } else {
        setExamStatus("ACTIVE");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [exam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMockSubmit = (isLateSubmit = false) => {
    const isActuallyLate = isLateSubmit || timeLeft <= 0;
    setExam(prev => ({
      ...prev,
      isSubmitted: true,
      submissionStatus: isActuallyLate ? "LATE SUBMISSION" : "SUBMITTED"
    }));
  };

  const handleReset = (startOffsetMinutes: number) => {
    setExam({
      title: "Vector MCQ Exam",
      subject: "Combined Mathematics",
      startTime: new Date(Date.now() - startOffsetMinutes * 60 * 1000),
      duration: 10,
      totalMarks: 100,
      isSubmitted: false,
      submissionStatus: "",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* WhatsApp-style Top Bar */}
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good morning, Alex 👋</Text>
          <Text style={styles.greetingSubtitle}>
            You have 3 classes remaining today
          </Text>
        </View>

        {/* Active Exam Card with Live Timer */}
        <View style={[styles.section, { marginBottom: 10 }]}>
          <Text style={styles.sectionTitle}>Active Exams</Text>
          <View style={[
            styles.card, 
            { 
              backgroundColor: '#ffffff',
              borderLeftWidth: 5,
              borderLeftColor: exam.isSubmitted ? '#10b981' : (examStatus === 'COMPLETED' ? '#ef4444' : '#6366f1'),
              padding: 16,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }
          ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b' }}>{exam.title}</Text>
                <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{exam.subject}</Text>
              </View>
              <View style={{
                backgroundColor: exam.isSubmitted ? '#ecfdf5' : (examStatus === 'COMPLETED' ? '#fef2f2' : '#f5f3ff'),
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: exam.isSubmitted ? '#10b981' : (examStatus === 'COMPLETED' ? '#ef4444' : '#6366f1'),
                }}>
                  {exam.isSubmitted ? 'SUBMITTED' : examStatus}
                </Text>
              </View>
            </View>

            {!exam.isSubmitted ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 6 }}>
                  <Clock size={16} color={examStatus === 'COMPLETED' ? '#ef4444' : '#6366f1'} />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: examStatus === 'COMPLETED' ? '#ef4444' : '#1e293b',
                  }}>
                    {examStatus === 'COMPLETED' 
                      ? 'Time Ended - Late Submissions Allowed' 
                      : `Time Remaining: ${formatTime(timeLeft)}`}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={{
                    backgroundColor: examStatus === 'COMPLETED' ? '#ef4444' : '#6366f1',
                    padding: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() => handleMockSubmit()}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                    {examStatus === 'COMPLETED' ? 'Submit Late Answer Sheet' : 'Submit Exam Now'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#10b981' }}>
                    Exam Submitted Successfully!
                  </Text>
                </View>
                <View style={{
                  backgroundColor: exam.submissionStatus === 'LATE SUBMISSION' ? '#fff1f2' : '#f0fdf4',
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: exam.submissionStatus === 'LATE SUBMISSION' ? '#ffe4e6' : '#dcfce7',
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: exam.submissionStatus === 'LATE SUBMISSION' ? '#e11d48' : '#166534',
                  }}>
                    Submission Status: {exam.submissionStatus}
                  </Text>
                </View>
              </View>
            )}

            {/* Demo Helpers */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 }}>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#f1f5f9', padding: 6, borderRadius: 6, alignItems: 'center' }}
                onPress={() => handleReset(9)}
              >
                <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>Demo: Active (1m left)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#f1f5f9', padding: 6, borderRadius: 6, alignItems: 'center' }}
                onPress={() => handleReset(11)}
              >
                <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>Demo: Time Ended</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Access</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
            scrollEventThrottle={16}
          >
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <Wallet size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Pay Fees</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <BrainCircuit
                  size={24}
                  color={Colors.primary}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.actionButtonText}>Ask AI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonIcon}>
                <QrCode size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Scan QR</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Attendance Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={[styles.card, styles.attendanceCard]}>
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceLabel}>Attendance</Text>
              <Text style={styles.attendanceValue}>87%</Text>
              <Text style={styles.attendanceStatus}>On Track ✓</Text>
            </View>
            <View style={styles.attendanceCircle}>
              <Text style={styles.attendancePercentage}>87%</Text>
            </View>
          </View>
        </View>

        {/* Performance Card */}
        <View style={styles.section}>
          <View style={[styles.card, styles.performanceCard]}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>Performance</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <TrendingUp size={16} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.performanceTrend}>+12.5%</Text>
              </View>
            </View>

            {/* Math */}
            <Text style={styles.performanceLabel}>📐 Mathematics</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceBarFill, { width: "92%" }]} />
            </View>

            {/* Physics */}
            <Text style={styles.performanceLabel}>⚛️ Physics</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceBarFill, { width: "68%" }]} />
            </View>

            {/* Chemistry */}
            <Text style={styles.performanceLabel}>🧪 Chemistry</Text>
            <View style={styles.performanceBar}>
              <View style={[styles.performanceBarFill, { width: "85%" }]} />
            </View>
          </View>
        </View>

        {/* Next Class Card */}
        <View style={styles.section}>
          <View style={[styles.card, styles.nextClassCard]}>
            <View style={styles.nextClassInfo}>
              <Text style={styles.nextClassLabel}>Next Class</Text>
              <Text style={styles.nextClassSubject}>Mathematics</Text>
              <Text style={styles.nextClassTime}>10:30 AM • In 45 mins</Text>
            </View>
            <View style={styles.nextClassIcon}>
              <BookOpen size={24} color={Colors.primary} strokeWidth={2} />
            </View>
          </View>
        </View>

        {/* AI Insight Card */}
        <View style={styles.section}>
          <View style={[styles.card, styles.aiInsightCard]}>
            <View style={styles.aiInsightHeader}>
              <Sparkles size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.aiInsightTitle}>AI Insight</Text>
            </View>
            <Text style={styles.aiInsightText}>
              Your attendance in{" "}
              <Text style={{ fontWeight: "700" }}>Physics</Text> is low (68%).
              We recommend reviewing these concept videos before your next exam.
            </Text>
            <TouchableOpacity style={styles.aiInsightButton}>
              <Text style={styles.aiInsightButtonText}>View Resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* WhatsApp-style Bottom Tab Navigation */}
      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}
