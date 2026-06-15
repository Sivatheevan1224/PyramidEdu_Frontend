import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/colors";

interface MCQOptionItemProps {
  label: string; // e.g. "A"
  text: string;  // option text
  isSelected: boolean;
  onPress: () => void;
}

export function MCQOptionItem({ label, text, isSelected, onPress }: MCQOptionItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, isSelected && styles.selectedRadio]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedRadio: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  selectedText: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
