# 🖥️ PyramidEdu Web Application

> **Next.js 16 Web Portal for PyramidEdu**  
> Modern, highly responsive institute management portal featuring role-based dashboards, financial analytics, interactive charts, salary payroll, and QR attendance.

![Status: Under Development](https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge&logo=git)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

---

## 📑 Table of Contents
- [📌 Overview](#-overview)
- [🚧 Current Status](#-current-status)
- [✨ Key Features & Modules](#-key-features--modules)
- [👥 Role-Based Portals](#-role-based-portals)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Folder Structure](#-folder-structure)
- [🔐 Authentication Flow](#-authentication-flow)
- [⚙️ Environment Setup](#️-environment-setup)
- [🚀 Running the Web Application](#-running-the-web-application)
- [📜 License](#-license)

---

## 📌 Overview

**PyramidEduWeb** is the web-based administrative and management hub for the PyramidEdu institute management system. Built with Next.js App Router and Turbopack, it provides real-time financial tracking, fee collection overview, employee salary management, marks entry, QR code session scanning, and automated reporting.

---

## 🚧 Current Status

> [!NOTE]
> The web application is **actively under development**. The documentation below covers **currently implemented features, pages, and interactive analytics dashboard components**.

---

## ✨ Key Features & Modules

- 📈 **Payment & Revenue Analytics**: Interactive Recharts area, bar, line, and pie charts displaying monthly revenue trends, daily collections, status distribution, and revenue by subject/batch.
- 💼 **Salary Payroll Management**: Employee salary tracking, allowance/deduction distribution, disbursement progress, and role-based payroll breakdowns.
- 🎯 **Dynamic Graph Hiding**: Automatic detection and conditional rendering to hide empty/zero-value graphs to maintain a clean dashboard.
- 🖨️ **QR Code Attendance Verification**: Dynamic QR code generation for teachers and web camera scanning for instant student attendance logging.
- 📝 **Teacher Marks & Grading**: Multi-subject marks entry with automatic percentile calculation, grade boundaries, and result publishing.
- 📋 **Fee Overview & Student Summaries**: Complete fee status tracking (Generated vs. Collected vs. Outstanding) with detailed student payment history modals.

---

## 👥 Role-Based Portals

### 🔑 1. Administrator Portal (`/admin`)
- **Payment Analytics**: `/admin/payments` (Financial graphs, transaction tables, fee progress)
- **Salary Management**: Real-time payroll breakdown and role-based expenditure summaries.

### 🏢 2. Manager Portal (`/manager`)
- **Analytics & Staff Reports**: `/manager/analytics-reports` (Institute performance overview and academic reports)

### 👨‍🏫 3. Teacher Portal (`/teacher`)
- **Marks Entry**: `/teacher/marks` (Subject selection, score entry, grade assignment)
- **Attendance**: `/teacher/attendance` & `/teacher/qr-attendance` (Session check-in & QR scanner)

### 🎓 4. Student & Public Portals
- **Landing Page**: `/` (Platform overview and sign-in redirect)
- **Authentication**: `/login`, `/register`, `/forgot-password`, `/change-password`

---

## 🛠️ Technology Stack

| Library / Tool | Purpose |
| :--- | :--- |
| **Next.js 16.2.6** | App Router framework with Turbopack bundler |
| **React 19.2.4** | UI component architecture |
| **Tailwind CSS v4** | Utility-first responsive styling system |
| **Recharts 3.8.1** | Data visualization for financial and payroll charts |
| **Zustand 5.0** | Client state management |
| **TanStack React Query** | Asynchronous data fetching & caching |
| **Axios 1.16** | HTTP request management with token interceptors |
| **Lucide React** | Modern UI icon set |
| **Sonner** | Rich toast notifications |

---

## 📂 Folder Structure

```
PyramidEduWeb/
├── src/
│   ├── app/                       # App Router Page Routes
│   │   ├── admin/                 # Admin payments & salary portal
│   │   ├── change-password/       # Password reset screen
│   │   ├── forgot-password/       # Password recovery screen
│   │   ├── login/                 # LoginPageClient & entry
│   │   ├── manager/               # Manager reports portal
│   │   ├── register/              # Student registration wizard
│   │   ├── teacher/               # Teacher marks & attendance portal
│   │   ├── globals.css            # Tailwind CSS v4 directives
│   │   └── layout.tsx             # Root layout & providers
│   ├── components/                # Reusable UI components & modals
│   ├── context/                   # AuthContext for session management
│   ├── lib/                       # Axios API configuration & auth-session helpers
│   ├── modules/                   # Feature modules
│   │   ├── payments/              # PaymentAnalyticsSection, tables, modals
│   │   ├── salary/                # SalaryAnalyticsSection & payroll hooks
│   │   ├── Teacher/               # Marks entry & grading components
│   │   └── Student/               # Registration wizard components
│   └── providers/                 # QueryProvider setup
├── public/                        # Static assets & backgrounds
├── next.config.ts                 # Next.js configuration & backend rewrites
├── package.json                   # Web application dependencies
└── tsconfig.json                  # TypeScript config
```

---

## 🔐 Authentication Flow

1. User submits credentials via `/login`.
2. Access token is stored in-memory (`lib/api.ts`) while refresh token is persisted in HTTP-only cookies/storage.
3. Protected routes automatically redirect unauthenticated users to `/login`.
4. Role-based navigation maps:
   - `ADMIN` ➔ `/admin`
   - `MANAGER` ➔ `/manager`
   - `TEACHER` ➔ `/teacher`
   - `STUDENT` ➔ `/student`

---

## ⚙️ Environment Setup

Create a `.env.local` file in the `PyramidEduWeb` root:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
BACKEND_URL="http://127.0.0.1:5000"
```

---

## 🚀 Running the Web Application

### Development Mode
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 📜 License
This project is proprietary software developed for the PyramidEdu platform. All rights reserved.
