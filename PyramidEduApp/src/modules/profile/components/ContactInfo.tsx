import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Mail, Phone, User, ShieldAlert, Award } from "lucide-react-native";
import { Colors } from "../../../constants/colors";

interface ContactInfoProps {
  fullName: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  onChangeFullName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onSave: () => void;
  saving: boolean;
}

export default function ContactInfo({
  fullName,
  phone,
  email,
  role,
  status,
  onChangeFullName,
  onChangePhone,
  onSave,
  saving,
}: ContactInfoProps) {
  const UserIcon = User as any;
  const PhoneIcon = Phone as any;
  const MailIcon = Mail as any;
  const AwardIcon = Award as any;
  const ShieldAlertIcon = ShieldAlert as any;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Details</Text>
      
      {/* Editable Full Name */}
      <View style={styles.card}>
        <View style={styles.itemRow}>
          <UserIcon size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={onChangeFullName}
              placeholder="Enter full name"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>
      </View>

      {/* Editable Phone Number */}
      <View style={styles.card}>
        <View style={styles.itemRow}>
          <PhoneIcon size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={onChangePhone}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {/* Read-Only Email */}
      <View style={[styles.card, styles.disabledCard]}>
        <View style={styles.itemRow}>
          <MailIcon size={20} color={Colors.textTertiary} strokeWidth={2} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address (Read-Only)</Text>
            <Text style={styles.readOnlyText}>{email || "-"}</Text>
          </View>
        </View>
      </View>

      {/* Read-Only Role */}
      <View style={[styles.card, styles.disabledCard]}>
        <View style={styles.itemRow}>
          <AwardIcon size={20} color={Colors.textTertiary} strokeWidth={2} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Role (Read-Only)</Text>
            <Text style={styles.readOnlyText}>{role || "STUDENT"}</Text>
          </View>
        </View>
      </View>

      {/* Read-Only Account Status */}
      <View style={[styles.card, styles.disabledCard]}>
        <View style={styles.itemRow}>
          <ShieldAlertIcon size={20} color={Colors.textTertiary} strokeWidth={2} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Status (Read-Only)</Text>
            <Text style={styles.readOnlyText}>{status || "ACTIVE"}</Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  disabledCard: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.border,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0, // Reset default padding
    fontWeight: "500",
  },
  readOnlyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
