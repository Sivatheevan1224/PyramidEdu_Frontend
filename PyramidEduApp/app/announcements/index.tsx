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
import { Bell, Search, AlertCircle, FileText, ChevronRight, ArrowLeft } from "lucide-react-native";
import { Colors } from "../../src/constants/colors";
import { useAuth } from "../../src/modules/auth";
import { MOBILE_API_BASE_URL } from "../../src/api/config";

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
        style={styles.card}
        onPress={() => router.push(`/announcements/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + "15" }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <Text style={styles.titleText}>{item.title}</Text>
        
        <Text style={styles.previewText} numberOfLines={2}>
          {item.content}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.publisherInfo}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>
                {item.sender?.fullName.charAt(0).toUpperCase() || "A"}
              </Text>
            </View>
            <View>
              <Text style={styles.publisherName}>{item.sender?.fullName || "Staff"}</Text>
              <Text style={styles.publisherRole}>{item.sender?.role || "ADMIN"}</Text>
            </View>
          </View>
          
          <View style={styles.arrowIcon}>
            {item.attachmentUrl ? (
              <FileText size={16} color={Colors.textTertiary} style={{ marginRight: 6 }} />
            ) : null}
            <ChevronRight size={18} color={Colors.textTertiary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/dashboard" as any)}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcement Feed</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by title or publisher..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholderTextColor={Colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredAnnouncements.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAnnouncements(true)} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell size={48} color={Colors.textTertiary} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Text style={styles.emptyTitle}>No announcements found</Text>
              <Text style={styles.emptySubtitle}>You are up to date on all notices.</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAnnouncements(true)} colors={[Colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: 10,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  searchContainer: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textTertiary,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarMiniText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  publisherName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  publisherRole: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textTertiary,
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
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: 4,
  },
});
