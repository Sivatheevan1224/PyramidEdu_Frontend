import client from '../../../api/client';
import type {
  MobileAuthSession,
  MobileAuthTokens,
  MobileLoginPayload,
  MobileLogoutPayload,
  MobileRefreshPayload,
  MobileStudentProfile,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '../types';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type LoginResponse = {
  student: MobileStudentProfile;
  accessToken: string;
  refreshToken: string;
};

type MeResponse = {
  student: MobileStudentProfile;
};

export async function loginStudent(payload: MobileLoginPayload): Promise<MobileAuthSession> {
  const response = await client.post<ApiEnvelope<LoginResponse>>('/auth/login', payload);
  const data = response.data.data;
  if (!response.data.success || !data) {
    throw new Error(response.data.message || 'Login failed.');
  }

  const student = data.student || (data as any).user;
  if (student) {
    student.forcePasswordChange = student.forcePwdChange || student.forcePasswordChange || false;
  }

  return {
    student,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function refreshStudentTokens(payload: MobileRefreshPayload): Promise<MobileAuthTokens> {
  const response = await client.post<ApiEnvelope<MobileAuthTokens>>('/auth/refresh', payload);
  const data = response.data.data;
  if (!response.data.success || !data) {
    throw new Error(response.data.message || 'Token refresh failed.');
  }
  return data;
}

export async function logoutStudent(payload: MobileLogoutPayload): Promise<void> {
  const response = await client.post<ApiEnvelope<void>>('/auth/logout', payload);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Logout failed.');
  }
}

export async function fetchCurrentStudent(accessToken: string): Promise<MobileStudentProfile> {
  const response = await client.get<ApiEnvelope<MeResponse>>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = response.data.data;
  if (!response.data.success || !data) {
    throw new Error(response.data.message || 'Fetch profile failed.');
  }
  const student = data.student || (data as any).user;
  if (student) {
    student.forcePasswordChange = student.forcePwdChange || student.forcePasswordChange || false;
  }
  return student;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string; verificationToken: string; devOtp?: string }> {
  const response = await client.post<ApiEnvelope<{ message: string; verificationToken: string; devOtp?: string }>>('/auth/forgot-password', payload);
  const data = response.data.data;
  if (!response.data.success || !data) {
    throw new Error(response.data.message || 'Forgot password request failed.');
  }
  return data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<{ message: string; resetToken: string }> {
  const response = await client.post<ApiEnvelope<{ message: string; resetToken: string }>>('/auth/verify-otp', payload);
  const data = response.data.data;
  if (!response.data.success || !data) {
    throw new Error(response.data.message || 'OTP verification failed.');
  }
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<string> {
  const response = await client.post<ApiEnvelope<void>>('/auth/reset-password', payload);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Password reset failed.');
  }
  return response.data.message || 'Password reset successful.';
}

