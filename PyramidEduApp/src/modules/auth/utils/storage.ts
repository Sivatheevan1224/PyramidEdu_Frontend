import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { MobileAuthSession } from '../types';
import { AUTH_SESSION_KEY } from '../constants';

function canUseWebStorage(): boolean {
  return Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

async function setWebStorage(value: string): Promise<void> {
  if (!canUseWebStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, value);
}

async function getWebStorage(): Promise<string | null> {
  if (!canUseWebStorage()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_SESSION_KEY);
}

async function removeWebStorage(): Promise<void> {
  if (!canUseWebStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function saveAuthSession(session: MobileAuthSession): Promise<void> {
  const serializedSession = JSON.stringify(session);

  if (Platform.OS === 'web') {
    await setWebStorage(serializedSession);
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, serializedSession);
}

export async function loadAuthSession(): Promise<MobileAuthSession | null> {
  const rawSession = Platform.OS === 'web'
    ? await getWebStorage()
    : await SecureStore.getItemAsync(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as MobileAuthSession;
  } catch {
    if (Platform.OS === 'web') {
      await removeWebStorage();
    } else {
      await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
    }
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  if (Platform.OS === 'web') {
    await removeWebStorage();
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}
