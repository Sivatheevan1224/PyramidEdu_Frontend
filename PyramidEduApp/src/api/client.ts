import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { MOBILE_API_BASE_URL } from './config';
import {
  getAccessToken,
  getRefreshToken,
  updateTokens,
  forceLogoutLocal,
} from '../modules/auth/store/authStore';
import { showSuccess, showError } from '../services/notification.service';

// Create a main axios instance for all api requests
const client = axios.create({
  baseURL: MOBILE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate clean instance for token refresh to avoid interceptor recursion
const refreshClient = axios.create({
  baseURL: MOBILE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Request Interceptor: Attach bearer token dynamically
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401, refresh token and retry requests
client.interceptors.response.use(
  (response) => {
    // Automatically show success toast for successful state-changing operations
    if (
      response.data &&
      response.data.success &&
      ['post', 'put', 'patch', 'delete'].includes(response.config.method?.toLowerCase() || '')
    ) {
      const successMessage = response.data.message;
      if (successMessage) {
        showSuccess(successMessage);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest?.url || '';

    // If unauthorized, not retried yet, and not a public auth endpoint, try to refresh token
    const isAuthEndpoint =
      url.includes('refresh') ||
      url.includes('login') ||
      url.includes('register') ||
      url.includes('forgot-password') ||
      url.includes('verify-otp') ||
      url.includes('reset-password');

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(client(originalRequest));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        await forceLogoutLocal();
        const noTokenError = new Error('No refresh token available.');
        showError(noTokenError.message);
        return Promise.reject(noTokenError);
      }

      try {
        const response = await refreshClient.post('/auth/refresh', { refreshToken });
        const data = response.data?.data;
        const newAccessToken = data?.accessToken;
        const newRefreshToken = data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Refresh response did not contain new tokens.');
        }

        await updateTokens(newAccessToken, newRefreshToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        await forceLogoutLocal();
        showError('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }

    // Format and throw user-friendly error messages
    let userFriendlyError = error;

    if (axios.isAxiosError(error)) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.response) {
        const data = error.response.data;
        if (data && typeof data === 'object') {
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            errorMessage = data.errors.map((e: any) => e.message).join('\n');
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message;
      }

      userFriendlyError = new Error(errorMessage);
      (userFriendlyError as any).response = error.response;
      (userFriendlyError as any).status = error.response?.status;
    }

    // Automatically display error toast
    showError(userFriendlyError.message);

    return Promise.reject(userFriendlyError);
  }
);

export default client;
export { refreshClient };
