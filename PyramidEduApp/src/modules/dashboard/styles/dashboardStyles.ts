import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // ===== Greeting Section =====
  greetingSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },

  // ===== Quick Actions =====
  quickActionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textTertiary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActionsScroll: {
    flexDirection: "row",
  },
  actionButton: {
    width: 80,
    height: 100,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonIcon: {
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
  },

  // ===== Card Sections =====
  section: {
    paddingHorizontal: 16,
    marginBottom: 12,
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

  // ===== Attendance Card =====
  attendanceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
    fontWeight: "500",
  },
  attendanceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  attendanceStatus: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  attendanceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primarySurface,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  attendancePercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },

  // ===== Performance Card =====
  performanceCard: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  performanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  performanceTrend: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  performanceBar: {
    height: 8,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  performanceBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  performanceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: "500",
  },

  // ===== Next Class Card =====
  nextClassCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nextClassInfo: {
    flex: 1,
  },
  nextClassLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
    fontWeight: "500",
  },
  nextClassSubject: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  nextClassTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  nextClassIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // ===== AI Insight Card =====
  aiInsightCard: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiInsightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  aiInsightText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  aiInsightButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  aiInsightButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textInverse,
  },

  // ===== Empty Space for Bottom Tab =====
  bottomSpacing: {
    height: 20,
  },
});
