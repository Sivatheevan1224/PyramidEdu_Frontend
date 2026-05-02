import { Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
