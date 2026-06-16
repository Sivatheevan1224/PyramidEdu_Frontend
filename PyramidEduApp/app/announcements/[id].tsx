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
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, FileText, Calendar, Info, Users, Book } from "lucide-react-native";
import { Colors } from "../../src/constants/colors";
import { useAuth } from "../../src/modules/auth";
import { MOBILE_API_BASE_URL } from "../../src/api/config";
import SecondaryTopBar from "../../src/components/SecondaryTopBar";

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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  
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
      <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
        <SecondaryTopBar title="Details" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!announcement) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
        <SecondaryTopBar title="Error" />
        <View style={styles.center}>
          <Text style={styles.errorText}>Announcement not found or access denied.</Text>
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
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar title="Notice Details" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title block */}
        <View style={styles.titleSection}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(announcement.priority) + "15" }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(announcement.priority) }]}>
              {announcement.priority} PRIORITY
            </Text>
          </View>
          <Text style={styles.titleText}>{announcement.title}</Text>
        </View>

        {/* Publisher block */}
        <View style={styles.publisherCard}>
          <View style={styles.publisherAvatar}>
            <Text style={styles.publisherAvatarText}>
              {announcement.sender?.fullName.charAt(0).toUpperCase() || "A"}
            </Text>
          </View>
          <View style={styles.publisherDetails}>
            <Text style={styles.publisherName}>{announcement.sender?.fullName || "Staff"}</Text>
            <Text style={styles.publisherRole}>{announcement.sender?.role || "ADMIN"}</Text>
          </View>
        </View>

        {/* Message Content */}
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{announcement.content}</Text>
        </View>

        {/* Timeline Dates */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Calendar size={18} color={Colors.textTertiary} style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.metaLabel}>Published</Text>
              <Text style={styles.metaValue}>{formattedPublish}</Text>
            </View>
          </View>
          
          {announcement.expiryDate ? (
            <View style={[styles.metaRow, { marginTop: 12 }]}>
              <Info size={18} color={Colors.textTertiary} style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.metaLabel}>Expires</Text>
                <Text style={styles.metaValue}>
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
          <View style={styles.targetCard}>
            <Text style={styles.targetTitle}>Target Audience</Text>
            
            {announcement.batches && announcement.batches.length > 0 && (
              <View style={styles.targetRow}>
                <Users size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.targetLabel}>Batches: </Text>
                <Text style={styles.targetValue}>{announcement.batches.map(b => b.batchName).join(", ")}</Text>
              </View>
            )}

            {announcement.subjects && announcement.subjects.length > 0 && (
              <View style={[styles.targetRow, { marginTop: 8 }]}>
                <Book size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.targetLabel}>Subjects: </Text>
                <Text style={styles.targetValue}>{announcement.subjects.map(s => s.subjectName).join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {/* Attachment Card */}
        {announcement.attachmentUrl ? (
          <View style={styles.attachmentCard}>
            <View style={styles.attachmentInfo}>
              <FileText size={28} color="#ef4444" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.attachmentTitle}>Notice Document</Text>
                <Text style={styles.attachmentSubtitle} numberOfLines={1}>
                  {announcement.attachmentUrl.split("/").pop()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.attachmentButton} onPress={handleOpenAttachment}>
              <Text style={styles.attachmentButtonText}>View Attachment</Text>
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
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  publisherCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  publisherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  publisherAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  publisherDetails: {
    flex: 1,
  },
  publisherName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  publisherRole: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    marginTop: 1,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  metaCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textTertiary,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  targetCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  targetTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
  },
  targetValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  attachmentCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
  },
  attachmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  attachmentSubtitle: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  attachmentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    paddingHorizontal: 32,
    textAlign: "center",
  },
});
