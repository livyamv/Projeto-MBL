import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

export default function MapaScreen({ route, navigation }) {
  const { item } = route.params;

  if (!item || !item.latitude || !item.longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Localização não disponível para este estabelecimento.
        </Text>
      </View>
    );
  }

  const latitude = parseFloat(item.latitude);
  const longitude = parseFloat(item.longitude);

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="#000" />
      </Pressable>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={item.nome}
          description={item.endereco}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 50,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
});
