import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../validation";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "../components/LoginForm";

export default function LoginScreen() {
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signIn, clearAuthError, isSessionExpired, setSessionExpired } = useAuth();

  // Set session expired error if user was logged out automatically
  useEffect(() => {
    if (isSessionExpired) {
      setLocalError("Your session has expired. Please sign in again.");
      // Clear it so it doesn't persist forever
      setSessionExpired(false);
    }
  }, [isSessionExpired]);

  const handleLogin = async (email: string, password: string) => {
    const errorMsg = validateLogin(email, password);
    if (errorMsg) {
      setLocalError(errorMsg);
      return;
    }

    setIsSubmitting(true);
    setLocalError("");
    clearAuthError();

    try {
      await signIn({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/dashboard" as any);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
          <AuthHeader />
          <LoginForm
            onSubmit={handleLogin}
            isSubmitting={isSubmitting}
            error={localError}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
