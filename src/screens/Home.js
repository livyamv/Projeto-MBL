import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import Logo from "../component/logo";
import EstabelecimentosModal from "../component/EstabelecimentosModal";
import Sidebar from "../component/Sidebar";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("usuario");
        setUserToken(token);
        if (userData) setUsuario(JSON.parse(userData));
      } catch (error) {
        console.error("Erro ao carregar token/usuário:", error);
      }
    }
    carregarUsuario();
  }, []);

  useEffect(() => {
    carregarEstabelecimentos();
  }, []);

  async function carregarEstabelecimentos() {
    try {
      const tipos = ["restaurant", "store", "park"];
      let todos = [];

      for (const type of tipos) {
        const response = await api.getEstabelecimentos({
          location: "-20.5381,-47.4008",
          radius: 15000,
          type,
        });

        const dados = response.data?.estabelecimentos || [];

        const filtradosFranca = dados
          .filter(
            (item) =>
              item.endereco?.toLowerCase()?.includes("franca") ?? false
          )
          .map((item) => ({ ...item, tipo: type }));

        todos = [...todos, ...filtradosFranca];
      }

      setEstabelecimentos(todos);
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 NOVO: Buscar estabelecimentos digitando no campo
  async function buscarPorTexto() {
    if (!search.trim()) {
      carregarEstabelecimentos();
      return;
    }

    setLoading(true);
    try {
      const response = await api.getEstabelecimentos({
        location: "-20.5381,-47.4008",
        radius: 15000,
        query: search, // 🔹 envia o texto da busca
      });

      const resultados = response.data?.estabelecimentos || [];
      setEstabelecimentos(resultados);
    } catch (error) {
      console.error("Erro ao buscar por texto:", error);
    } finally {
      setLoading(false);
    }
  }

  const categorias = [
    { key: "restaurant", image: require("../../assets/restaurante.png") },
    { key: "park", image: require("../../assets/lazer.png") },
    { key: "store", image: require("../../assets/comercio.png") },
  ];

  function handleCategoryClick(catKey) {
    setSelectedCategory(selectedCategory === catKey ? null : catKey);
  }

  const listaFiltrada = estabelecimentos.filter((item) => {
    const matchCategory = selectedCategory
      ? item.tipo === selectedCategory
      : true;
    return matchCategory;
  });

  function handleLogout() {
    navigation.replace("Login");
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={toggleSidebar} style={styles.menuButton}>
          <Entypo name="menu" size={26} color="#2f2f2f" />
        </Pressable>

        <View style={styles.logoContainer}>
          <Logo />
          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={22} color="#777" />
        <TextInput
          placeholder="Buscar lugares..."
          style={styles.searchInput}
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={buscarPorTexto} // 🔹 Pressionar Enter dispara a busca
        />
      </View>

      {/* CATEGORIAS */}
      <View style={styles.categoriesContainer}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => handleCategoryClick(cat.key)}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.selectedCategory,
            ]}
          >
            <Image source={cat.image} style={styles.categoryImage} />
          </Pressable>
        ))}
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5a6fa1" />
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item, index) => `${item.place_id}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.cardLeftBar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
              </View>
              <AntDesign name="right" size={18} color="#888" />
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
        />
      )}

      {/* MODAL */}
      {selectedItem && (
        <EstabelecimentosModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
          userToken={userToken}
          id_usuario={usuario?.id_usuario}
        />
      )}

      {/* FOOTER */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <AntDesign name="logout" size={24} color="#555" />
      </Pressable>

      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  logoContainer: { flexDirection: "column", alignItems: "flex-end" },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
    maxWidth: width * 0.65,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#8fa1b6",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategory: { backgroundColor: "#5a6fa1" },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: "cover",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeftBar: {
    width: 5,
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#5a6fa1",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: "#2f2f2f",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
