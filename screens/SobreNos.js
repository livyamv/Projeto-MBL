import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Logo from "../component/logo";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function SobreNos() {
  const navigation = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

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

  // Lista dos integrantes com seus @
  const integrantes = [
    { nome: "Lívia", insta: "livia" },
    { nome: "Maria Luísa", insta: "marialuisa" },
    { nome: "Maria Clara", insta: "mariaclara" },
    { nome: "Priscila", insta: "priscila" },
    { nome: "Gabriel", insta: "gabriel" },
    { nome: "Guilherme", insta: "guilherme" },
    { nome: "Leonardo", insta: "leonardo" },
  ];

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

      {/* Conteúdo com Scroll */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sessão Sobre Nós */}
        <View style={styles.content}>
          <Text style={styles.title}>Sobre Nós</Text>
          <Text style={styles.text}>
            O GLIMP é um projeto criado para facilitar a descoberta de lugares
            incríveis — de restaurantes a pontos de lazer e comércios locais.{"\n\n"}
            Nosso objetivo é inspirar momentos perfeitos e dar visibilidade aos
            estabelecimentos da sua cidade.
          </Text>
        </View>

        {/* Integrantes */}
        <View style={styles.teamContainer}>
          <Text style={styles.subtitleTitle}>Nosso Time</Text>

          {integrantes.map((pessoa, index) => (
            <View key={index} style={styles.memberCard}>
              <Text style={styles.memberName}>{pessoa.nome}</Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(``)
                }
              >
                <AntDesign name="instagram" size={24} color="#E1306C" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar animada */}
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
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  logoContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },

  subtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    maxWidth: width * 0.6,
    textAlign: "right",
  },

  content: {
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },

  text: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    textAlign: "center",
  },

  teamContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },

  subtitleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#222",
  },

  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },

  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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

  sidebarItem: {
    fontSize: 18,
    color: "#333",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 50,
  },

  bold: {
    fontWeight: "bold",
  },
});
