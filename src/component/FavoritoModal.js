import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function FavoritoModal({ visible, onClose, item }) {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{item.nome_estabelecimento || "Sem nome"}</Text>
          <Text style={styles.address}>{item.endereco || "Sem endereço"}</Text>
          {item.media_avaliacoes !== undefined && (
            <Text style={styles.rating}>
              ⭐ Média: {item.media_avaliacoes.toFixed(1)}
            </Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: width * 0.85,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  address: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#5A6FA1",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
