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
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";

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
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <TopBar />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Search size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search study materials..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Subject Selector */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, selectedSubject === "ALL" && styles.activeChip]}
            onPress={() => setSelectedSubject("ALL")}
          >
            <Text style={[styles.chipText, selectedSubject === "ALL" && styles.activeChipText]}>
              All Subjects
            </Text>
          </TouchableOpacity>
          {subjects.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[styles.filterChip, selectedSubject === sub && styles.activeChip]}
              onPress={() => setSelectedSubject(sub)}
            >
              <Text style={[styles.chipText, selectedSubject === sub && styles.activeChipText]}>
                {sub}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredMaterials.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={48} color={Colors.textTertiary} strokeWidth={1} />
              <Text style={styles.emptyText}>No materials found</Text>
            </View>
          ) : (
            filteredMaterials.map((item) => {
              const fileCount = item.fileUrls ? item.fileUrls.length : 0;
              return (
                <View key={item.id} style={styles.materialCard}>
                  <View style={styles.materialInfo}>
                    <Text style={styles.subjectTag}>{item.subject?.subjectName || "General"}</Text>
                    <Text style={styles.materialTitle}>{item.title}</Text>
                    <Text style={styles.teacherText}>
                      By: {item.teacher?.user?.fullName || "Instructor"}
                    </Text>
                    {item.text ? (
                      <Text style={styles.materialDescription}>{item.text}</Text>
                    ) : null}
                    <Text style={styles.dateText}>
                      Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                    </Text>

                    {/* Files List inside the card */}
                    {fileCount > 0 && (
                      <View style={styles.filesSection}>
                        <Text style={styles.filesTitle}>Attached PDFs ({fileCount}):</Text>
                        {item.fileUrls.map((file, idx) => {
                          const fileName = file.split("/").pop() || `Document_${idx + 1}.pdf`;
                          return (
                            <View key={idx} style={styles.fileRow}>
                              <View style={styles.fileNameContainer}>
                                <FileText size={16} color={Colors.primary} />
                                <Text style={styles.fileName} numberOfLines={1}>
                                  {fileName}
                                </Text>
                              </View>
                              
                              <View style={styles.fileActions}>
                                <TouchableOpacity
                                  style={styles.fileActionBtn}
                                  onPress={() => handleOpenPdf(file, item.title)}
                                >
                                  <Eye size={16} color={Colors.primary} />
                                  <Text style={styles.fileActionText}>View</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.fileActionBtn}
                                  onPress={() => handleDownloadPdf(file)}
                                >
                                  <Download size={16} color={Colors.primary} />
                                  <Text style={styles.fileActionText}>Get</Text>
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
    backgroundColor: Colors.background,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeChip: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: Colors.primary,
    fontWeight: "700",
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
    color: Colors.textTertiary,
  },
  materialCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  materialInfo: {
    width: "100%",
  },
  subjectTag: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  materialDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 18,
  },
  teacherText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  filesSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  filesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
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
    backgroundColor: Colors.primarySurface,
  },
  fileActionText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
});
