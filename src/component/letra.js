import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

export function Text({ style, ...props }) {
  return (
    <RNText {...props} style={[styles.default, style]}>
      {props.children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "DarkerGrotesque-Regular",
  },
});
