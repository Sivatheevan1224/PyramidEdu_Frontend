import React, { useState } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { showSuccess, showError, showWarning } from "../../../services/notification.service";
import { Lock, Eye, EyeOff, Save, Check, X } from "lucide-react-native";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { BASE_API_URL } from "../../../api/config";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { accessToken, reloadStudentProfile } = useAuth();
  const { colors } = useAppTheme();

  // Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility States
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  // Zod equivalent checks for visual feedback
  const checks = {
    length: newPassword.length >= 10 && newPassword.length <= 72,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/.test(newPassword),
  };

  const isFormValid = 
    oldPassword.length > 0 &&
    checks.length &&
    checks.uppercase &&
    checks.lowercase &&
    checks.number &&
    checks.special &&
    newPassword === confirmPassword;

  const handleUpdatePassword = async () => {
    if (!oldPassword) {
      showWarning("Please enter your current password.", "Current Password Required");
      return;
    }

    if (!newPassword) {
      showWarning("Please enter a new password.", "New Password Required");
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarning("New password and confirm password do not match.", "Password Mismatch");
      return;
    }

    if (!checks.length || !checks.uppercase || !checks.lowercase || !checks.number || !checks.special) {
      showWarning("Please make sure your new password meets all criteria.", "Validation Error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const json = await response.json();
      if (json.success) {
        showSuccess("Your password has been changed successfully.", "Password Updated");
        await reloadStudentProfile();
        
        // Go back or go to settings
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/settings" as any);
        }
      } else {
        showError(json.message || "Failed to update password. Please check your current password.");
      }
    } catch (err: any) {
      console.error("Change password failed:", err);
      showError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const EyeIcon = Eye as any;
  const EyeOffIcon = EyeOff as any;
  const LockIcon = Lock as any;
  const SaveIcon = Save as any;
  const CheckIcon = Check as any;
  const XIcon = X as any;

  // Criteria validation renderer
  const renderCriterion = (label: string, met: boolean) => (
    <View style={styles.criteriaRow}>
      {met ? (
        <CheckIcon size={14} color="#4CAF50" style={styles.criteriaIcon} />
      ) : (
        <XIcon size={14} color={colors.textTertiary} style={styles.criteriaIcon} />
      )}
      <Text style={[
        styles.criteriaText, 
        { color: met ? "#4CAF50" : colors.textTertiary }
      ]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Change Password" rightType="none" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSpacer} />

          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Current Password</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                <LockIcon size={18} color={colors.textTertiary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showOld}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowOld(!showOld)} style={styles.eyeBtn}>
                  {showOld ? (
                    <EyeOffIcon size={18} color={colors.textTertiary} />
                  ) : (
                    <EyeIcon size={18} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Password</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                <LockIcon size={18} color={colors.textTertiary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                  {showNew ? (
                    <EyeOffIcon size={18} color={colors.textTertiary} />
                  ) : (
                    <EyeIcon size={18} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Criteria List */}
            {newPassword.length > 0 && (
              <View style={styles.criteriaContainer}>
                {renderCriterion("Between 10 and 72 characters", checks.length)}
                {renderCriterion("At least one uppercase letter (A-Z)", checks.uppercase)}
                {renderCriterion("At least one lowercase letter (a-z)", checks.lowercase)}
                {renderCriterion("At least one number (0-9)", checks.number)}
                {renderCriterion("At least one special character (!@#$%^&*)", checks.special)}
              </View>
            )}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm New Password</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                <LockIcon size={18} color={colors.textTertiary} style={styles.fieldIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                  {showConfirm ? (
                    <EyeOffIcon size={18} color={colors.textTertiary} />
                  ) : (
                    <EyeIcon size={18} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Save Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { 
                  backgroundColor: isFormValid ? colors.primary : colors.border,
                  opacity: saving ? 0.7 : 1 
                }
              ]}
              disabled={!isFormValid || saving}
              onPress={handleUpdatePassword}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <SaveIcon size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Update Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSpacer: {
    height: 12,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  inputContainer: {
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    height: "100%",
  },
  eyeBtn: {
    padding: 8,
  },
  divider: {
    height: 1,
  },
  criteriaContainer: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.02)",
    marginBottom: 8,
    gap: 6,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  criteriaIcon: {
    marginRight: 8,
  },
  criteriaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionContainer: {
    paddingHorizontal: 8,
  },
  saveButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
