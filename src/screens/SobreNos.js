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
import { AntDesign, Entypo } from "@expo/vector-icons";
import Logo from "../component/logo";
import Sidebar from "../component/Sidebar";
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

  const integrantes = [
    { nome: "Gabriel", insta: "https://www.instagram.com/gabb_ignacio/" },
    {
      nome: "Guilherme",
      insta: "https://www.instagram.com/guilherme_guimaraes11/",
    },
    { nome: "Leonardo", insta: "https://www.instagram.com/leo.pedrosoo/" },
    { nome: "Lívia", insta: "https://www.instagram.com/livreys/" },
    {
      nome: "Maria Clara",
      insta: "https://www.instagram.com/mahh.oliveira07/",
    },
    { nome: "Maria Luísa", insta: "https://www.instagram.com/m.lureys/" },
    { nome: "Priscila", insta: "https://www.instagram.com/prieloize/" },
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

      {/* Conteúdo */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sobre Nós */}
        <View style={styles.content}>
          <Text style={styles.title}>Sobre Nós</Text>
          <Text style={styles.text}>
            O GLIMP é um projeto criado para facilitar a descoberta de lugares
            incríveis — de restaurantes a pontos de lazer e comércios locais.
            {"\n\n"}
            Nosso objetivo é inspirar momentos perfeitos e dar visibilidade aos
            estabelecimentos da sua cidade.
          </Text>
        </View>

        {/* Nosso Time */}
        <View style={styles.teamContainer}>
          <Text style={styles.subtitleTitle}>Nosso Time</Text>

          {integrantes.map((pessoa, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.memberCard,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => pessoa.insta && Linking.openURL(pessoa.insta)}
            >
              {/* Avatar circular */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{pessoa.nome[0]}</Text>
              </View>

              <Text style={styles.memberName}>{pessoa.nome}</Text>

              {pessoa.insta ? (
                <AntDesign name="instagram" size={28} color="#E1306C" />
              ) : (
                <Text style={styles.noInsta}>Não tem Instagram</Text>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar */}
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
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
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
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },

  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
  },

  teamContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },

  subtitleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  noInsta: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 14,
  },
});
