import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Logo from "../component/logo";
import EstabelecimentosModal from "../component/EstabelecimentosModal";
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

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
            .filter((item) => item.endereco?.toLowerCase().includes("franca"))
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

  const categorias = [
    { key: "restaurant", image: require("../../assets/restaurante.png") },
    { key: "park", image: require("../../assets/lazer.png") },
    { key: "store", image: require("../../assets/comercio.png") },
  ];

  // Função de clique na categoria
  function handleCategoryClick(catKey) {
    if (selectedCategory === catKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catKey);
    }
  }

  // Filtra por categoria e busca
  const listaFiltrada = estabelecimentos.filter((item) => {
    const matchSearch = item.nome?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? item.tipo === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

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

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar"
          style={styles.searchInput}
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        <AntDesign name="search1" size={20} color="#fff" />
      </View>

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
/>


      <EstabelecimentosModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={selectedItem}
      />

      

      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>
        
      </View>

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