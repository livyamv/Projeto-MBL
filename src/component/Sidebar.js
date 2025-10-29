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
import {
  Feather,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Sidebar({ isOpen, onClose, navigation, onLogout }) {
  const slideAnim = useRef(new Animated.Value(-width * 0.65)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -width * 0.65,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen]);

  function handleNavigation(route) {
    navigation.navigate(route);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View
        style={[styles.sidebarContainer, { left: slideAnim, opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={["#ffffff", "#f1f1f1"]}
          style={styles.sidebar}
        >
          {/* Home */}
          <Pressable
            style={({ pressed }) => [
              styles.sidebarButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleNavigation("Home")}
          >
            <Feather name="home" size={22} color="#222" />
            <Text style={styles.sidebarItem}>Home</Text>
          </Pressable>

          {/* Perfil */}
          <Pressable
            style={({ pressed }) => [
              styles.sidebarButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleNavigation("Perfil")}
          >
            <Feather name="user" size={22} color="#222" />
            <Text style={styles.sidebarItem}>Perfil</Text>
          </Pressable>

          {/* Favoritos */}
          <Pressable
            style={({ pressed }) => [
              styles.sidebarButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleNavigation("Favoritos")}
          >
            <Feather name="heart" size={22} color="#e63946" />
            <Text style={styles.sidebarItem}>Favoritos</Text>
          </Pressable>

          {/* Avaliações */}
          <Pressable
            style={({ pressed }) => [
              styles.sidebarButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleNavigation("Avaliacao")}
          >
            <MaterialCommunityIcons
              name="star-outline"
              size={22}
              color="#222"
            />
            <Text style={styles.sidebarItem}>Avaliações</Text>
          </Pressable>

          {/* Sobre Nós */}
          <Pressable
            style={({ pressed }) => [
              styles.sidebarButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => handleNavigation("SobreNos")}
          >
            <Feather name="info" size={22} color="#222" />
            <Text style={[styles.sidebarItem, styles.bold]}>Sobre Nós</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Sair */}
          <Pressable
            style={[styles.sidebarButton, { marginTop: "auto" }]}
            onPress={onLogout}
          >
            <AntDesign name="logout" size={22} color="#222" />
            <Text style={styles.sidebarItem}>Sair</Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: width * 0.65,
    zIndex: 100,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
  },
  sidebar: {
    flex: 1,
    padding: 25,
  },
  sidebarButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 12,
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    transition: "all 0.3s ease",
  },
  pressedButton: {
    backgroundColor: "#e7e7e7",
  },
  sidebarItem: {
    fontSize: 17,
    color: "#222",
  },
  divider: {
    borderBottomColor: "#d4d4d4",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 50,
  },
  bold: {
    fontWeight: "600",
  },
});
