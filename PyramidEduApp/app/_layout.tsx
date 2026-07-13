import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider as NavigationThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useAuth } from "../src/modules/auth";
import AppStatusBar from "../src/components/layout/AppStatusBar";
import { ThemeProvider as AppThemeProvider } from "../src/theme/ThemeProvider";
import { useAppTheme } from "../src/hooks/useAppTheme";
import { setupFCMListeners, syncFCMTokenWithBackend } from "../src/services/notificationService";
import { LogBox } from "react-native";

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
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}
