export function validateLogin(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) {
    return "Enter your email and password.";
  }
  return null;
}
