import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";

export default function Cadastro() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState({
    cpf: "",
    email: "",
    senha: "",
    nome: "",
  });

  // Função para realizar o cadastro
  async function handleCadastro() {
    try {
      // Chamada para a API de cadastro
      const response = await api.postCadastro(usuario);
      
      // Se o cadastro for bem-sucedido
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Login");  // Navega para a tela de login
    } catch (error) {
      // Exibe erro caso a requisição falhe
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      Alert.alert("Erro", errorMessage);
      console.log("Erro no cadastro:", error);  // Log do erro completo no console
    }
  }

  return (
    <View style={styles.container}>

      {/* Imagem e texto lado a lado */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/iconLoc.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Glimp</Text>
      </View>

      <Text style={styles.subtitle}>Grandes Lugares Inspiram Momentos Perfeitos.</Text>

      {/* Título */}
      <Text style={styles.title}>Faça seu cadastro!</Text>

      {/* Campos */}
      <TextInput
        style={styles.input}
        placeholder="Nome:"
        placeholderTextColor="#000"
        value={usuario.nome}
        onChangeText={(value) => setUsuario({ ...usuario, nme: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF:"
        placeholderTextColor="#000"
        value={usuario.cpf}
        onChangeText={(value) => setUsuario({ ...usuario, cpf: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email:"
        placeholderTextColor="#000"
        value={usuario.email}
        onChangeText={(value) => setUsuario({ ...usuario, email: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        placeholderTextColor="#000"
        secureTextEntry
        value={usuario.senha}
        onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
      />

      {/* Link para Login */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Logar!</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 150,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
    fontFamily: "sans-serif-light"
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "70%",
    backgroundColor: "#AEB8D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#000",
  },
  logoImage: {
    width: 30,
    height: 70,
    resizeMode: "cover",
    marginRight: 5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    fontFamily: "sans-serif"
  },
  loginLink: {
    fontSize: 14,
    color: "#FF7A7A",
  },
  button: {
    backgroundColor: "#6B7E91",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
