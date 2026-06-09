import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { User, Lock, Eye, EyeOff } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { styles } from "../pages/styles";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isSubmitting: boolean;
  error: string;
}

export default function LoginForm({ onSubmit, isSubmitting, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <Animated.View style={styles.formContainer}>
      <View style={styles.form}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username or Email</Text>
          <View style={styles.inputWrapper}>
            <User color="#64748b" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="student"
              placeholderTextColor="#475569"
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
            <TouchableOpacity disabled={isSubmitting}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Lock color="#64748b" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="1234"
              placeholderTextColor="#475569"
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
                <EyeOff color="#64748b" size={20} />
              ) : (
                <Eye color="#64748b" size={20} />
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
                color: "#dc2626",
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
          <TouchableOpacity disabled={isSubmitting}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
