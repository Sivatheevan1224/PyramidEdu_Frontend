import React from "react";
import { StatusBar } from "react-native";
import { useTheme } from "../../store/uiStore";

export default function AppStatusBar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <StatusBar
      barStyle={isDark ? "light-content" : "dark-content"}
      backgroundColor="transparent"
      translucent={true}
    />
  );
}
