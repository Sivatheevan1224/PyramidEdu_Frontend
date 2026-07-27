import { Linking } from 'react-native';

export const openSignUpPage = async (): Promise<void> => {
  const baseUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:3000';
  const signUpUrl = `${baseUrl}/register`;
  try {
    await Linking.openURL(signUpUrl);
  } catch (error) {
    console.error('Failed to open register URL:', error);
  }
};
