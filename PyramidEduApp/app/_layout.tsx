import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

export default function RootLayout() {
  return (
    <ThemeProvider value={{
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: "#0B0B0B",
      }
    }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0B0B0B" },
          animation: "none",
        }}
      />
    </ThemeProvider>
  );
}
