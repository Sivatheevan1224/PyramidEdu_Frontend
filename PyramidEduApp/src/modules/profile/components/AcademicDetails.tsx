import React from "react";
import { View, Text } from "react-native";
import { BookOpen, Award } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { styles } from "../pages/styles";

export default function AcademicDetails() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Academic Details</Text>
      
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <BookOpen size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>School</Text>
            <Text style={styles.detailValue}>Modern Public School</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Award size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Current Stream</Text>
            <Text style={styles.detailValue}>Science</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
