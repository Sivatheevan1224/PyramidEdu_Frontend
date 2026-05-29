import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api/v1';

const normalizeApiBaseUrl = (value?: string | null) => {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  const trimmed = value.replace(/\/+$/, '');

  if (trimmed.endsWith('/api')) {
    return `${trimmed}/v1`;
  }

  if (trimmed.endsWith('/api/v1')) {
    return trimmed;
  }

  return trimmed;
};

// In-memory access token storage
let inMemoryAccessToken: string | null = null;
type TokenUpdateCallback = (token: string | null) => void;
let tokenUpdateListener: TokenUpdateCallback | null = null;

export const getAccessToken = () => inMemoryAccessToken;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
  if (tokenUpdateListener) {
    tokenUpdateListener(token);
  }
};

export const onTokenUpdate = (callback: TokenUpdateCallback) => {
  tokenUpdateListener = callback;
};

// Create Axios Instance
export const api = axios.create({
  baseURL: normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL),
  withCredentials: true, // Send httpOnly cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiBaseUrl = () => normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If request failed with 401 and it's not a retry, login, or refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, wait for it
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            throw err;
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request a new access token
        const response = await api.post('/auth/refresh');
        const newAccessToken = response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('Refresh token response missing access token');
        }

        setAccessToken(newAccessToken);
        isRefreshing = false;

        processQueue(null, newAccessToken);

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        setAccessToken(null);

        // Redirect to login page on browser side
        if (globalThis.window) {
          // Clear current path to avoid loops and redirect
          globalThis.window.location.href = '/login?expired=true';
        }
        throw refreshError;
      }
    }

    throw error;
  }
);

export default api;
