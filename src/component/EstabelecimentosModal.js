import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Linking,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../axios/axios";

export default function EstabelecimentosModal({ visible, onClose, item }) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const abrirSite = () => {
    if (item.site) {
      Linking.openURL(item.site).catch((err) =>
        console.error("Erro ao abrir site:", err)
      );
    }
  };

  const abrirNoMaps = () => {
    if (item.endereco) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        item.endereco
      )}`;
      Linking.openURL(url).catch((err) =>
        console.error("Erro ao abrir no Maps:", err)
      );
    }
  };

  const adicionarFavorito = async () => {
    if (!item.place_id) {
      Alert.alert("Erro", "ID do estabelecimento não disponível.");
      return;
    }

    setLoading(true);
    try {
      // NÃO envie id_usuario, o token já identifica o usuário
      await api.addFavorito({
        google_place_id: item.place_id,
        nome_estabelecimento: item.nome || "",
        endereco: item.endereco || "",
      });

      Alert.alert("Sucesso", "Adicionado aos favoritos!");
    } catch (error) {
      console.error(
        "Erro ao atualizar favorito:",
        error.response?.data || error
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível favoritar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.nome}</Text>
            <View style={styles.icons}>
              <Pressable onPress={abrirNoMaps} style={styles.iconButton}>
                <Icon name="map-marker" size={22} color="#333" />
              </Pressable>
              <Pressable onPress={adicionarFavorito} style={styles.iconButton}>
                {loading ? (
                  <ActivityIndicator size="small" color="#e63946" />
                ) : (
                  <Icon name="heart" size={22} color="#e63946" />
                )}
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.info}>
            <Text>Endereço: {item.endereco}</Text>
            <Text>Categoria: {item.categoria || "Não informado"}</Text>
            <Text>Telefone: {item.telefone || "Não informado"}</Text>
            <Text>
              Horários: {item.horarios?.join(", ") || "Não informado"}
            </Text>
            <Text>
              Site:{" "}
              {item.site ? (
                <Text style={styles.link} onPress={abrirSite}>
                  {item.site}
                </Text>
              ) : (
                "Não informado"
              )}
            </Text>
            <Text>
              Avaliação:{" "}
              {item.media_notas ? item.media_notas.toFixed(1) : "Sem nota"}
            </Text>
          </ScrollView>

          <Pressable style={styles.okButton} onPress={onClose}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 15,
    maxHeight: "85%",
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", flex: 1 },
  icons: { flexDirection: "row", marginLeft: 10 },
  iconButton: { marginHorizontal: 5 },
  info: { marginBottom: 15 },
  link: { color: "#1e90ff", textDecorationLine: "underline" },
  okButton: {
    backgroundColor: "#5a6fa1",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  okText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
