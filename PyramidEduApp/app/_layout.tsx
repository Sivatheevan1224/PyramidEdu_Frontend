import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Colors } from "../src/constants/colors";
import { useAuth } from "../src/hooks/useAuth";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrating, hydrateAuth } = useAuth();

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
    <ThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: Colors.background,
        },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animationEnabled: false,
        }}
      />
    </ThemeProvider>
  );
}
