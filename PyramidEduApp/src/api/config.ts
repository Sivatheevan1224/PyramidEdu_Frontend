import { Platform } from 'react-native';

const resolveHost = () => {
  // When running on the web, always use the current browser's hostname (e.g. localhost)
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  // Fallback to localhost
  return 'http://localhost:5000';
};

// On the web, prefer the dynamic browser host. On mobile, use the environment variable (or fallback).
export const MOBILE_API_BASE_URL = Platform.OS === 'web'
  ? `${resolveHost()}/api/v1/mobile`
  : process.env.EXPO_PUBLIC_MOBILE_API_URL || `${resolveHost()}/api/v1/mobile`;

/** Base URL for shared backend endpoints (e.g. /users/profile) */
export const BASE_API_URL = Platform.OS === 'web'
  ? `${resolveHost()}/api/v1`
  : process.env.EXPO_PUBLIC_MOBILE_API_URL?.replace('/mobile', '') || `${resolveHost()}/api/v1`;

