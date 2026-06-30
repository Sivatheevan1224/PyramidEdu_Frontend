import client from '../../../api/client';
import type {
  MobileAuthSession,
  MobileAuthTokens,
  MobileLoginPayload,
  MobileLogoutPayload,
  MobileRefreshPayload,
  MobileStudentProfile,
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
