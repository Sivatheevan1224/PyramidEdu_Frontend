import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider as NavigationThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useAuth } from "../src/modules/auth";
import AppStatusBar from "../src/components/layout/AppStatusBar";
import { ThemeProvider as AppThemeProvider } from "../src/theme/ThemeProvider";
import { useAppTheme } from "../src/hooks/useAppTheme";
import { setupFCMListeners, syncFCMTokenWithBackend } from "../src/services/notificationService";
import { LogBox, View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react-native";
import { ConfirmationProvider } from "../src/context/ConfirmationContext";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go",
]);

function RootLayoutContent() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrating, hydrateAuth, student } = useAuth();
  const { colors, theme } = useAppTheme();
  const isDark = theme === "DARK";

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = setupFCMListeners(router);
      syncFCMTokenWithBackend().catch((err) =>
        console.error("FCM Token sync error on startup:", err)
      );
      return unsubscribe;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const rootSegment = segments[0];
    const isAuthRoute = rootSegment === "(welcome)" || rootSegment === "login" || rootSegment === "forgot-password";

    if (!isAuthenticated) {
      if (!isAuthRoute) {
        router.replace("/(welcome)");
      }
      return;
    }

    // Force Password Change redirection
    if (student?.forcePasswordChange) {
      if (rootSegment !== "settings") {
        router.replace("/settings");
      }
      return;
    }

    if (isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrating, student, router, segments]);

  // Dynamic config matching current theme colors
  const toastConfig = {
    appSuccess: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: colors.cardBg, borderLeftColor: "#4CAF50" }]}>
        <CheckCircle size={22} color="#4CAF50" style={styles.toastIcon} />
        <View style={styles.toastTextContainer}>
          <Text style={[styles.toastTitle, { color: colors.textPrimary }]}>{text1}</Text>
          {text2 ? <Text style={[styles.toastSubtitle, { color: colors.textSecondary }]}>{text2}</Text> : null}
        </View>
      </View>
    ),
    appError: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: colors.cardBg, borderLeftColor: "#F44336" }]}>
        <AlertCircle size={22} color="#F44336" style={styles.toastIcon} />
        <View style={styles.toastTextContainer}>
          <Text style={[styles.toastTitle, { color: colors.textPrimary }]}>{text1}</Text>
          {text2 ? <Text style={[styles.toastSubtitle, { color: colors.textSecondary }]}>{text2}</Text> : null}
        </View>
      </View>
    ),
    appWarning: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: colors.cardBg, borderLeftColor: "#FF9800" }]}>
        <AlertTriangle size={22} color="#FF9800" style={styles.toastIcon} />
        <View style={styles.toastTextContainer}>
          <Text style={[styles.toastTitle, { color: colors.textPrimary }]}>{text1}</Text>
          {text2 ? <Text style={[styles.toastSubtitle, { color: colors.textSecondary }]}>{text2}</Text> : null}
        </View>
      </View>
    ),
    appInfo: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: colors.cardBg, borderLeftColor: "#2196F3" }]}>
        <Info size={22} color="#2196F3" style={styles.toastIcon} />
        <View style={styles.toastTextContainer}>
          <Text style={[styles.toastTitle, { color: colors.textPrimary }]}>{text1}</Text>
          {text2 ? <Text style={[styles.toastSubtitle, { color: colors.textSecondary }]}>{text2}</Text> : null}
        </View>
      </View>
    ),
  };

  return (
    <NavigationThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
        },
      }}
    >
      <AppStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "none",
        }}
      />
      <Toast config={toastConfig} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ConfirmationProvider>
        <RootLayoutContent />
      </ConfirmationProvider>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  toastSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
  },
});
