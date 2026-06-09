import React from "react";
import { View, Text } from "react-native";
import { styles } from "../pages/styles";

interface ProfileHeaderProps {
  student: any;
}

export default function ProfileHeader({ student }: ProfileHeaderProps) {
  const firstName = student?.student.firstName || "Student";
  const lastName = student?.student.lastName || "";
  const displayName = student ? `${firstName} ${lastName}` : "Student";
  const displayInitial = firstName.charAt(0).toUpperCase();

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{displayInitial}</Text>
      </View>
      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.rollNumber}>
        {student?.student.indexNumber ? `Index No: ${student.student.indexNumber}` : "Logged in student"}
      </Text>
      <Text style={styles.className}>
        {student?.email || "PyramidEdu Mobile"}
      </Text>
    </View>
  );
}
