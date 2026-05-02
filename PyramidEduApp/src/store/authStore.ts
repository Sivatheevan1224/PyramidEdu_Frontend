export type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
};

export const authStore: AuthState = {
  isAuthenticated: false,
  userId: null,
};