import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Sparkles } from "lucide-react-native";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { Colors } from "../../src/constants/colors";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm PyramidEdu AI. How can I help you with your studies today? 👋",
      sender: "ai",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "I need help with Physics concepts",
      sender: "user",
      timestamp: "10:31 AM",
    },
    {
      id: "3",
      text: "Great! I can help with Physics. Your attendance in this subject is 68%, which is below the standard. Would you like me to recommend some concept videos or explain specific topics?",
      sender: "ai",
      timestamp: "10:32 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (messages.length + 2).toString(),
          text: "That's a great question! Let me help you understand this better. Would you like me to create a study plan?",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 800);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={56}
      >
        <ScrollView
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
                  msg.sender === "ai" ? styles.aiMessage : styles.userMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text
                  style={[
                    styles.messageTime,
                    msg.sender === "ai"
                      ? styles.aiMessageTime
                      : styles.userMessageTime,
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor={Colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send
                size={20}
                color={inputText.trim() ? Colors.primary : Colors.textTertiary}
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
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 100,
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
    backgroundColor: Colors.secondaryLight,
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.textInverse,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  aiMessageTime: {
    color: Colors.textTertiary,
  },
  userMessageTime: {
    color: Colors.textInverse,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.secondaryLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
});
