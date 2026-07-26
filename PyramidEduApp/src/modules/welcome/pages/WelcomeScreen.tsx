import { useRouter } from 'expo-router';
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { openSignUpPage } from '../services/welcome.service';
import { useWelcomeAnimations } from '../hooks/useWelcome';
import { WELCOME_TITLE, SIGN_UP_TEXT, LOG_IN_TEXT } from '../constants/welcome.constants';

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  
  const {
    animatedSignUpStyle,
    animatedLoginStyle,
    pressInSignUp,
    pressOutSignUp,
    pressInLogin,
    pressOutLogin,
  } = useWelcomeAnimations();

  const handleSignUp = async () => {
    await openSignUpPage();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/logo.svg')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={[styles.title, { color: colors.textPrimary }]}>{WELCOME_TITLE}</Text>
        </Animated.View>

        {/* Buttons Section */}
        <Animated.View style={styles.buttonContainer}>
          <Animated.View style={animatedSignUpStyle}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={pressInSignUp}
              onPressOut={pressOutSignUp}
              onPress={handleSignUp}
              style={[styles.signUpButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            >
              <Text style={[styles.signUpButtonText, { color: colors.surface }]}>{SIGN_UP_TEXT}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animatedLoginStyle}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={pressInLogin}
              onPressOut={pressOutLogin}
              onPress={() => router.push('/login' as any)}
              style={[styles.loginButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.loginButtonText, { color: colors.textPrimary }]}>{LOG_IN_TEXT}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 20,
  },
  signUpButton: {
    height: 60,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  loginButton: {
    height: 60,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
