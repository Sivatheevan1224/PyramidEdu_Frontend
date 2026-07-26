import { useState, useEffect } from "react";
import { Announcement } from "../types/announcements.types";
import { fetchReceivedAnnouncements } from "../services/announcements.service";
import { useAnnouncementsStore } from "../store/announcements.store";

export const useAnnouncements = (accessToken: string | null) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { searchQuery, setSearchQuery } = useAnnouncementsStore();

  const loadAnnouncements = async (isRefresh = false) => {
    if (!accessToken) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchReceivedAnnouncements(accessToken);
      setAnnouncements(data);
      applyFilter(data, searchQuery);
    } catch (err) {
      console.error("Failed to load announcements feed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  useEffect(() => {
    if (accessToken) {
      loadAnnouncements();
    }
  }, [accessToken]);

  // Re-apply filter when searchQuery changes
  useEffect(() => {
    applyFilter(announcements, searchQuery);
  }, [searchQuery, announcements]);

  return {
    announcements,
    filteredAnnouncements,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery: handleSearchChange,
    refresh: () => loadAnnouncements(true),
  };
};
