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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatbotScreen() {
  const { student } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useAppTheme();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi ${student?.fullName || "there"}! I'm PyramidEdu AI. How can I help you with your studies today? 👋`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      // Format messages history for Gemini API (user / model)
      const contents = [...messages, userMessage].map((msg) => ({
        role: msg.sender === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      // Add actual student context in system instruction
      const studentName = student?.fullName || "Student";
      const attendance = student?.student?.attendancePercentage !== undefined ? `${student.student.attendancePercentage}%` : "unknown";
      const performance = student?.student?.performanceStatus || "GOOD";
      const rewardPoints = student?.student?.rewardPoints || 0;

      const systemInstruction = {
        parts: [
          {
            text: `You are PyramidEdu AI, a friendly and smart educational chatbot for students.
            The current logged-in student's information:
            - Name: ${studentName}
            - Attendance Percentage: ${attendance}
            - Performance Level: ${performance}
            - Reward Points: ${rewardPoints}

            Respond to their queries constructively, help them draft revision plans, answer subjects questions, and give tips to improve their academic performance. Keep responses clear and structured using markdown where necessary.`,
          },
        ],
      };

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status}`);
      }

      const json = await response.json();
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error("Received empty response from Gemini.");
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Gemini chatbot error:", error);
      // Fallback response
      const fallbackMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: "I had trouble connecting to the AI helper. For demo purposes, I can tell you that your current attendance is " +
          (student?.student?.attendancePercentage || "87") +
          "%. Please review study guides to stay on track!",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
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
                msg.sender === "user" && styles.userMessageRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === "ai" 
                    ? [styles.aiMessage, { backgroundColor: colors.surfaceAlt }] 
                    : [styles.userMessage, { backgroundColor: colors.primary }],
                ]}
              >
                <Text style={[
                  styles.messageText, 
                  { color: colors.textPrimary },
                  msg.sender === "user" && { color: colors.surface }
                ]}>
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    msg.sender === "ai"
                      ? { color: colors.textTertiary }
                      : { color: colors.primarySurface },
                  ]}
                >
                  {msg.timestamp}
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
              onPress={handleSend}
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
