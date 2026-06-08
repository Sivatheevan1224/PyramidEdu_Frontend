import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    color: "#0F172A",
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
  },
  signUpButton: {
    backgroundColor: "#1B4FCC",
    height: 60,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B4FCC",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    height: 60,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loginButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
