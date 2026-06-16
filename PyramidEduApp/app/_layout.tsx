import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider as NavigationThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useAuth } from "../src/modules/auth";
import AppStatusBar from "../src/components/layout/AppStatusBar";
import { ThemeProvider as AppThemeProvider } from "../src/theme/ThemeProvider";
import { useAppTheme } from "../src/hooks/useAppTheme";

function RootLayoutContent() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrating, hydrateAuth } = useAuth();
  const { colors, theme } = useAppTheme();
  const isDark = theme === "DARK";

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const rootSegment = segments[0];
    const isAuthRoute = rootSegment === "(welcome)" || rootSegment === "login";

    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/(welcome)");
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrating, router, segments]);

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
