import { StyleSheet } from "react-native";
import { ColorTheme } from "../../../theme/colors";

export const getStyles = (colors: ColorTheme) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 16,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signUpText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  statusContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  statusDotContainer: {
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusDotPing: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    opacity: 0.5,
  },
  statusText: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
