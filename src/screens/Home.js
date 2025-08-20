import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Bem-vindo ao Glimp</Text>

        <Image
          source={require("../../assets/iconGlimp.png")}
          style={styles.image}
        />

        <Text style={styles.subtitle}>
          Explore e organize seus momentos perfeitos.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ListaSalas")}
        >
          <Text style={styles.buttonText}>Salas Disponíveis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UserReservas")}
        >
          <Text style={styles.buttonText}>Minhas Reservas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e1e1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#E5E5E5",
    width: "85%",
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 45,
    resizeMode: "contain",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    width: "80%",
    backgroundColor: "#6B7A99",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
