import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, Search, BookOpen, Eye, Download } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import PdfViewerModal from "../components/PdfViewerModal";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface StudyMaterial {
  id: string;
  title: string;
  text: string | null;
  fileUrls: string[];
  uploadedAt: string;
  subject: {
    subjectName: string;
  };
  teacher: {
    user: {
      fullName: string;
    };
  };
}

export default function MaterialsScreen() {
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [subjects, setSubjects] = useState<string[]>([]);

  // PDF Viewer Modal State
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [activePdfTitle, setActivePdfTitle] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    fetchMaterials();
  }, [accessToken]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/study-materials`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setMaterials(json.data);
        // Extract unique subjects
        const uniqueSubjects: string[] = [];
        json.data.forEach((m: StudyMaterial) => {
          const sName = m.subject?.subjectName;
          if (sName && !uniqueSubjects.includes(sName)) {
            uniqueSubjects.push(sName);
          }
        });
        setSubjects(uniqueSubjects);
      }
    } catch (err) {
      console.error("Error fetching study materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAbsoluteFileUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `${MOBILE_API_BASE_URL.replace("/api/v1/mobile", "")}${url}`;
  };

  const handleOpenPdf = (url: string, title: string) => {
    const absUrl = getAbsoluteFileUrl(url);
    setActivePdfUrl(absUrl);
    setActivePdfTitle(title);
    setViewerVisible(true);
  };

  const handleDownloadPdf = (url: string) => {
    const absUrl = getAbsoluteFileUrl(url);
    Linking.openURL(absUrl).catch((err) =>
      console.error("Failed to download or open URL:", err)
    );
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject =
      selectedSubject === "ALL" || m.subject?.subjectName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search study materials..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Subject Selector */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip, 
              { backgroundColor: colors.surface, borderColor: colors.border },
              selectedSubject === "ALL" && { backgroundColor: colors.primarySurface, borderColor: colors.primary }
            ]}
            onPress={() => setSelectedSubject("ALL")}
          >
            <Text style={[
              styles.chipText, 
              { color: colors.textSecondary },
              selectedSubject === "ALL" && { color: colors.primary, fontWeight: "700" }
            ]}>
              All Subjects
            </Text>
          </TouchableOpacity>
          {subjects.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[
                styles.filterChip, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                selectedSubject === sub && { backgroundColor: colors.primarySurface, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedSubject(sub)}
            >
              <Text style={[
                styles.chipText, 
                { color: colors.textSecondary },
                selectedSubject === sub && { color: colors.primary, fontWeight: "700" }
              ]}>
                {sub}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredMaterials.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={48} color={colors.textTertiary} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No materials found</Text>
            </View>
          ) : (
            filteredMaterials.map((item) => {
              const fileCount = item.fileUrls ? item.fileUrls.length : 0;
              return (
                <View key={item.id} style={[styles.materialCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.materialInfo}>
                    <Text style={[styles.subjectTag, { color: colors.primary }]}>{item.subject?.subjectName || "General"}</Text>
                    <Text style={[styles.materialTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.teacherText, { color: colors.textSecondary }]}>
                      By: {item.teacher?.user?.fullName || "Instructor"}
                    </Text>
                    {item.text ? (
                      <Text style={[styles.materialDescription, { color: colors.textSecondary }]}>{item.text}</Text>
                    ) : null}
                    <Text style={[styles.dateText, { color: colors.textTertiary }]}>
                      Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                    </Text>

                    {/* Files List inside the card */}
                    {fileCount > 0 && (
                      <View style={[styles.filesSection, { borderTopColor: colors.border }]}>
                        <Text style={[styles.filesTitle, { color: colors.textSecondary }]}>Attached PDFs ({fileCount}):</Text>
                        {item.fileUrls.map((file, idx) => {
                          const fileName = file.split("/").pop() || `Document_${idx + 1}.pdf`;
                          return (
                            <View key={idx} style={styles.fileRow}>
                              <View style={styles.fileNameContainer}>
                                <FileText size={16} color={colors.primary} />
                                <Text style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
                                  {fileName}
                                </Text>
                              </View>
                              
                              <View style={styles.fileActions}>
                                <TouchableOpacity
                                  style={[styles.fileActionBtn, { backgroundColor: colors.primarySurface }]}
                                  onPress={() => handleOpenPdf(file, item.title)}
                                >
                                  <Eye size={16} color={colors.primary} />
                                  <Text style={[styles.fileActionText, { color: colors.primary }]}>View</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[styles.fileActionBtn, { backgroundColor: colors.primarySurface }]}
                                  onPress={() => handleDownloadPdf(file)}
                                >
                                  <Download size={16} color={colors.primary} />
                                  <Text style={[styles.fileActionText, { color: colors.primary }]}>Get</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* In-app PDF Viewer Modal */}
      <PdfViewerModal
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        pdfUrl={activePdfUrl}
        title={activePdfTitle}
      />

      <BottomTabNavigator active="learning" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  filterSection: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  materialCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  materialInfo: {
    width: "100%",
  },
  subjectTag: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  materialDescription: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 18,
  },
  teacherText: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    marginBottom: 8,
  },
  filesSection: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  filesTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    gap: 8,
  },
  fileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    flex: 1,
  },
  fileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fileActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fileActionText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
