import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const useWelcomeAnimations = () => {
  const signUpScale = useSharedValue(1);
  const loginScale = useSharedValue(1);

  const animatedSignUpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signUpScale.value }],
  }));

  const animatedLoginStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loginScale.value }],
  }));

  const pressInSignUp = () => {
    signUpScale.value = withSpring(0.98);
  };

  const pressOutSignUp = () => {
    signUpScale.value = withSpring(1);
  };

  const pressInLogin = () => {
    loginScale.value = withSpring(0.98);
  };

  const pressOutLogin = () => {
    loginScale.value = withSpring(1);
  };

  return {
    animatedSignUpStyle,
    animatedLoginStyle,
    pressInSignUp,
    pressOutSignUp,
    pressInLogin,
    pressOutLogin,
  };
};
