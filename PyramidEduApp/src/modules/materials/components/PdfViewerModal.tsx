import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { X } from "lucide-react-native";
import { Colors } from "../../../constants/colors";

interface PdfViewerModalProps {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export default function PdfViewerModal({
  visible,
  onClose,
  pdfUrl,
  title,
}: PdfViewerModalProps) {
  if (!pdfUrl) return null;

  // On Android, google docs viewer is needed to render PDFs inline in a WebView
  const formattedUrl =
    Platform.OS === "android"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`
      : pdfUrl;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* WebView PDF Render */}
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: formattedUrl }}
            style={styles.webview}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading PDF Viewer...</Text>
              </View>
            )}
            renderError={(errorName, errorCode, errorDesc) => (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load PDF</Text>
                <Text style={styles.errorDesc}>{errorDesc || "Please check your network connection."}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.danger,
  },
  errorDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
