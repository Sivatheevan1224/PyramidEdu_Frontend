import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { User, Lock, Eye, EyeOff } from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { styles } from "./_styles";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = () => {
    if (email.toLowerCase() === "student" && password === "1234") {
      router.push("/dashboard" as any);
    } else {
      alert("Invalid credentials! Try Username: student, Password: 1234");
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/logo.svg")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          </Animated.View>

          {/* Login Form Container */}
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
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity>
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
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
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
                  onPress={handleLogin}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
