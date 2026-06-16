import React from "react";
import { StatusBar } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";

export default function AppStatusBar() {
  const { theme } = useAppTheme();
  const isDark = theme === "DARK";

  return (
    <StatusBar
      barStyle={isDark ? "light-content" : "dark-content"}
      backgroundColor="transparent"
      translucent={true}
    />
  );
}
