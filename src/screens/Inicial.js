import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function TelaInicial() {
   const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Ícone */}
      <Image
        source={require("../../assets/iconGlimp.png")}
        style={styles.icon}
      />

      {/* Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>Grandes</Text>
        <Text style={styles.text}>Lugares</Text>
        <Text style={styles.text}>Inspiram</Text>
        <Text style={styles.text}>Momentos</Text>
        <Text style={styles.text}>Perfeitos.</Text>
      </View>

     <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")} // navega para a tela de login
      >
        <AntDesign name="up" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6e",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
icon: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    alignSelf: "flex-start",
    marginBottom: height * 0.01,
},
  textContainer: {
    alignItems: "flex-start",
    gap: 10,
  },
  text: {
    fontSize: 65,
    fontWeight: "300",
    color: "#333",
    fontFamily: "sans-serif-light",
  },
  button: {
    backgroundColor: "#5f7e87",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
