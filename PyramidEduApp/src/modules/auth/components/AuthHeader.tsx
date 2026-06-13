import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { styles } from "../pages/styles";

export default function AuthHeader() {
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
