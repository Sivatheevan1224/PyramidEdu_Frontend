import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { User, Lock, Eye, EyeOff } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { getStyles } from "../pages/styles";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isSubmitting: boolean;
  error: string;
}

export default function LoginForm({ onSubmit, isSubmitting, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useAppTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const onPressIn = () => {
    buttonScale.value = withSpring(0.98);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handlePressSubmit = () => {
    onSubmit(email, password);
  };

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
    <Animated.View style={styles.formContainer}>
      <View style={styles.form}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <User color={colors.textSecondary} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity disabled={isSubmitting} onPress={() => router.push("/forgot-password" as any)}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Lock color={colors.textSecondary} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff color={colors.textSecondary} size={20} />
              ) : (
                <Eye color={colors.textSecondary} size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handlePressSubmit}
            disabled={isSubmitting}
            style={[styles.button, isSubmitting && { opacity: 0.8 }]}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {error ? (
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                color: colors.error,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity disabled={isSubmitting} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
