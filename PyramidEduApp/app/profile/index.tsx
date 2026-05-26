import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Settings,
  LogOut,
  Award,
} from "lucide-react-native";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { Colors } from "../../src/constants/colors";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.name}>Alex Johnson</Text>
          <Text style={styles.rollNumber}>Roll No: 12B-087</Text>
          <Text style={styles.className}>Class 10-B</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>92</Text>
            <Text style={styles.statLabel}>Avg Grade</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <View style={styles.contactItem}>
              <Mail size={20} color={Colors.primary} strokeWidth={2} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>alex.johnson@school.edu</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.contactItem}>
              <Phone size={20} color={Colors.primary} strokeWidth={2} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+91 9876543210</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.contactItem}>
              <MapPin size={20} color={Colors.primary} strokeWidth={2} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Mumbai, India</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <BookOpen size={20} color={Colors.primary} strokeWidth={2} />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>School</Text>
                <Text style={styles.detailValue}>Modern Public School</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Award size={20} color={Colors.primary} strokeWidth={2} />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Current Stream</Text>
                <Text style={styles.detailValue}>Science</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.card, styles.actionCard]}>
            <Settings size={20} color={Colors.primary} strokeWidth={2} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.logoutCard]}>
            <LogOut size={20} color={Colors.danger} strokeWidth={2} />
            <Text style={[styles.actionText, { color: Colors.danger }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  className: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: "500",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutCard: {
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
});
