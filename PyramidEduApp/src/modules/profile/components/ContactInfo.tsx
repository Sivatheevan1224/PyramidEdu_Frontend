import React from "react";
import { View, Text } from "react-native";
import { Mail, Phone, MapPin } from "lucide-react-native";
import { Colors } from "../../../constants/colors";
import { styles } from "../pages/styles";

interface ContactInfoProps {
  email?: string;
  phone?: string | null;
  address?: string | null;
}

export default function ContactInfo({ email, phone, address }: ContactInfoProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
      <View style={styles.card}>
        <View style={styles.contactItem}>
          <Mail size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{email || "-"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.contactItem}>
          <Phone size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{phone || "-"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.contactItem}>
          <MapPin size={20} color={Colors.primary} strokeWidth={2} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Location</Text>
            <Text style={styles.contactValue}>{address || "-"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
