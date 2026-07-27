import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Search } from "lucide-react-native";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { AnnouncementCard } from "../components/AnnouncementCard";

export const AnnouncementsScreen: React.FC = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  
  const {
    filteredAnnouncements,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useAnnouncements(accessToken);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Announcement Feed" />

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by title or publisher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchInput, { color: colors.textPrimary }]}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredAnnouncements.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell size={48} color={colors.textTertiary} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No announcements found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>You are up to date on all notices.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredAnnouncements}
          renderItem={({ item }) => (
            <AnnouncementCard
              announcement={item}
              onPress={() => router.push(`/announcements/${item.id}` as any)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    paddingTop: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
