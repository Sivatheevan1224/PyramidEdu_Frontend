import { StyleSheet, Text, View } from "react-native";

type ScreenPlaceholderProps = {
  title: string;
  description: string;
};

export function ScreenPlaceholder({
  title,
  description,
}: ScreenPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  description: {
    color: "#475569",
    fontSize: 16,
    textAlign: "center",
  },
});
