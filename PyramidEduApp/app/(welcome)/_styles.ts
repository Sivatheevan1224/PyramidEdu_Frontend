import { StyleSheet } from "react-native";
import { ColorTheme } from "../../src/theme/colors";

export const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  signUpButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  loginButton: {
    backgroundColor: colors.surface,
    height: 60,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
