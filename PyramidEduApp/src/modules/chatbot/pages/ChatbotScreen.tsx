import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Trash2, X, Bot } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Message } from "../types/chat.types";
import {
  sendChatMessage,
  getChatSession,
  clearChatHistory,
  deleteChatMessage,
} from "../services/chat.api";

const starters = [
  "What are the key concepts in ADBMS?",
  "Show me study materials for Math",
  "Explain Newton's second law",
  "How do I improve my grades?",
];

const formatMessage = (text: string, primaryColor: string) => {
  if (!text) return null;
  // Split by both bold (**text**) and markdown links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={idx} style={{ fontWeight: "bold" }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <Text
            key={idx}
            style={{ color: primaryColor, textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(match[2])}
          >
            {match[1]}
          </Text>
        );
      }
    }
    return <Text key={idx}>{part}</Text>;
  });
};

export default function ChatbotScreen() {
  const { student } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useAppTheme();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  useEffect(() => {
    loadSession();
  }, []);

  const getWelcomeMessage = (): Message => ({
    id: "welcome",
    role: "assistant",
    content: `Hi ${student?.fullName || "there"}! I'm PyramidEdu AI. How can I help you with your studies today? 👋`,
    createdAt: new Date().toISOString(),
  });

  const loadSession = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getChatSession();
      if (res.success && res.data) {
        if (res.data.id) setConversationId(res.data.id);
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([getWelcomeMessage()]);
        }
      }
    } catch (err) {
      console.error("Failed to load chat session:", err);
      setMessages([getWelcomeMessage()]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadSession(true);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const res = await sendChatMessage(userMessage.content, conversationId);
      if (res.success && res.data) {
        if (!conversationId && res.data.conversationId) {
          setConversationId(res.data.conversationId);
        }
        
        const aiResponse: Message = {
          id: res.data.answerMessage?.id || (Date.now() + 1).toString(),
          content: res.data.answerMessage?.message || res.data.answer,
          role: "assistant",
          createdAt: res.data.answerMessage?.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error: any) {
      console.error("Chat API error:", error);
      const fallbackMsg: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I couldn't process that request. Please try again.",
        role: "assistant",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const confirmClearChat = () => {
    setShowClearConfirmModal(true);
  };

  const handleClearHistory = async () => {
    setShowClearConfirmModal(false);
    setClearing(true);
    try {
      await clearChatHistory(conversationId);
      setConversationId(undefined);
      setMessages([getWelcomeMessage()]);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      Alert.alert("Error", "Could not clear chat history. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteSingleMessage = async (msg: Message) => {
    setSelectedMessage(null);
    if (!msg.id || msg.id === "welcome") return;

    const messageId = msg.id;

    // Optimistically remove from state
    setMessages((prev) => prev.filter((m) => m.id !== messageId));

    try {
      await deleteChatMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      // If error occurs, reload current session
      loadSession();
    }
  };

  const hasRealMessages = messages.some((m) => m.id !== "welcome");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      {/* Chat Sub-header with Title & Clear History Button */}
      <View style={[styles.subHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.subHeaderLeft}>
          <View style={[styles.botIconWrapper, { backgroundColor: colors.primarySurface }]}>
            <Bot size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.subHeaderTitle, { color: colors.textPrimary }]}>AI Study Assistant</Text>
            <Text style={[styles.subHeaderSubtitle, { color: colors.textTertiary }]}>
              {loading ? "Thinking..." : "Always available"}
            </Text>
          </View>
        </View>

        {hasRealMessages && (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            onPress={confirmClearChat}
            disabled={clearing}
          >
            {clearing ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <>
                <Trash2 size={15} color={colors.error} />
                <Text style={[styles.clearButtonText, { color: colors.error }]}>Clear History</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 50}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.role === "user" && styles.userMessageRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.role === "assistant" 
                    ? [styles.aiMessage, { backgroundColor: colors.surfaceAlt }] 
                    : [styles.userMessage, { backgroundColor: colors.primary }],
                ]}
              >
                <Text style={[
                  styles.messageText, 
                  { color: colors.textPrimary },
                  msg.role === "user" && { color: colors.surface }
                ]}>
                  {formatMessage(msg.content, msg.role === "user" ? colors.surface : colors.primary)}
                </Text>

                <View style={styles.bubbleFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      msg.role === "assistant"
                        ? { color: colors.textTertiary }
                        : { color: colors.primarySurface },
                    ]}
                  >
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </Text>

                  {/* Message Delete Icon for individual unwanted items */}
                  {msg.id !== "welcome" && (
                    <TouchableOpacity
                      style={styles.deleteMsgBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={() => setSelectedMessage(msg)}
                    >
                      <Trash2
                        size={13}
                        color={msg.role === "user" ? colors.primarySurface : colors.textTertiary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.messageRow}>
              <View style={[styles.messageBubble, styles.aiMessage, { backgroundColor: colors.surfaceAlt, flexDirection: "row", gap: 8 }]}>
                <ActivityIndicator color={colors.primary} size="small" />
                <Text style={[styles.messageText, { color: colors.textPrimary }]}>Thinking...</Text>
              </View>
            </View>
          )}

          {messages.length < 3 && !loading && (
            <View style={styles.startersContainer}>
              {starters.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.starterChip, { borderColor: colors.border, backgroundColor: colors.background }]}
                  onPress={() => handleSend(s)}
                >
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary }]}
              placeholder="Ask anything about your courses..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primarySurface }]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || loading}
            >
              <Send
                size={20}
                color={inputText.trim() ? colors.primary : colors.textTertiary}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Confirmation Modal: Clear Entire History */}
      <Modal
        visible={showClearConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={24} color={colors.error} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Clear Entire Chat History?</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              All conversations and previous responses in this session will be permanently cleared.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowClearConfirmModal(false)}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteBtn, { backgroundColor: colors.error }]}
                onPress={handleClearHistory}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal: Delete Single Message */}
      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={22} color={colors.error} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Delete This Message?</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]} numberOfLines={2}>
              "{selectedMessage?.content}"
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setSelectedMessage(null)}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteBtn, { backgroundColor: colors.error }]}
                onPress={() => selectedMessage && handleDeleteSingleMessage(selectedMessage)}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabNavigator active="chat" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  subHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  botIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  subHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  subHeaderSubtitle: {
    fontSize: 11,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  keyboardView: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "84%",
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  aiMessage: {
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  messageTime: {
    fontSize: 10,
  },
  deleteMsgBtn: {
    padding: 3,
    opacity: 0.8,
  },
  startersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  starterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalDeleteBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
