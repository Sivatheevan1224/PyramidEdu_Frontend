import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  DeviceEventEmitter,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Bell,
  BookOpen,
  Wallet,
  Info,
  Trash2,
  Check,
  ArrowLeft,
  GraduationCap,
  Calendar,
  AlertCircle
} from "lucide-react-native";
import { useAuth } from "../../src/modules/auth";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import client from "../../src/api/client";
import { showSuccess, showError } from "../../src/services/notification.service";

interface Notification {
  id: string;
  title: string;
  message: string;
  notificationType: "SYSTEM" | "FINANCIAL" | "ACADEMIC" | "ANNOUNCEMENT";
  isRead: boolean;
  createdAt: string;
  sentAt?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors, theme } = useAppTheme();

  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const [unreadList, setUnreadList] = useState<Notification[]>([]);
  const [readList, setReadList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications based on active tab
  const fetchNotifications = async (silent = false) => {
    if (!accessToken) return;
    if (!silent) setLoading(true);

    try {
      if (activeTab === "unread") {
        const response = await client.get("/notifications?limit=50&isRead=false");
        if (response.data?.success) {
          setUnreadList(response.data.data || []);
        }
      } else {
        const response = await client.get("/notifications/read?limit=50");
        if (response.data?.success) {
          setReadList(response.data.data || []);
        }
      }
      // Also notify TopBar to update unread badge count
      DeviceEventEmitter.emit("notificationCountChanged");
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [accessToken, activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const handleMarkAsRead = async (id: string) => {
    // Optimistic UI update: instantly remove from list
    const originalUnread = [...unreadList];
    setUnreadList((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await client.patch(`/notifications/${id}/read`);
      if (response.data?.success) {
        showSuccess("Notification marked as read.");
        // Notify TopBar badge
        DeviceEventEmitter.emit("notificationCountChanged");
      } else {
        // Rollback
        setUnreadList(originalUnread);
      }
    } catch (err) {
      // Rollback
      setUnreadList(originalUnread);
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Notification?",
      "Are you sure you want to permanently delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => performDelete(id),
        },
      ]
    );
  };

  const performDelete = async (id: string) => {
    // Optimistic UI update
    const originalReadList = [...readList];
    setReadList((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await client.delete(`/notifications/${id}`);
      if (response.data?.success) {
        showSuccess("Notification deleted successfully.");
        // Notify TopBar badge
        DeviceEventEmitter.emit("notificationCountChanged");
      } else {
        setReadList(originalReadList);
      }
    } catch (err) {
      setReadList(originalReadList);
      console.error("Failed to delete notification:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconSize = 20;
    switch (type) {
      case "ACADEMIC":
        return {
          icon: <GraduationCap size={iconSize} color={colors.primary} />,
          bg: colors.primarySurface,
        };
      case "FINANCIAL":
        return {
          icon: <Wallet size={iconSize} color="#10B981" />,
          bg: "#E6F4EA",
        };
      case "ANNOUNCEMENT":
        return {
          icon: <Bell size={iconSize} color="#8B5CF6" />,
          bg: "#F5F3FF",
        };
      case "SYSTEM":
      default:
        return {
          icon: <AlertCircle size={iconSize} color="#EF4444" />,
          bg: "#FEF2F2",
        };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const dateObj = new Date(item.sentAt || item.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const iconData = getNotificationIcon(item.notificationType);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBg, { backgroundColor: iconData.bg }]}>
            {iconData.icon}
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardDate, { color: colors.textTertiary }]}>
              {formattedDate}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardMessage, { color: colors.textSecondary }]}>
          {item.message}
        </Text>

        <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
          <Text style={[styles.typeText, { color: colors.textTertiary }]}>
            {item.notificationType}
          </Text>

          {activeTab === "unread" ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primarySurface }]}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <Check size={14} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Mark as Read
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#FEE2E2" }]}
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={14} color="#EF4444" style={{ marginRight: 4 }} />
              <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.skeletonCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.skeletonHeader}>
            <View style={[styles.skeletonCircle, { backgroundColor: colors.border }]} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={[styles.skeletonLine, { width: "60%", backgroundColor: colors.border }]} />
              <View style={[styles.skeletonLine, { width: "30%", backgroundColor: colors.border }]} />
            </View>
          </View>
          <View style={[styles.skeletonLine, { width: "90%", height: 12, marginTop: 12, backgroundColor: colors.border }]} />
          <View style={[styles.skeletonLine, { width: "75%", height: 12, marginTop: 6, backgroundColor: colors.border }]} />
        </View>
      ))}
    </View>
  );

  const activeList = activeTab === "unread" ? unreadList : readList;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard" as any);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header bar */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Notifications
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "unread" && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab("unread")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "unread" ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === "unread" ? "700" : "500",
              },
            ]}
          >
            Unread ({unreadList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "read" && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab("read")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "read" ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === "read" ? "700" : "500",
              },
            ]}
          >
            Read History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={activeList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell
                size={64}
                color={colors.textTertiary}
                style={{ marginBottom: 16, opacity: 0.4 }}
              />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {activeTab === "unread" ? "You're all caught up!" : "No history found"}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
                {activeTab === "unread"
                  ? "No new notifications right now."
                  : "Read notifications will be stored here."}
              </Text>
            </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 11,
    marginTop: 2,
  },
  cardMessage: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
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
