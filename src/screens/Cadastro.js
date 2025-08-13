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

export default function Cadastro() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    cpf: "",
    email: "",
    password: "",
    name: "",
  });

  async function handleCadastro() {
    // Aqui vai sua requisição para cadastro
    Alert.alert("Cadastro", "Usuário cadastrado com sucesso!");
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/iconLoc.png")} // Coloque o caminho correto da sua logo
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Grandes Lugares Inspiram Momentos Perfeitos.</Text>

      {/* Título */}
      <Text style={styles.title}>Faça seu cadastro!</Text>

      {/* Campos */}
      <TextInput
        style={styles.input}
        placeholder="Nome:"
        placeholderTextColor="#000"
        value={user.name}
        onChangeText={(value) => setUser({ ...user, name: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF:"
        placeholderTextColor="#000"
        value={user.cpf}
        onChangeText={(value) => setUser({ ...user, cpf: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email:"
        placeholderTextColor="#000"
        value={user.email}
        onChangeText={(value) => setUser({ ...user, email: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha:"
        placeholderTextColor="#000"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => setUser({ ...user, password: value })}
      />

      {/* Link para Login */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Logar!</Text>
        </TouchableOpacity>
      </View>

      {/* Botão */}
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
    paddingTop: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    backgroundColor: "#AEB8D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
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
});
