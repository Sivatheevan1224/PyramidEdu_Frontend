import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AnnouncementDetailsScreen } from "../../src/modules/announcements";

export default function AnnouncementDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <AnnouncementDetailsScreen id={id || ""} />;
}
