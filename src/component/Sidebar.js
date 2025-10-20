import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Sidebar({ isOpen, onClose, navigation, onLogout }) {
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width * 0.6,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  function handleNavigation(route) {
    navigation.navigate(route);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <Pressable
          style={styles.sidebarButton}
          onPress={() => handleNavigation("Home")}
        >
          <AntDesign name="home" size={22} color="#333" />
          <Text style={styles.sidebarItem}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.sidebarButton}
          onPress={() => handleNavigation("Perfil")}
        >
          <AntDesign name="user" size={22} color="#333" />
          <Text style={styles.sidebarItem}>Perfil</Text>
        </Pressable>

        <Pressable
          style={styles.sidebarButton}
          onPress={() => handleNavigation("Favoritos")}
        >
          <AntDesign name="heart" size={22} color="#333" />
          <Text style={styles.sidebarItem}>Favoritos</Text>
        </Pressable>

        <Pressable
          style={styles.sidebarButton}
          onPress={() => handleNavigation("Avaliacao")}
        >
          <MaterialIcons name="rate-review" size={22} color="#333" />
          <Text style={styles.sidebarItem}>Avaliações</Text>
        </Pressable>

        <Pressable
          style={styles.sidebarButton}
          onPress={() => handleNavigation("SobreNos")}
        >
          <Feather name="info" size={22} color="#333" />
          <Text style={[styles.sidebarItem, styles.bold]}>Sobre Nós</Text>
        </Pressable>

        <Pressable
          style={[styles.sidebarButton, { marginTop: "auto" }]}
          onPress={onLogout}
        >
          <AntDesign name="logout" size={22} color="black" />
          <Text style={styles.sidebarItem}>Sair</Text>
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
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