import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 30,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1e2020",
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: "#9ca3af", // Tailwind gray-400 equivalent
  },
  quickActionsScroll: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e2020",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1db954",
    textTransform: "uppercase",
  },
  glassCard: {
    backgroundColor: "rgba(24, 24, 24, 0.7)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  attendanceCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#1e2020", // Background circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    // Add glowing effect to the circle using shadow
    shadowColor: "#1db954",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  progressText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  attendanceStandard: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  performanceCard: {
    padding: 24,
  },
  performanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  performanceStat: {
    fontSize: 14,
    fontWeight: "700",
    color: "#53e076",
  },
  chartPlaceholder: {
    height: 60,
    width: "100%",
    justifyContent: "center",
  },
  nextClassCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(29, 185, 84, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nextClassInfo: {
    flex: 1,
  },
  nextClassLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  nextClassSubject: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  nextClassTimeBox: {
    alignItems: "flex-end",
  },
  nextClassTime: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  nextClassCountdown: {
    fontSize: 12,
    color: "#9ca3af",
  },
  aiInsightCard: {
    padding: 24,
    backgroundColor: "rgba(20, 30, 24, 0.7)", // Slight green tint
    borderColor: "rgba(29, 185, 84, 0.25)",
    shadowColor: "rgba(29, 185, 84, 0.15)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiInsightTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  aiInsightText: {
    fontSize: 14,
    color: "#d1d5db",
    lineHeight: 22,
    marginBottom: 20,
  },
  aiInsightHighlight: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
  aiInsightButton: {
    backgroundColor: "#1db954",
    paddingVertical: 14,
    borderRadius: 99,
    alignItems: "center",
  },
  aiInsightButtonText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  materialsScroll: {
    paddingHorizontal: 24,
  },
  materialCard: {
    width: 160,
    marginRight: 16,
  },
  materialImage: {
    width: 160,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#1e2020",
    marginBottom: 12,
  },
  materialTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  materialMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  bottomNavBlur: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(24, 24, 24, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 32,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
  },
  navItemActive: {
    backgroundColor: "rgba(29, 185, 84, 0.1)",
    borderRadius: 24,
  },
});
