import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Logo from "../component/logo";
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [favoritos, setFavoritos] = useState([]); // voltou a ser favoritos
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const response = await api.get("/favoritos"); // rota correta
        console.log("Favoritos:", response.data);

        if (Array.isArray(response.data)) {
          setFavoritos(response.data);
        } else if (response.data?.favoritos) {
          setFavoritos(response.data.favoritos);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error.message);
      }
    }
    carregarFavoritos();
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

  const listaFiltrada = favoritos.filter((item) =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={toggleSidebar}>
          <Entypo name="menu" size={28} color="#333" />
        </Pressable>

        <View style={styles.logoContainer}>
          <Logo />
        </View>
      </View>

      {/* CAMPO DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar nos favoritos"
          style={styles.searchInput}
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        <AntDesign name="search1" size={20} color="#fff" />
      </View>

      {/* LISTA DE FAVORITOS */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.nome}</Text>
            <AntDesign name="heart" size={20} color="red" />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
            Nenhum favorito encontrado
          </Text>
        }
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>
      </View>

      {/* SIDEBAR */}
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
              onPress={() => navigation.navigate("Home")}
            >
              <AntDesign name="home" size={28} color="gray" />
              <Text style={styles.sidebarItem}>Home</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoContainer: { flexDirection: "column", alignItems: "flex-end" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#C2C2C2",
    borderRadius: 35,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 16, color: "white" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    justifyContent: "space-between",
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
  bottom: 0,
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
