import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";
import Logo from "../component/logo";

export default function Cadastro() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState({
    cpf: "",
    email: "",
    senha: "",
    nome: "",
    showPassword: false,
  });

  // Função para realizar o cadastro
  async function handleCadastro() {
    try {
      const response = await api.postCadastro(usuario);
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Login"); // Navega para a tela de login
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      Alert.alert("Erro", errorMessage);
      console.log("Erro no cadastro:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Logo />
      </View>

      <Text style={styles.subtitle}>
        Grandes Lugares Inspiram Momentos Perfeitos.
      </Text>

      {/* Título */}
      <Text style={styles.title}>Faça seu cadastro!</Text>

      {/* Campos */}
      <TextInput
        style={styles.input}
        placeholder="Nome:"
        placeholderTextColor="#000"
        value={usuario.nome}
        onChangeText={(value) => setUsuario({ ...usuario, nome: value })}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha:"
          placeholderTextColor="#000"
          secureTextEntry={!usuario.showPassword} 
          value={usuario.senha}
          onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
        />
        <TouchableOpacity
          onPress={() =>
            setUsuario({ ...usuario, showPassword: !usuario.showPassword })
          }
        >
          <Ionicons
            name={usuario.showPassword ? "eye" : "eye-off"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

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
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
    fontFamily: "sans-serif-light",
    marginTop: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: "400",
    marginBottom: 20,
    color: "#000",
    fontFamily: "sans-serif-light",
    marginTop: 130,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%", // igual ao input normal
    backgroundColor: "#AEB8D1", // mesma cor dos outros inputs
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
});
