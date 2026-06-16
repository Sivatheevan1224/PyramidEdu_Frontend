import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { FileText, Calendar, Info, Users, Book } from "lucide-react-native";
import { useAuth } from "../../src/modules/auth";
import { MOBILE_API_BASE_URL } from "../../src/api/config";
import SecondaryTopBar from "../../src/components/SecondaryTopBar";
import { useAppTheme } from "../../src/hooks/useAppTheme";

interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  expiryDate?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  attachmentUrl?: string | null;
  sender?: {
    fullName: string;
    role: string;
  };
  batches?: { id: string; batchName: string }[];
  subjects?: { id: string; subjectName: string }[];
}

export default function AnnouncementDetails() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        const response = await fetch(`${baseUrl}/announcements/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && json.data) {
          setAnnouncement(json.data);
        }
      } catch (err) {
        console.error("Failed to load announcement details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [accessToken, id]);

  const handleOpenAttachment = () => {
    if (announcement?.attachmentUrl) {
      Linking.openURL(announcement.attachmentUrl).catch((err) =>
        console.error("Failed to open attachment URL", err)
      );
    }
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
        <SecondaryTopBar title="Details" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!announcement) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
        <SecondaryTopBar title="Error" />
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Announcement not found or access denied.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedPublish = new Date(announcement.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Notice Details" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title block */}
        <View style={styles.titleSection}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(announcement.priority) + "15" }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(announcement.priority) }]}>
              {announcement.priority} PRIORITY
            </Text>
          </View>
          <Text style={[styles.titleText, { color: colors.textPrimary }]}>{announcement.title}</Text>
        </View>

        {/* Publisher block */}
        <View style={[styles.publisherCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.publisherAvatar, { backgroundColor: colors.primarySurface }]}>
            <Text style={[styles.publisherAvatarText, { color: colors.primary }]}>
              {announcement.sender?.fullName.charAt(0).toUpperCase() || "A"}
            </Text>
          </View>
          <View style={styles.publisherDetails}>
            <Text style={[styles.publisherName, { color: colors.textPrimary }]}>{announcement.sender?.fullName || "Staff"}</Text>
            <Text style={[styles.publisherRole, { color: colors.textTertiary }]}>{announcement.sender?.role || "ADMIN"}</Text>
          </View>
        </View>

        {/* Message Content */}
        <View style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.contentText, { color: colors.textPrimary }]}>{announcement.content}</Text>
        </View>

        {/* Timeline Dates */}
        <View style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <Calendar size={18} color={colors.textTertiary} style={{ marginRight: 10 }} />
            <View>
              <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>Published</Text>
              <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{formattedPublish}</Text>
            </View>
          </View>
          
          {announcement.expiryDate ? (
            <View style={[styles.metaRow, { marginTop: 12 }]}>
              <Info size={18} color={colors.textTertiary} style={{ marginRight: 10 }} />
              <View>
                <Text style={[styles.metaLabel, { color: colors.textTertiary }]}>Expires</Text>
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                  {new Date(announcement.expiryDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Targeting Info */}
        {((announcement.batches && announcement.batches.length > 0) || 
          (announcement.subjects && announcement.subjects.length > 0)) && (
          <View style={[styles.targetCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.targetTitle, { color: colors.textPrimary }]}>Target Audience</Text>
            
            {announcement.batches && announcement.batches.length > 0 && (
              <View style={styles.targetRow}>
                <Users size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>Batches: </Text>
                <Text style={[styles.targetValue, { color: colors.textPrimary }]}>{announcement.batches.map(b => b.batchName).join(", ")}</Text>
              </View>
            )}

            {announcement.subjects && announcement.subjects.length > 0 && (
              <View style={[styles.targetRow, { marginTop: 8 }]}>
                <Book size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>Subjects: </Text>
                <Text style={[styles.targetValue, { color: colors.textPrimary }]}>{announcement.subjects.map(s => s.subjectName).join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {/* Attachment Card */}
        {announcement.attachmentUrl ? (
          <View style={[styles.attachmentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.attachmentInfo}>
              <FileText size={28} color="#ef4444" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.attachmentTitle, { color: colors.textPrimary }]}>Notice Document</Text>
                <Text style={styles.attachmentSubtitle} numberOfLines={1}>
                  {announcement.attachmentUrl.split("/").pop()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.attachmentButton, { backgroundColor: colors.primary }]} onPress={handleOpenAttachment}>
              <Text style={[styles.attachmentButtonText, { color: colors.surface }]}>View Attachment</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  publisherCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  publisherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  publisherAvatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  publisherDetails: {
    flex: 1,
  },
  publisherName: {
    fontSize: 14,
    fontWeight: "700",
  },
  publisherRole: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 1,
  },
  contentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  metaCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  targetCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  targetTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  targetValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  attachmentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  attachmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  attachmentSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  attachmentButton: {
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 32,
    textAlign: "center",
  },
});
