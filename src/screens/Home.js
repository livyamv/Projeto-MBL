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
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Logo from "../component/logo";
import EstabelecimentosModal from "../component/EstabelecimentosModal";
import Sidebar from "../component/Sidebar";
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
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

          // Filtra apenas Franca-SP e adiciona propriedade tipo
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
        if (error.response) {
          console.error("Erro da API:", error.response.data);
        } else if (error.request) {
          console.error("Sem resposta do servidor:", error.request);
        } else {
          console.error("Erro desconhecido:", error.message);
        }
      }
    }

    carregarEstabelecimentos();
  }, []);

  function handleLogout() {
    navigation.replace("Login");
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  const categorias = [
    { key: "restaurant", image: require("../../assets/restaurante.png") },
    { key: "park", image: require("../../assets/lazer.png") },
    { key: "store", image: require("../../assets/comercio.png") },
  ];

  // Clique em categoria
  function handleCategoryClick(catKey) {
    setSelectedCategory(selectedCategory === catKey ? null : catKey);
  }

  // Filtro de busca e categoria
  const listaFiltrada = estabelecimentos.filter((item) => {
    const matchSearch = item.nome?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? item.tipo === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
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

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar"
          style={styles.searchInput}
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        <AntDesign name="search" size={20} color="#fff" />
      </View>

      {/* CATEGORIAS */}
      <View style={styles.categoriesContainer}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => handleCategoryClick(cat.key)}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.selected,
            ]}
          >
            <Image source={cat.image} style={styles.categoryImage} />
          </Pressable>
        ))}
      </View>

      {/* LISTA DE ESTABELECIMENTOS */}
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
            <View style={styles.iconBox} />
            <Text style={styles.cardText}>{item.nome}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* MODAL DE DETALHES */}
      {selectedItem && (
        <EstabelecimentosModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
        />
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>
      </View>

      {/* SIDEBAR COMPONENT */}
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
  container: { flex: 1, backgroundColor: "#e5e5e5", padding: 20 },
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#C2C2C2",
    borderRadius: 35,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  searchInput: { flex: 1, fontSize: 16, color: "white" },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryButton: {
    backgroundColor: "#8fa1b6",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { backgroundColor: "#5a6fa1" },
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
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  iconBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#5a6fa1",
    marginRight: 12,
  },
  cardText: { fontSize: 16, color: "#333" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: { flexDirection: "row", alignItems: "center", gap: 5 },
});