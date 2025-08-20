import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../assets/iconLoc.png")}
        style={styles.logoImage}
      />
      <Text style={styles.logoText}>Glimp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 65,
    height: 65,
    resizeMode: "contain",
    marginRight: -10,
  },
  logoText: {
    fontSize: 35,
    fontWeight: "300",
    color: "#000",
    letterSpacing: 0.5,
  },
});
