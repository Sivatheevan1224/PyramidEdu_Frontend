export interface MobileStudentProfile {
  id: string | number;
  email: string;
  role: 'STUDENT';
  fullName?: string;
  phone?: string | null;
  profileImage?: string | null;
  isActive: boolean;
  forcePasswordChange: boolean;
  forcePwdChange?: boolean;
  createdAt: string;
  student: {
    id: string | number;
    firstName?: string;
    lastName?: string;
    indexNumber: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    gender?: string | null;
    school?: string | null;
    batch?: string | null;
    nic?: string | null;
    rewardPoints?: number;
    attendancePercentage?: number;
    performanceStatus?: string | null;
    trendStatus?: string | null;
    approvalStatus?: string;
    paymentStatus?: string;
    totalFeeAmount?: number;
    parent?: {
      id: string;
      parentName: string;
      relation?: string | null;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      occupation?: string | null;
    } | null;
    parentEmail?: string | null;
  };
}

export interface MobileAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface MobileAuthSession extends MobileAuthTokens {
  student: MobileStudentProfile;
}

export interface MobileLoginPayload {
  email: string;
  password: string;
}

export interface MobileRefreshPayload {
  refreshToken: string;
}

export interface MobileLogoutPayload {
  refreshToken: string;
  logoutAll?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  verificationToken: string;
}


