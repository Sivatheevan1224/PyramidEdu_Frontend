import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell, User } from "lucide-react-native";
import { Colors } from "../constants/colors";
import { useAuth } from "../modules/auth";

export default function TopBar() {
  const { student } = useAuth();
  const displayName = student?.student.firstName || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.appName}>PyramidEdu</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {student?.student.indexNumber || "Student Portal"}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={Colors.textPrimary} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayInitial}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textInverse,
  },
});
