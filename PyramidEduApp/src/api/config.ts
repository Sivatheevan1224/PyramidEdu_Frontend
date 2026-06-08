export const MOBILE_API_BASE_URL =
  process.env.EXPO_PUBLIC_MOBILE_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  (globalThis.window?.location?.hostname
    ? `${globalThis.window.location.protocol}//${globalThis.window.location.hostname}:5000/api/v1/mobile`
    : 'http://localhost:5000/api/v1/mobile');
