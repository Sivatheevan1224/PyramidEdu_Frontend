import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Key, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, RefreshCw } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";
import { forgotPassword, verifyOtp, resetPassword } from "../services/api";
import AuthHeader from "../components/AuthHeader";
import { useAppTheme } from "../../../hooks/useAppTheme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  // 1: Email, 2: OTP Verification, 3: Password Reset, 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // OTP Timer States
  const [timer, setTimer] = useState(300); // 5 minutes expiration
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60s cooldown for resend button
  const timerRef = useRef<any>(null);
  const resendTimerRef = useRef<any>(null);

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

  // Start 5-min OTP Expiry countdown
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(300);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start 60s resend cooldown timer
  const startResendTimer = () => {
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    setCanResend(false);
    setResendTimer(60);
    resendTimerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await forgotPassword({ email: email.trim().toLowerCase() });
      setVerificationToken(response.verificationToken);
      setInfoMessage(response.message);
      
      setStep(2);
      startTimer();
      startResendTimer();
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await forgotPassword({ email: email.trim().toLowerCase() });
      setVerificationToken(response.verificationToken);
      setInfoMessage("A new OTP has been sent successfully.");
      
      startTimer();
      startResendTimer();
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    if (timer === 0) {
      setError("OTP has expired. Please resend a new OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        verificationToken,
      });
      setResetToken(response.resetToken);
      
      // Stop timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      
      setError("");
      setInfoMessage("");
      setStep(3);
    } catch (err: any) {
      setError(err?.message || "Invalid OTP code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword({
        token: resetToken,
        newPassword,
        confirmPassword,
      });
      setStep(4);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. Please request a new OTP.");
    } finally {
      setLoading(false);
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

          {/* Back button */}
          <View style={{ width: "100%", maxWidth: 400, marginBottom: 20 }}>
          </View>

          <Animated.View style={styles.formContainer}>
            {step === 1 && (
              <View style={styles.form}>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Mail color={colors.textSecondary} size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textTertiary}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <Animated.View style={animatedButtonStyle}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={handleSendOtp}
                    disabled={loading}
                    style={[styles.button, loading && { opacity: 0.8 }]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.surface} />
                    ) : (
                      <Text style={styles.buttonText}>SEND OTP</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Remember your password? </Text>
                  <TouchableOpacity disabled={loading} onPress={() => router.back()}>
                    <Text style={styles.signUpText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.form}>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.subtitle}>
                    {infoMessage || `We sent a 6-digit code to ${email}`}
                  </Text>
                </View>

                {/* OTP Field */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>6-Digit OTP Code</Text>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: timer === 0 ? colors.error : colors.primary }}>
                      {timer > 0 ? `Expires in ${formatTime(timer)}` : "OTP Expired"}
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Key color={colors.textSecondary} size={20} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { letterSpacing: otp ? 6 : 0, fontWeight: otp ? "700" : "400" }]}
                      placeholder="XXXXXX"
                      placeholderTextColor={colors.textTertiary}
                      value={otp}
                      onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, "").slice(0, 6))}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Verify Button */}
                <Animated.View style={animatedButtonStyle}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={handleVerifyOtp}
                    disabled={loading}
                    style={[styles.button, loading && { opacity: 0.8 }]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.surface} />
                    ) : (
                      <Text style={styles.buttonText}>VERIFY OTP</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Resend Options */}
                <View style={{ alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity 
                    onPress={handleResendOtp} 
                    disabled={!canResend || loading}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6, opacity: canResend ? 1 : 0.6 }}
                  >
                    <RefreshCw size={14} color={canResend ? colors.primary : colors.textTertiary} />
                    <Text style={{ color: canResend ? colors.primary : colors.textTertiary, fontWeight: "600", fontSize: 13 }}>
                      {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Remember your password? </Text>
                  <TouchableOpacity disabled={loading} onPress={() => router.replace("/login")}>
                    <Text style={styles.signUpText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.form}>
                <View style={{ marginBottom: 12 }}>
                  <Text style={[styles.title, { fontSize: 28 }]}>New Password</Text>
                  <Text style={styles.subtitle}>Create a secure password for your account.</Text>
                </View>

                {/* New Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock color={colors.textSecondary} size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="At least 8 characters"
                      placeholderTextColor={colors.textTertiary}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff color={colors.textSecondary} size={20} />
                      ) : (
                        <Eye color={colors.textSecondary} size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock color={colors.textSecondary} size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Repeat new password"
                      placeholderTextColor={colors.textTertiary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff color={colors.textSecondary} size={20} />
                      ) : (
                        <Eye color={colors.textSecondary} size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Reset Button */}
                <Animated.View style={animatedButtonStyle}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={handleResetPassword}
                    disabled={loading}
                    style={[styles.button, loading && { opacity: 0.8 }]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.surface} />
                    ) : (
                      <Text style={styles.buttonText}>RESET PASSWORD</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}

            {step === 4 && (
              <View style={[styles.form, { alignItems: "center", gap: 16 }]}>
                <CheckCircle color="#10B981" size={64} style={{ marginBottom: 8 }} />
                <Text style={[styles.title, { fontSize: 24, textAlign: "center" }]}>Password Reset Success!</Text>
                <Text style={[styles.subtitle, { textAlign: "center" }]}>
                  Your password has been successfully updated. You can now log in using your new password.
                </Text>

                <TouchableOpacity
                  onPress={() => router.replace("/login")}
                  style={[styles.button, { width: "100%", marginTop: 12 }]}
                >
                  <Text style={styles.buttonText}>BACK TO SIGN IN</Text>
                </TouchableOpacity>
              </View>
            )}

            {error ? (
              <View style={{ marginTop: 16 }}>
                <Text
                  style={{
                    color: colors.error,
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
