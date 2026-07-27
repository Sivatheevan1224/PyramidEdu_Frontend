import { z } from 'zod';

export const WelcomeConfigSchema = z.object({
  signUpUrl: z.string().url(),
  logoPath: z.string(),
});
