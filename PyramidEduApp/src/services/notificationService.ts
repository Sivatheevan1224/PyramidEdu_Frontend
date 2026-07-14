import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import client from "../api/client";
import Toast from "react-native-toast-message";

// Set notification handler for when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request Permission on Login
export async function requestNotificationPermission() {
  if (Platform.OS === "web") return;
  
  // Skip remote push token acquisition in Expo Go since remote notifications are disabled in Expo Go SDK 53+
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (isExpoGo) {
    console.log("Running in Expo Go: Remote push notifications are disabled in Expo Go on SDK 53+.");
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus === "granted") {
      console.log("Notification permissions granted.");
      // Generate and save token
      await syncFCMTokenWithBackend();
    }
  } catch (error) {
    console.error("Permission request error:", error);
  }
}

// Generate Expo Push Token and send to backend
export async function syncFCMTokenWithBackend() {
  if (Platform.OS === "web") return;
  
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (isExpoGo) {
    return;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn("EAS Project ID not found. Skipping Expo push token acquisition.");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    if (token) {
      console.log("Expo Push Token:", token);
      await client.post("/notifications/register-token", {
        fcmToken: token,
        platform: Platform.OS,
      });
    }
  } catch (error) {
    console.error("Expo Push Token sync error:", error);
  }
}

// Set up listeners for notifications
export function setupFCMListeners(router: any) {
  if (Platform.OS === "web") return () => {};

  // 1. Foreground Message Handler
  const notificationSubscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification received in foreground:", notification);
    const { title, body } = notification.request.content;
    const data = notification.request.content.data;
    
    // Display local alert/toast for foreground message
    Toast.show({
      type: 'appInfo',
      text1: title || "Notification",
      text2: body || "",
      onPress: () => {
        handleNotificationNavigation(data, router);
        Toast.hide();
      }
    });
  });

  // 2. Notification Opened App from Background/Closed state
  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification response received:", response);
    const data = response.notification.request.content.data;
    handleNotificationNavigation(data, router);
  });

  return () => {
    notificationSubscription.remove();
    responseSubscription.remove();
  };
}

// Navigation Handler for Push Notifications
export function handleNotificationNavigation(data: any, router: any) {
  if (!data) return;

  console.log("Navigating to notification route:", data);

  // If the backend provided a direct route, use it
  if (data.route) {
    try {
      router.push(data.route);
      return;
    } catch (err) {
      console.warn("Direct route push failed, falling back to type-based navigation", err);
    }
  }

  // Fallback to type-based navigation
  switch (data.type) {
    case "EXAM_PUBLISHED":
    case "EXAM_REMINDER":
    case "EXAM":
      if (data.examId) {
        router.push({
          pathname: "/exams/[id]",
          params: { id: data.examId },
        });
      } else {
        router.push("/exams");
      }
      break;

    case "MATERIAL_UPLOADED":
    case "MATERIAL":
      router.push("/materials");
      break;

    case "RESULT_PUBLISHED":
    case "RESULT":
      router.push("/performance");
      break;

    case "FEE_REMINDER":
    case "FEE_OVERDUE":
    case "FEE":
      router.push("/fees");
      break;

    case "ANNOUNCEMENT":
      router.push("/announcements");
      break;

    case "ATTENDANCE_WARNING":
      router.push("/attendance");
      break;

    case "PROGRESS_REPORT":
    case "AI_ALERT":
      router.push("/academic");
      break;

    case "ACCOUNT_ALERT":
      // Maybe log out or go to dashboard
      router.push("/dashboard");
      break;

    default:
      router.push("/dashboard");
      break;
  }
}

// Helper to trigger a local test notification instantly
export async function triggerLocalTestNotification() {
  if (Platform.OS === "web") {
    alert("Local notifications are not supported on web in this test mode.");
    return;
  }
  
  // Explicitly check/request permissions for notifications first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== "granted") {
    alert("Permission to show notifications was denied! Please enable notifications in your phone settings.");
    return;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Exam Notification 📝",
      body: "You have a new exam scheduled. Tap here to view details.",
      data: { type: "EXAM", examId: "test-exam-123" },
    },
    trigger: null, // deliver immediately
  });
}
