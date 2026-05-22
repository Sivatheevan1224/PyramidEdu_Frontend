import { Ionicons } from "@expo/vector-icons";

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
};

export function TabBarIcon({ name, color, size }: TabBarIconProps) {
  return <Ionicons name={name} color={color} size={size} />;
}
