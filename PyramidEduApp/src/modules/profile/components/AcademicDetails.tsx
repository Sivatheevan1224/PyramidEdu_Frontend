import React from "react";
import { View, Text } from "react-native";
import { BookOpen, Award, Users } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { styles } from "../pages/styles";

interface AcademicDetailsProps {
  school?: string | null;
  batch?: string | null;
  performanceStatus?: string | null;
}

export default function AcademicDetails({ school, batch, performanceStatus }: AcademicDetailsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Academic Details</Text>
      
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <BookOpen size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>School</Text>
            <Text style={styles.detailValue}>{school || "Pyramid Education Institute"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Users size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Batch / Class</Text>
            <Text style={styles.detailValue}>{batch || "Grade 10"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Award size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Academic Standing</Text>
            <Text style={styles.detailValue}>{performanceStatus || "GOOD"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
