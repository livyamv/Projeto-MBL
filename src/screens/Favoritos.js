import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Portal } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";
import EstabelecimentosModal from "../component/EstabelecimentosModal";
import Logo from "../component/logo";
import Sidebar from "../component/Sidebar";

const { width } = Dimensions.get("window");

export default function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [favoriteToRemove, setFavoriteToRemove] = useState(null);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  // Carrega favoritos do usuário
  const carregarFavoritos = async () => {
    try {
      setLoading(true);
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) return;

      const response = await api.getFavoritos({ id_usuario: userId });
      if (response.data && Array.isArray(response.data.favoritos)) {
        setFavoritos(response.data.favoritos);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar favoritos:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove favorito
  const removerFavorito = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId || !favoriteToRemove) return;

      const response = await api.removeFavorito(favoriteToRemove.id_favorito, {
        params: { id_usuario: userId },
      });

      if (response.status === 200) {
        setFavoritos((prev) =>
          prev.filter((fav) => fav.id_favorito !== favoriteToRemove.id_favorito)
        );
      }
    } catch (error) {
      console.error(
        "Erro ao remover favorito:",
        error.response?.data || error.message
      );
    } finally {
      setFavoriteToRemove(null);
      setSnackbarVisible(false);
    }
  };

  const confirmarRemocao = (item) => {
    setFavoriteToRemove(item);
    setSnackbarVisible(true);
  };

  const cancelarRemocao = () => {
    setFavoriteToRemove(null);
    setSnackbarVisible(false);
  };

  const abrirModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const toggleSidebar = () => {
    if (sidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.6,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    carregarFavoritos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={toggleSidebar}>
          <Entypo name="menu" size={28} color="#333" />
        </Pressable>

        <View style={styles.logoContainer}>
          <Logo />
          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Meus Favoritos</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item, index) =>
          String(item.id_favorito || item.google_place_id || index)
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => abrirModal(item)}>
            <View style={styles.card}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardText} numberOfLines={1}>
                  {item.nome_estabelecimento || "Sem nome"}
                </Text>
                <Text style={styles.cardSub} numberOfLines={1}>
                  {item.endereco || ""}
                </Text>
              </View>
              <Pressable
                onPress={() => confirmarRemocao(item)}
                style={{ padding: 5 }}
              >
                <AntDesign name="heart" size={22} color="#ff6b6b" />
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum favorito encontrado</Text>
        }
      />

      {selectedItem && (
        <EstabelecimentosModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
        />
      )}

      <Portal>
        <SnackbarLocal
          visible={snackbarVisible}
          message="Esta ação é permanente e removerá o item da sua lista."
          onConfirm={removerFavorito}
          onCancel={cancelarRemocao}
        />
      </Portal>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        onLogout={handleLogout}
      />
    </View>
  );
}

// Componente de snackbar local
function SnackbarLocal({ visible, message, onConfirm, onCancel }) {
  const [show, setShow] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShow(false));
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Pressable style={styles.portalOverlay} onPress={onCancel}>
      <Animated.View
        onTouchStart={(e) => e.stopPropagation()}
        style={[styles.snackbarContent, { opacity, transform: [{ scale }] }]}
      >
        <Text style={styles.snackbarTitle}>Tem Certeza?</Text>
        <Text style={styles.snackbarMessage}>{message}</Text>

        <View style={styles.divider} />

        <View style={styles.snackbarActions}>
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Remover</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoContainer: { flexDirection: "column", alignItems: "flex-end" },
  subtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    maxWidth: width * 0.6,
    textAlign: "right",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardText: { fontSize: 16, color: "#333", fontWeight: "600" },
  cardSub: { fontSize: 14, color: "#777", marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#777" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  snackbarContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    width: "85%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  snackbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  snackbarMessage: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
    marginVertical: 20,
  },
  snackbarActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: { color: "#555", fontWeight: "bold", fontSize: 16 },
  confirmButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
