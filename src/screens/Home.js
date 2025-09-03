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
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("restaurante");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  useEffect(() => {
    async function carregarEstabelecimentos() {
      try {
        const tipos = ["restaurant", "store", "park"];
        let todos = [];

        for (const type of tipos) {
          const response = await api.getbuscarEstabelecimentos({
            location: "-20.12345,-47.12345",
            radius: 5000,
            type,
          });
          console.log(`Tipo ${type} retornou:`, response.data);

          if (Array.isArray(response.data)) {
            todos = [...todos, ...response.data];
          } else if (response.data?.estabelecimentos) {
            todos = [...todos, ...response.data.estabelecimentos];
          }
        }

        console.log("Todos os estabelecimentos:", todos);
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
    { key: "restaurante", image: require("../../assets/restaurante.png") },
    { key: "lazer", image: require("../../assets/lazer.png") },
    { key: "comercio", image: require("../../assets/comercio.png") },
  ];

  const listaFiltrada = estabelecimentos.filter((item) =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Ícone do menu no canto esquerdo */}
        <Pressable onPress={toggleSidebar}>
          <Entypo name="menu" size={28} color="#333" />
        </Pressable>

        {/* Logo + frase no canto direito */}
        <View style={styles.logoContainer}>
          <Logo />
          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>
      </View>

      {/* Campo de busca */}
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

      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.selected,
            ]}
          >
            <Image source={cat.image} style={styles.categoryImage} />
          </Pressable>
        ))}
      </View>

      {/* Lista de Estabelecimentos */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox} />
            <Text style={styles.cardText}>{item.nome}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
            Nenhum estabelecimento encontrado
          </Text>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>
        <Pressable>
          <AntDesign name="heart" size={28} color="gray" />
        </Pressable>
      </View>

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
              onPress={() => navigation.navigate("Avaliacoes")}
            >
              <MaterialIcons name="rate-review" size={22} color="#333" />
              <Text style={styles.sidebarItem}>Avaliações</Text>
            </Pressable>

            <Pressable
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("Configuracoes")}
            >
              <Feather name="settings" size={22} color="#333" />
              <Text style={styles.sidebarItem}>Configurações</Text>
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
    flexDirection: "row", // menu e logo lado a lado
    justifyContent: "space-between", // menu à esquerda, logo à direita
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  logoContainer: {
    flexDirection: "column", // logo em cima, frase embaixo
    alignItems: "flex-end", // para ficar alinhado à direita
  },

  subtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    maxWidth: width * 0.6,
    textAlign: "right", // frase alinhada à direita
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
