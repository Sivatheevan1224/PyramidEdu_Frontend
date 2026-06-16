import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { getStyles } from "./_styles";
import { useAppTheme } from "../../src/hooks/useAppTheme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  
  const signUpScale = useSharedValue(1);
  const loginScale = useSharedValue(1);

  const animatedSignUpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signUpScale.value }],
  }));

  const animatedLoginStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loginScale.value }],
  }));

  const handleSignUp = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || "http://localhost:3000";
    const signUpUrl = `${baseUrl}/register`;
    try {
      await Linking.openURL(signUpUrl);
    } catch (error) {
      console.error("Failed to open register URL:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View 
          style={styles.logoContainer}
        >
          <Image
            source={require("../../assets/images/logo.svg")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.title}>Elevate your academic journey.</Text>
        </Animated.View>

        {/* Buttons Section */}
        <Animated.View 
          style={styles.buttonContainer}
        >
          <Animated.View style={animatedSignUpStyle}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => (signUpScale.value = withSpring(0.98))}
              onPressOut={() => (signUpScale.value = withSpring(1))}
              onPress={handleSignUp}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animatedLoginStyle}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => (loginScale.value = withSpring(0.98))}
              onPressOut={() => (loginScale.value = withSpring(1))}
              onPress={() => router.push("/login" as any)}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
