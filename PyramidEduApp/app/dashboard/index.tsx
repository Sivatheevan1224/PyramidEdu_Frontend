import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  Wallet,
  BrainCircuit,
  QrCode,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react-native";
import { styles } from "./_styles";
import DashboardHeader from "../../src/components/DashboardHeader";
import BottomNavBar from "../../src/components/BottomNavBar";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good morning, Alex</Text>
          <Text style={styles.greetingSubtitle}>
            You have 3 classes remaining today.
          </Text>
        </View>

        {/* Quick Actions Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
        >
          <TouchableOpacity style={styles.actionButton}>
            <Wallet color="#1db954" size={20} />
            <Text style={styles.actionButtonText}>Pay Fees</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <BrainCircuit color="#1db954" size={20} />
            <Text style={styles.actionButtonText}>Ask AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <QrCode color="#1db954" size={20} />
            <Text style={styles.actionButtonText}>Scan QR</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Attendance Card */}
        <View style={styles.section}>
          <View style={[styles.glassCard, styles.attendanceCard]}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>82%</Text>
            </View>
            <Text style={styles.attendanceTitle}>Attendance</Text>
            <Text style={styles.attendanceStandard}>
              Academic Standard: 75%
            </Text>
          </View>
        </View>

        {/* Performance Card */}
        <View style={styles.section}>
          <View style={[styles.glassCard, styles.performanceCard]}>
            <View style={styles.performanceHeader}>
              <View>
                <Text style={styles.performanceTitle}>Performance</Text>
                <Text style={styles.performanceStat}>+12.5% this month</Text>
              </View>
              <TrendingUp color="#64748b" size={20} />
            </View>
            {/* Chart Placeholder (using a curved line or blank area) */}
            <View style={styles.chartPlaceholder}>
              {/* In a real app, integrate a charting library like react-native-svg or victory-native here */}
              <View
                style={{
                  height: 40,
                  borderBottomWidth: 2,
                  borderColor: "#1db954",
                  borderRadius: 20,
                  opacity: 0.5,
                  transform: [{ rotate: "-5deg" }],
                }}
              />
            </View>
          </View>
        </View>

        {/* Next Class Card */}
        <View style={styles.section}>
          <View style={[styles.glassCard, styles.nextClassCard]}>
            <View style={styles.iconBox}>
              <BookOpen color="#1db954" size={24} />
            </View>
            <View style={styles.nextClassInfo}>
              <Text style={styles.nextClassLabel}>Next Class</Text>
              <Text style={styles.nextClassSubject}>Mathematics</Text>
            </View>
            <View style={styles.nextClassTimeBox}>
              <Text style={styles.nextClassTime}>10:30 AM</Text>
              <Text style={styles.nextClassCountdown}>In 45 mins</Text>
            </View>
          </View>
        </View>

        {/* AI Insight Card */}
        <View style={styles.section}>
          <View style={[styles.glassCard, styles.aiInsightCard]}>
            <View style={styles.aiInsightHeader}>
              <Sparkles color="#1db954" size={24} />
              <Text style={styles.aiInsightTitle}>AI Attendance Insight</Text>
            </View>
            <Text style={styles.aiInsightText}>
              Your attendance in <Text style={styles.aiInsightHighlight}>Physics</Text> is low (68%). AI recommends watching 2 specific concept videos to stay updated for the next exam.
            </Text>
            <TouchableOpacity style={styles.aiInsightButton}>
              <Text style={styles.aiInsightButtonText}>View Recommendations</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Smart Materials Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Smart Materials</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24 }}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <TouchableOpacity style={styles.materialCard}>
              <View style={styles.materialImage} />
              <Text style={styles.materialTitle} numberOfLines={1}>
                Quantum Mechanics 1...
              </Text>
              <Text style={styles.materialMeta}>Video • 12 mins left</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.materialCard}>
              <View style={styles.materialImage} />
              <Text style={styles.materialTitle} numberOfLines={1}>
                Advanced Calculus PDF
              </Text>
              <Text style={styles.materialMeta}>Reading • 4 mins ago</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </SafeAreaView>
  );
}
