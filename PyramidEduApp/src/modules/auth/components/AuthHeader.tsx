import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { getStyles } from "../pages/styles";
import { useAppTheme } from "../../../hooks/useAppTheme";

export default function AuthHeader() {
  const { colors } = useAppTheme();
  const styles = getStyles(colors);

  return (
    <Animated.View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../../assets/images/logo.svg")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    </Animated.View>
  );
}
