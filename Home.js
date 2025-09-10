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
import { AntDesign } from "@expo/vector-icons";
import Logo from "../component/logo";
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    
    async function carregarEstabelecimentos() {
      try {
       
        const tipos = ["restaurant", "store", "park"];
        let todos = [];

        for (const type of tipos) {
          const response = await api.getbuscarEstabelecimentos({
            location: "-20.12345,-47.12345", // coloca coordenada padrão
            radius: 5000,
            type,
          });
          console.log(`Tipo ${type} retornou:`, response.data);
          if (Array.isArray(response.data)) {
            todos = [...todos, ...response.data];
          }
        }
        console.log("Todos os estabelecimentos:", todos);
              
        setEstabelecimentos(todos);
      } catch (error) {
        if (error.response) {
          // erro de resposta da API (ex: 400, 500)
          console.error("Erro da API:", error.response.data);
        } else if (error.request) {
          // requisição foi feita mas não teve resposta
          console.error("Sem resposta do servidor:", error.request);
        } else {
          // erro ao configurar a requisição
          console.error("Erro desconhecido:", error.message);
        }
      }
      
    }
    carregarEstabelecimentos();
  }, []);

  function handleLogout() {
    navigation.replace("Login");
  }

  const categorias = [
    { key: "restaurante", image: require("../../assets/restaurante.png") },
    { key: "lazer", image: require("../../assets/lazer.png") },
    { key: "comercio", image: require("../../assets/comercio.png") },
  ];

  // Filtrar pelo que foi digitado
  const listaFiltrada = estabelecimentos.filter((item) =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Logo />
          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>
        <View style={styles.profileIcon}>
          <AntDesign name="user" size={24} color="#333" />
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
          <Pressable key={cat.key} style={styles.categoryButton}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e5e5e5", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    maxWidth: width * 0.6,
  },
  profileIcon: { backgroundColor: "#ddd", borderRadius: 20, padding: 8 },
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
  categoryImage: { width: 50, height: 50, borderRadius: 8, resizeMode: "cover" },

  // Estilização da lista
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
