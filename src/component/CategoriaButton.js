import React from "react";
import { Pressable, Image, StyleSheet } from "react-native";

export default function CategoriaButton({ icon, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
    >
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8fa1b6",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: "#5a6fa1",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
