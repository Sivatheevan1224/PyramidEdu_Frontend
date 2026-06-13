import { MOBILE_API_BASE_URL } from '../../../api/config';
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

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? (await response.json()) as ApiEnvelope<T> | T
    : (await response.text()) as unknown as T;

  if (!response.ok) {
    const envelope = payload as ApiEnvelope<T>;
    throw new Error(envelope?.message || `Request failed with status ${response.status}`);
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }

  return payload as T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${MOBILE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  return parseResponse<T>(response);
}

export async function loginStudent(payload: MobileLoginPayload): Promise<MobileAuthSession> {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    student: response.student,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

export async function refreshStudentTokens(payload: MobileRefreshPayload): Promise<MobileAuthTokens> {
  return request<MobileAuthTokens>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logoutStudent(payload: MobileLogoutPayload): Promise<void> {
  await request('/auth/logout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentStudent(accessToken: string): Promise<MobileStudentProfile> {
  const response = await request<MeResponse>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.student;
}
