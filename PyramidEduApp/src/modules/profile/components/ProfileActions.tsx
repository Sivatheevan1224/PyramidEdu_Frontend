import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Settings, LogOut } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { styles } from "../pages/styles";

interface ProfileActionsProps {
  onLogout: () => void;
}

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={[styles.card, styles.actionCard]}>
        <Settings size={20} color={Colors.primary} strokeWidth={2} />
        <Text style={styles.actionText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.logoutCard]}
        onPress={onLogout}
      >
        <LogOut size={20} color={Colors.danger} strokeWidth={2} />
        <Text style={[styles.actionText, { color: Colors.danger }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
