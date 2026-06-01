const SESSION_MARKER_KEY = "pyramidedu.has-session";
const SESSION_META_KEY = "pyramidedu.auth-session-meta";

const PUBLIC_ROUTE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/otp",
  "/otp-verification",
];

const PROTECTED_ROUTE_PREFIXES = [
  "/admin",
  "/manager",
  "/teacher",
  "/change-password",
];

type SessionMeta = {
  active: boolean;
  updatedAt: number;
  lastPath?: string;
};

const readPathname = () => {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
};

export const isPublicRoute = (pathname: string = readPathname()) => {
  if (pathname === "/") return true;
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
};

export const isProtectedRoute = (pathname: string = readPathname()) =>
  PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const getPersistedSessionMeta = (): SessionMeta | null => {
  if (typeof window === "undefined") return null;

  const rawMeta = window.localStorage.getItem(SESSION_META_KEY);
  if (rawMeta) {
    try {
      const parsed = JSON.parse(rawMeta) as SessionMeta;
      if (parsed?.active) {
        return parsed;
      }
    } catch {
      // Ignore malformed metadata and fall back to the marker.
    }
  }

  if (window.localStorage.getItem(SESSION_MARKER_KEY) === "true") {
    return {
      active: true,
      updatedAt: Date.now(),
    };
  }

  return null;
};

export const hasPersistedSession = () => Boolean(getPersistedSessionMeta());

export const setPersistedSession = (active: boolean, lastPath?: string) => {
  if (typeof window === "undefined") return;

  if (!active) {
    window.localStorage.removeItem(SESSION_MARKER_KEY);
    window.localStorage.removeItem(SESSION_META_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_MARKER_KEY, "true");
  window.localStorage.setItem(
    SESSION_META_KEY,
    JSON.stringify({
      active: true,
      updatedAt: Date.now(),
      lastPath: lastPath ?? readPathname(),
    }),
  );
};

export const clearPersistedSession = () => setPersistedSession(false);

export const shouldAttemptSilentRefresh = (pathname: string = readPathname()) =>
  isProtectedRoute(pathname) && hasPersistedSession();
