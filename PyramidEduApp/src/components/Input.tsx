import { TextInput, StyleSheet, TextInputProps } from "react-native";

export function Input(props: TextInputProps) {
  return (
    <TextInput placeholderTextColor="#94a3b8" style={styles.input} {...props} />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
});
