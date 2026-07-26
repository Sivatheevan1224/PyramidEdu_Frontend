import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FileText, ChevronRight } from "lucide-react-native";
import { Announcement } from "../types/announcements.types";
import { getPriorityColor } from "../constants/announcements.constants";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onPress,
}) => {
  const { colors } = useAppTheme();

  const formattedDate = new Date(announcement.publishDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(announcement.priority) + "15" }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(announcement.priority) }]}>
            {announcement.priority}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: colors.textTertiary }]}>{formattedDate}</Text>
      </View>

      <Text style={[styles.titleText, { color: colors.textPrimary }]}>{announcement.title}</Text>
      
      <Text style={[styles.previewText, { color: colors.textSecondary }]} numberOfLines={2}>
        {announcement.content}
      </Text>

      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View style={styles.publisherInfo}>
          <View style={[styles.avatarMini, { backgroundColor: colors.primarySurface }]}>
            <Text style={[styles.avatarMiniText, { color: colors.primary }]}>
              {announcement.sender?.fullName.charAt(0).toUpperCase() || "A"}
            </Text>
          </View>
          <View>
            <Text style={[styles.publisherName, { color: colors.textPrimary }]}>{announcement.sender?.fullName || "Staff"}</Text>
            <Text style={[styles.publisherRole, { color: colors.textTertiary }]}>{announcement.sender?.role || "ADMIN"}</Text>
          </View>
        </View>
        
        <View style={styles.arrowIcon}>
          {announcement.attachmentUrl ? (
            <FileText size={16} color={colors.textTertiary} style={{ marginRight: 6 }} />
          ) : null}
          <ChevronRight size={18} color={colors.textTertiary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
