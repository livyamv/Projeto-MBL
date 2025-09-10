import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Logo from "../component/logo";

const { width } = Dimensions.get("window");

// Botão de Categoria
const CategoriaButton = ({ item, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.categoryButton, selected && styles.selected]}
  >
    <Image source={item.image} style={styles.categoryImage} />
  </Pressable>
);

// Card de Estabelecimento
const EstabelecimentoCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconBox} />
    <View style={{ flex: 1 }}>
      <Text style={styles.cardText}>{item}</Text>
      <Text style={styles.cardSub}>Endereço fictício</Text>
    </View>
  </View>
);

export default function Home({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  const categorias = [
    {
      key: "comidas",
      image: require("../../assets/restaurante.png"),
      lista: ["Restaurante A", "Lanchonete B", "Cafeteria C"],
    },
    {
      key: "lazer",
      image: require("../../assets/lazer.png"),
      lista: ["Praça Central", "Clube Municipal", "Parque da Cidade"],
    },
    {
      key: "comercio",
      image: require("../../assets/comercio.png"),
      lista: ["Loja X", "Shopping Y", "Mercado Z"],
    },
  ];

  const handleSelect = (cat) => {
    setSelectedCategory(cat);
    setModalVisible(true);
  };

  const categoriaAtual = categorias.find((c) => c.key === selectedCategory);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -width * 0.6 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(!sidebarOpen));
  };

  // Filtra itens do modal conforme pesquisa
  const listaFiltrada = (categoriaAtual?.lista || []).filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Barra de Pesquisa */}
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
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <CategoriaButton
            item={item}
            selected={selectedCategory === item.key}
            onPress={() => handleSelect(item.key)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Modal dinâmico */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {categoriaAtual ? categoriaAtual.key.toUpperCase() : ""}
          </Text>

          <FlatList
            data={listaFiltrada}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <EstabelecimentoCard item={item} />}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum item encontrado</Text>
            }
          />

          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={() => navigation.replace("Login")}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>
        <Pressable onPress={() => navigation.replace("Favoritos")}>
          <AntDesign name="heart" size={28} color="gray" />
        </Pressable>
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <Pressable style={styles.overlay} onPress={toggleSidebar} />
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            {[
              { name: "Perfil", icon: <AntDesign name="user" size={22} /> },
              {
                name: "Favoritos",
                icon: <AntDesign name="hearto" size={22} />,
              },
              {
                name: "Avaliacoes",
                icon: <MaterialIcons name="rate-review" size={22} />,
              },
              {
                name: "Configuracoes",
                icon: <Feather name="settings" size={22} />,
              },
              {
                name: "SobreNos",
                icon: <Feather name="info" size={22} />,
                bold: true,
              },
            ].map((item, i) => (
              <Pressable
                key={i}
                style={styles.sidebarButton}
                onPress={() => navigation.navigate(item.name)}
              >
                {item.icon}
                <Text style={[styles.sidebarItem, item.bold && styles.bold]}>
                  {item.name.replace(/([A-Z])/g, " $1").trim()}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={[styles.sidebarButton, { marginTop: "auto" }]}
              onPress={() => navigation.replace("Login")}
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
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 16, color: "white" },
  categoriesContainer: {
    paddingVertical: 10,
  },

  categoryButton: {
    backgroundColor: "#8fa1b6",
    width: 130, // largura pequena
    height: 130, // altura pequena
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15, // espaço entre os botões
  },

  categoryImage: {
    width: 30, // tamanho menor da imagem
    height: 30,
    resizeMode: "contain",
  },

  selected: { backgroundColor: "#5a6fa1" },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: "cover",
  },
  modalContainer: { flex: 1, backgroundColor: "#e5e5e5", padding: 20 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
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
  cardText: { fontSize: 16, color: "#333", fontWeight: "bold" },
  cardSub: { fontSize: 14, color: "#666", marginTop: 2 },
  empty: { textAlign: "center", marginTop: 20, color: "#555" },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#5a6fa1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
