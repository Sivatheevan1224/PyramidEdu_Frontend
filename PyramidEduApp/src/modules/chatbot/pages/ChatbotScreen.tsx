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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Message } from "../types/chat.types";
import { sendChatMessage, getChatSession } from "../services/chat.api";

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

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const res = await getChatSession();
      if (res.success && res.data) {
        if (res.data.id) setConversationId(res.data.id);
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `Hi ${student?.fullName || "there"}! I'm PyramidEdu AI. How can I help you with your studies today? 👋`,
              createdAt: new Date().toISOString(),
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to load chat session:", err);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi ${student?.fullName || "there"}! I'm PyramidEdu AI. How can I help you with your studies today? 👋`,
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 50}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
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

      <BottomTabNavigator active="chat" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  messageTime: {
    fontSize: 11,
    marginTop: 4,
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
});
