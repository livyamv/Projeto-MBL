// Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import api from "../axios/axios";
import Logo from "../component/logo";
import RedefinirSenhaModal from "../component/RedefinirSenhaModal";
import Snackbar from "../component/Snackbar";
import { Portal } from "react-native-paper";

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState({
    email: "",
    senha: "",
    showPassword: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const mostrarSnackbar = (mensagem, tempo = 1500) => {
    setSnackbarMessage(mensagem);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), tempo);
  };

  async function handleLogin() {
    try {
      const response = await api.postLogin({
        email: usuario.email,
        senha: usuario.senha,
      });

      if (response.data.token && response.data.user) {
        await SecureStore.setItemAsync("token", response.data.token);
        await SecureStore.setItemAsync(
          "userId",
          String(response.data.user.id_usuario)
        );
      } else {
        mostrarSnackbar("Falha ao receber token do servidor.");
        return;
      }

      mostrarSnackbar(response.data.message);
      navigation.navigate("Home");
    } catch (error) {
      console.log("Erro login:", JSON.stringify(error, null, 2));
      mostrarSnackbar(error.response?.data?.error || "Falha ao conectar.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo ao aplicativo</Text>
      <Logo />
      <Text style={styles.subtitle}>
        Grandes Lugares Inspiram Momentos Perfeitos.
      </Text>
      <Text style={styles.loginText}>Faça seu login!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        keyboardType="email-address"
        autoCapitalize="none"
        value={usuario.email}
        onChangeText={(value) => setUsuario({ ...usuario, email: value })}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          placeholderTextColor="#000"
          secureTextEntry={!usuario.showPassword}
          value={usuario.senha}
          onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() =>
            setUsuario({ ...usuario, showPassword: !usuario.showPassword })
          }
        >
          <Ionicons
            name={usuario.showPassword ? "eye" : "eye-off"}
            size={22}
            color="grey"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Não possui login? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.linkHighlight}>Cadastre-se!</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 5 }}
      >
        <Text style={[styles.linkHighlight, { fontSize: 14 }]}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Logar</Text>
      </TouchableOpacity>
      <RedefinirSenhaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={(msg) => mostrarSnackbar(msg)}
        onError={(msg) => mostrarSnackbar(msg)}
      />

      {/* Snackbar arredondado */}
      <Portal>
        <Snackbar visible={snackbarVisible} message={snackbarMessage} />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 20,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "sans-serif-light",
  },
  subtitle: {
    fontSize: 17,
    color: "#000",
    marginBottom: 60,
    textAlign: "center",
    fontFamily: "sans-serif-light",
    marginTop: 10,
  },
  loginText: {
    fontSize: 25,
    color: "#000",
    marginBottom: 16,
    marginTop: 50,
  },
  input: {
    width: "84%",
    backgroundColor: "#B0B8D4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#000",
  },
  button: {
    width: "30%",
    backgroundColor: "#6B7A99",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#000", fontSize: 15, fontWeight: "500" },
  linkContainer: { flexDirection: "row", marginTop: 10 },
  linkText: { color: "#000", fontSize: 14 },
  linkHighlight: { color: "#D98282", fontSize: 14 },
  eyeIcon: { padding: 5 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "84%",
    backgroundColor: "#B0B8D4",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
});
