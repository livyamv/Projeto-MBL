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
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import api from "../axios/axios";
import EstabelecimentosModal from "../component/EstabelecimentosModal";
import Logo from "../component/logo";

const { width } = Dimensions.get("window");

export default function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width } = Dimensions.get("window");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  // Carrega os favoritos do usuário logado
  const carregarFavoritos = async () => {
  try {
    setLoading(true);

    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      console.warn("Usuário não logado");
      return;
    }

   
    const response = await api.getFavoritos({ id_usuario: userId });
    
    setFavoritos(response.data || []);
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  // Remove favorito e atualiza lista
  const removerFavorito = async (google_place_id) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) return;

    await api.removeFavorito({ id_usuario: userId, google_place_id });

    setFavoritos((prev) =>
      prev.filter((fav) => fav.google_place_id !== google_place_id)
    );
  } catch (error) {
    console.error("Erro ao remover favorito:", error.response?.data || error.message);
  }
};

  // Abre modal com os detalhes do estabelecimento
  const abrirModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  function handleLogout() {
    navigation.replace("Login");
  }

  function toggleSidebar() {
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
  }

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
      {/* Header */}
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
              <View>
                <Text style={styles.cardText}>
                  {item.nome_estabelecimento || "Sem nome"}
                </Text>
                <Text style={styles.cardSub}>{item.endereco || ""}</Text>
              </View>
              <Pressable
                onPress={() => removerFavorito(item.id_favorito)}
                style={{ padding: 5 }}
              >
                <AntDesign name="delete" size={22} color="red" />
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

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <Pressable style={styles.overlay} onPress={toggleSidebar} />
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <Pressable
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("Perfil")}
            >
              <AntDesign name="user" size={22} color="#333" />
              <Text style={styles.sidebarItem}>Perfil</Text>
            </Pressable>

            <Pressable
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("Favoritos")}
            >
              <AntDesign name="hearto" size={22} color="#333" />
              <Text style={styles.sidebarItem}>Favoritos</Text>
            </Pressable>

            <Pressable
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("Avaliacao")}
            >
              <MaterialIcons name="rate-review" size={22} color="#333" />
              <Text style={styles.sidebarItem}>Avaliações</Text>
            </Pressable>

            <Pressable
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("SobreNos")}
            >
              <Feather name="info" size={22} color="#333" />
              <Text style={[styles.sidebarItem, styles.bold]}>Sobre Nós</Text>
            </Pressable>

            <Pressable
              style={[styles.sidebarButton, { marginTop: "auto" }]}
              onPress={handleLogout}
            >
              <AntDesign name="logout" size={22} color="black" />
              <Text style={styles.sidebarItem}>Sair</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
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
  },
  cardText: { fontSize: 16, color: "#333", fontWeight: "600" },
  cardSub: { fontSize: 14, color: "#777", marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#777" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  // Sidebar
  sidebar: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: width * 0.6,
    backgroundColor: "#ddd",
    padding: 20,
    elevation: 5,
    zIndex: 100,
  },
  sidebarButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 10,
  },
  sidebarItem: { fontSize: 18, color: "#333" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 50,
  },
  bold: { fontWeight: "bold" },
});