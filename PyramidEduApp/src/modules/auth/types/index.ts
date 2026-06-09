export interface MobileStudentProfile {
  id: number;
  email: string;
  role: 'STUDENT';
  isActive: boolean;
  forcePasswordChange: boolean;
  createdAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    indexNumber: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
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
