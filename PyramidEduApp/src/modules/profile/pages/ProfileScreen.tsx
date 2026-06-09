import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { styles } from "./styles";
import ProfileHeader from "../components/ProfileHeader";
import StatsSection from "../components/StatsSection";
import ContactInfo from "../components/ContactInfo";
import AcademicDetails from "../components/AcademicDetails";
import ProfileActions from "../components/ProfileActions";

export default function ProfileScreen() {
  const router = useRouter();
  const { student, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(welcome)" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader student={student} />
        <StatsSection />
        <ContactInfo
          email={student?.email}
          phone={student?.student.phone}
          address={student?.student.address}
        />
        <AcademicDetails />
        <ProfileActions onLogout={handleLogout} />
        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="profile" />
    </SafeAreaView>
  );
}
