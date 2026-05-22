import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";

export default function DashboardHeader() {
  return (
    <View style={[styles.header, { justifyContent: "flex-end" }]}>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Bell color="#9ca3af" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <View
            style={[
              styles.profilePic,
              {
                backgroundColor: "#1db954",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ color: "#000000", fontWeight: "900", fontSize: 16 }}>
              M
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
