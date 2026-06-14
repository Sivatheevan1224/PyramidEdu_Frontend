const resolveHost = () => {
  if (globalThis.window?.location?.hostname) {
    return `${globalThis.window.location.protocol}//${globalThis.window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const MOBILE_API_BASE_URL =
  process.env.EXPO_PUBLIC_MOBILE_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  `${resolveHost()}/api/v1/mobile`;

/** Base URL for shared backend endpoints (e.g. /users/profile) */
export const BASE_API_URL =
  process.env.EXPO_PUBLIC_MOBILE_API_URL?.replace('/mobile', '') ||
  `${resolveHost()}/api/v1`;
