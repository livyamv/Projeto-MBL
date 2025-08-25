import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Logo from "../component/logo";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("praia");

  function handleLogout() {
    navigation.replace("Login");
  }

  const categorias = [
    {
      key: "restaurante",
      image: require("../../assets/restaurante.png"),
      screen: "Restaurante",
    },
    { key: "lazer", image: require("../../assets/lazer.png"), screen: "Lazer" },
    {
      key: "comercio",
      image: require("../../assets/comercio.png"),
      screen: "Comercio",
    },
  ];

  return (
    <View style={styles.container}>
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
        />
        <AntDesign name="search1" size={20} color="#fff" />
      </View>

      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        {categorias.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => {
              setSelectedCategory(cat.key);
              navigation.navigate(cat.screen);
            }}
            style={({ pressed }) => [
              styles.categoryButton,
              (selectedCategory === cat.key || pressed) && styles.selected,
            ]}
          >
            <Image source={cat.image} style={styles.categoryImage} />
          </Pressable>
        ))}
      </View>

      {/* Footer com Logout e Favoritos */}
      <View style={styles.footer}>
        {/* Botão Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="gray" />
        </Pressable>

        {/* Botão Favoritos */}
        <Pressable>
          <AntDesign name="heart" size={28} color="gray" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    padding: 20,
  },
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
  profileIcon: {
    backgroundColor: "#ddd",
    borderRadius: 20,
    padding: 8,
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
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
  selected: {
    backgroundColor: "#5a6fa1",
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: "cover",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
