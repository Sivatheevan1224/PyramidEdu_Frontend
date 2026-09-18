type TokenStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
};

let tokens: TokenStoreState = {
  accessToken: null,
  refreshToken: null,
};

let forceLogoutCallback: (() => Promise<void>) | null = null;
let updateTokensCallback: ((accessToken: string, refreshToken: string) => Promise<void>) | null = null;

export function getAccessToken(): string | null {
  return tokens.accessToken;
}

export function getRefreshToken(): string | null {
  return tokens.refreshToken;
}

export function setTokens(accessToken: string | null, refreshToken: string | null): void {
  tokens.accessToken = accessToken;
  tokens.refreshToken = refreshToken;
}

export function registerAuthCallbacks(callbacks: {
  forceLogoutLocal: () => Promise<void>;
  updateTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}): void {
  forceLogoutCallback = callbacks.forceLogoutLocal;
  updateTokensCallback = callbacks.updateTokens;
}

export async function forceLogoutLocal(): Promise<void> {
  if (forceLogoutCallback) {
    await forceLogoutCallback();
  }
}

export async function updateTokens(accessToken: string, refreshToken: string): Promise<void> {
  setTokens(accessToken, refreshToken);
  if (updateTokensCallback) {
    await updateTokensCallback(accessToken, refreshToken);
  }
}
