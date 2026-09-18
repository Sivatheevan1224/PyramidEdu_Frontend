# 📱 PyramidEdu Mobile Application

> **Expo & React Native Mobile App for Students**  
> Cross-platform mobile learning portal providing instant access to online exams, study notes, AI tutor chatbot, attendance tracking, and live notifications.

![Status: Under Development](https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge&logo=git)
![Expo](https://img.shields.io/badge/Expo_SDK-54.0-000000?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)

---

## 📑 Table of Contents
- [📌 Overview](#-overview)
- [🚧 Current Status](#-current-status)
- [✨ Key Features & Modules](#-key-features--modules)
- [📱 Screen Breakdown & Navigation](#-screen-breakdown--navigation)
- [🎨 Bottom Navigation Bar](#-bottom-navigation-bar)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Folder Structure](#-folder-structure)
- [⚙️ Environment Setup](#️-environment-setup)
- [🚀 Running the Mobile Application](#-running-the-mobile-application)
- [📜 License](#-license)

---

## 📌 Overview

**PyramidEduApp** is the mobile client for the PyramidEdu platform built with React Native and Expo SDK 54. It empowers students with quick access to course notes, interactive online exams, fee history, performance metrics, and an AI-powered tutoring chatbot.

---

## 🚧 Current Status

> [!NOTE]
> The mobile application is **actively under development**. All screens and features listed below represent **currently implemented and verified mobile components**.

---

## ✨ Key Features & Modules

- 📲 **Interactive Bottom Tab Navigation**: Tailored bottom tab bar with dynamic dark/light theme styling, high-contrast active icons, and live notification badges.
- 📝 **Online Exams & Quiz Submission**: View available tests, take timed exams, and receive instant score evaluations.
- 📚 **Study Notes & Materials Portal**: Browse and download course PDF materials, subject notes, and revision documents.
- 🤖 **AI Tutor Chatbot**: Instant student Q&A assistant powered by Google Gemini AI and institute study notes.
- 📊 **Student Performance & Recommendations**: Visual score trends, subject performance graphs, and personalized study recommendations.
- 🏷️ **Live Notification Badges**: Real-time unread count badges on bottom navigation tabs for announcements, pending exams, and new materials.
- 🌓 **Dynamic Theme System**: Seamless instant switching between Light Mode and Dark Mode with persistent theme storage.

---

## 📱 Screen Breakdown & Navigation

```
app/
├── (welcome)/             # Onboarding & splash flow
├── login/                 # Student authentication screen
├── forgot-password/       # Password recovery screen
├── dashboard/             # Main student home dashboard
├── exams/                 # Available & completed exams screen
├── materials/             # Study notes & revision documents
├── chatbot/               # AI Tutor interactive chat
├── attendance/            # Attendance check-in & history
├── attendance-history/    # Detailed attendance logs
├── fees/                  # Student fee payments & outstanding balance
├── performance/           # Score charts & rank metrics
├── practice-mcq/          # MCQ practice test generator
├── profile/               # Student profile & settings
├── recommendations/       # Personal study tips
├── show-marks/            # Subject marks lookup
└── timetable/             # Weekly class schedule
```

---

## 🎨 Bottom Navigation Bar

The bottom navigation bar ([BottomTabNavigator.tsx](file:///d:/Project%20II/PyramidEdu/PyramidEdu_Frontend/PyramidEduApp/src/components/BottomTabNavigator.tsx)) provides quick access to core student features with high-contrast active indicators and live notification badges:

| Tab | Route | Badge Functionality |
| :--- | :--- | :--- |
| **Home** | `/dashboard` | Live count of unread announcements |
| **Exams** | `/exams` | Live count of unsubmitted pending exams |
| **Notes** | `/materials` | Live count of new study materials |
| **AI Chat** | `/chatbot` | AI tutor readiness indicator |

---

## 🛠️ Technology Stack

| Library / Tool | Purpose |
| :--- | :--- |
| **Expo SDK 54.0** | Cross-platform React Native development framework |
| **React Native 0.81.5** | Core native UI component runtime |
| **Expo Router v6** | File-based navigation system |
| **Lucide React Native** | Vector icon set with explicit stroke coloring |
| **Expo SecureStore & AsyncStorage** | Token & theme persistence |
| **React Native Chart Kit** | Mobile performance charts |
| **Firebase Messaging** | Push notifications |

---

## 📂 Folder Structure

```
PyramidEduApp/
├── app/                           # Expo Router file-based screens
├── src/
│   ├── api/                       # API config & base URLs
│   ├── components/                # BottomTabNavigator, TopBar, SecondaryTopBar
│   ├── constants/                 # Layout & app constants
│   ├── context/                   # Global context providers
│   ├── hooks/                     # Custom hooks (useAppTheme, useAuth)
│   ├── modules/                   # Mobile feature modules
│   │   ├── attendance-history/    # Attendance tracking screen
│   │   ├── auth/                  # Login & authentication state
│   │   ├── chatbot/               # AI Tutor screen & service
│   │   ├── dashboard/             # Student home screen
│   │   ├── exams/                 # Exam list & quiz player
│   │   ├── fees/                  # Fee breakdown & payment gateway
│   │   ├── materials/             # Study materials screen
│   │   ├── performance/           # Performance charts
│   │   ├── practice-mcq/          # Interactive MCQ player
│   │   ├── profile/               # Student profile screen
│   │   └── recommendations/       # AI recommendations
│   ├── services/                  # Notification & background services
│   ├── store/                     # ThemeStore & global state
│   ├── theme/                     # ThemeProvider, colors, light/dark definitions
│   └── utils/                     # Formatting & helper utilities
├── package.json                   # Mobile application dependencies
└── tsconfig.json                  # TypeScript compiler settings
```

---

## ⚙️ Environment Setup

Create a `.env` file in the `PyramidEduApp` root directory:
```env
EXPO_PUBLIC_MOBILE_API_URL="http://192.168.1.100:5000/api/v1/mobile"
EXPO_PUBLIC_WEB_APP_URL="http://192.168.1.100:3000"
EXPO_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"
```
*(Replace `192.168.1.100` with your local development machine IP address when testing on physical mobile devices).*

---

## 🚀 Running the Mobile Application

### Start Development Server
```bash
npm install
npm start
```

### Execution Options
- **Web Browser Mode**: Press `w` in terminal or run `npm run web`.
- **Android Emulator**: Press `a` in terminal or run `npm run android`.
- **iOS Simulator** *(macOS only)*: Press `i` in terminal or run `npm run ios`.
- **Physical Device**: Scan the printed QR code using the **Expo Go** app on Android or iOS.

---

## 📜 License
This project is proprietary software developed for the PyramidEdu platform. All rights reserved.
