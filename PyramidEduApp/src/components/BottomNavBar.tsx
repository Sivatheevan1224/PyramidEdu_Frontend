import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Home,
  ClipboardList,
  TrendingUp,
  BookOpen,
  User,
} from "lucide-react-native";

export default function BottomNavBar() {
  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNavBackground}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Home color="#1db954" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ClipboardList color="#64748b" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <TrendingUp color="#64748b" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <BookOpen color="#64748b" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User color="#64748b" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  bottomNavBackground: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(24, 24, 24, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 32,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
  },
  navItemActive: {
    backgroundColor: "rgba(29, 185, 84, 0.1)",
    borderRadius: 24,
  },
});
