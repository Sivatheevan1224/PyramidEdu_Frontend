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
} from "lucide-react-native";
import { styles } from "./_styles_new";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { Colors } from "../../src/constants/colors";

export default function DashboardScreen() {
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
