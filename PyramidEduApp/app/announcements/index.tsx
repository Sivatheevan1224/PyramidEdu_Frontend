import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Search, FileText, ChevronRight } from "lucide-react-native";
import { useAuth } from "../../src/modules/auth";
import { MOBILE_API_BASE_URL } from "../../src/api/config";
import SecondaryTopBar from "../../src/components/SecondaryTopBar";
import { useAppTheme } from "../../src/hooks/useAppTheme";

interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  attachmentUrl?: string | null;
  sender?: {
    fullName: string;
    role: string;
  };
}

export default function AnnouncementsFeed() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAnnouncements = async (isRefresh = false) => {
    if (!accessToken) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/announcements/received?limit=100`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();
      if (json.success && json.data && Array.isArray(json.data.data)) {
        setAnnouncements(json.data.data);
        applyFilter(json.data.data, searchQuery);
      }
    } catch (err) {
      console.error("Failed to load announcements feed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [accessToken]);

  const applyFilter = (list: Announcement[], query: string) => {
    if (!query.trim()) {
      setFilteredAnnouncements(list);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = list.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        (a.sender?.fullName || "").toLowerCase().includes(lower)
    );
    setFilteredAnnouncements(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    applyFilter(announcements, text);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => {
    const formattedDate = new Date(item.publishDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/announcements/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + "15" }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textTertiary }]}>{formattedDate}</Text>
        </View>

        <Text style={[styles.titleText, { color: colors.textPrimary }]}>{item.title}</Text>
        
        <Text style={[styles.previewText, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.content}
        </Text>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.publisherInfo}>
            <View style={[styles.avatarMini, { backgroundColor: colors.primarySurface }]}>
              <Text style={[styles.avatarMiniText, { color: colors.primary }]}>
                {item.sender?.fullName.charAt(0).toUpperCase() || "A"}
              </Text>
            </View>
            <View>
              <Text style={[styles.publisherName, { color: colors.textPrimary }]}>{item.sender?.fullName || "Staff"}</Text>
              <Text style={[styles.publisherRole, { color: colors.textTertiary }]}>{item.sender?.role || "ADMIN"}</Text>
            </View>
          </View>
          
          <View style={styles.arrowIcon}>
            {item.attachmentUrl ? (
              <FileText size={16} color={colors.textTertiary} style={{ marginRight: 6 }} />
            ) : null}
            <ChevronRight size={18} color={colors.textTertiary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Announcement Feed" />

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by title or publisher..."
          value={searchQuery}
          onChangeText={handleSearchChange}
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
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAnnouncements(true)} colors={[colors.primary]} />
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
          renderItem={renderAnnouncementItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAnnouncements(true)} colors={[colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "800",
  },
  dateText: {
    fontSize: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  publisherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarMiniText: {
    fontSize: 12,
    fontWeight: "700",
  },
  publisherName: {
    fontSize: 12,
    fontWeight: "600",
  },
  publisherRole: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  arrowIcon: {
    flexDirection: "row",
    alignItems: "center",
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
