import { authStore } from "../store/authStore";

export function useAuth() {
  return authStore;
}