import { useSyncExternalStore } from 'react';
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from '../utils/storage';
import {
  loginStudent as apiLoginStudent,
  logoutStudent as apiLogoutStudent,
  refreshStudentTokens as apiRefreshStudentTokens,
  fetchCurrentStudent as apiFetchCurrentStudent,
} from '../services/api';
import type {
  MobileAuthSession,
  MobileLoginPayload,
  MobileStudentProfile,
} from '../types';

export type AuthState = {
  isHydrating: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  student: MobileStudentProfile | null;
  error: string | null;
};

const initialState: AuthState = {
  isHydrating: true,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  student: null,
  error: null,
};

let state: AuthState = initialState;
const listeners = new Set<() => void>();
let hydratePromise: Promise<void> | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<AuthState>) {
  state = { ...state, ...nextState };
  emitChange();
}

function getSnapshot(): AuthState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function persistSession(session: MobileAuthSession): Promise<void> {
  await saveAuthSession(session);
  setState({
    isHydrating: false,
    isAuthenticated: true,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    student: session.student,
    error: null,
  });
}

async function reconcileSession(session: MobileAuthSession): Promise<MobileAuthSession> {
  try {
    const student = await apiFetchCurrentStudent(session.accessToken);
    return { ...session, student };
  } catch {
    const refreshedTokens = await apiRefreshStudentTokens({ refreshToken: session.refreshToken });
    const student = await apiFetchCurrentStudent(refreshedTokens.accessToken);

    return {
      student,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
    };
  }
}

export async function hydrateAuth(): Promise<void> {
  if (hydratePromise) {
    return hydratePromise;
  }

  hydratePromise = (async () => {
    setState({ isHydrating: true, error: null });

    const storedSession = await loadAuthSession();

    if (!storedSession) {
      setState({ ...initialState, isHydrating: false });
      return;
    }

    try {
      const session = await reconcileSession(storedSession);
      await persistSession(session);
    } catch (error) {
      await clearAuthSession();
      setState({
        ...initialState,
        isHydrating: false,
        error: error instanceof Error ? error.message : 'Authentication session expired.',
      });
    }
  })().finally(() => {
    hydratePromise = null;
  });

  return hydratePromise;
}

export async function signIn(payload: MobileLoginPayload): Promise<MobileAuthSession> {
  setState({ error: null });
  const session = await apiLoginStudent(payload);
  await persistSession(session);
  return session;
}

export async function signOut(logoutAll = false): Promise<void> {
  const currentRefreshToken = state.refreshToken;

  if (currentRefreshToken) {
    try {
      await apiLogoutStudent({ refreshToken: currentRefreshToken, logoutAll });
    } catch {
      // Clear local session even if server logout fails.
    }
  }

  await clearAuthSession();
  setState({ ...initialState, isHydrating: false });
}

export async function refreshSession(): Promise<MobileAuthSession | null> {
  if (!state.refreshToken) {
    return null;
  }

  const tokens = await apiRefreshStudentTokens({ refreshToken: state.refreshToken });
  const student = await apiFetchCurrentStudent(tokens.accessToken);
  const session: MobileAuthSession = {
    student,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };

  await persistSession(session);
  return session;
}

export function clearAuthError(): void {
  setState({ error: null });
}

export async function reloadStudentProfile(): Promise<MobileStudentProfile> {
  if (!state.accessToken) {
    throw new Error('No access token available');
  }
  const student = await apiFetchCurrentStudent(state.accessToken);
  const session = {
    student,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken!,
  };
  await persistSession(session);
  return student;
}

export function useAuth() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...snapshot,
    hydrateAuth,
    signIn,
    signOut,
    refreshSession,
    reloadStudentProfile,
    clearAuthError,
  };
}
