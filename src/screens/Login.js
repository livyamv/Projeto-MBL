import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState({
    cpf: "",
    senha: "",
    showPassword: false,
  });

  async function handleLogin() {
    await api.postLogin(usuario).then(
      (response) => {
        Alert.alert("Sucesso", response.data.message);
        navigation.navigate("ListaSalas");
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo ao aplicativo</Text>

      {/* Imagem e texto lado a lado */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/iconLoc.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Glimp</Text>
      </View>

      <Text style={styles.subtitle}>
        Grandes Lugares Inspiram Momentos Perfeitos
      </Text>

      <Text style={styles.loginText}>Faça seu login!</Text>

      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#555"
        value={usuario.cpf}
        onChangeText={(value) => setUsuario({ ...usuario, cpf: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#555"
        secureTextEntry={!usuario.showPassword}
        value={usuario.senha}
        onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
      />

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Não possui login? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.linkHighlight}>Cadastre-se!</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Logar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6e",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  welcomeText: {
    fontSize: 30,
    color: "#000",
    marginTop: 50, // espaço do topo da tela
    marginBottom: 10, // espaço entre o título e a logo
    textAlign: "center",
    fontFamily: "sans-serif-light"
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoImage: {
    width: 30,
    height: 70,
    resizeMode: "cover",
    marginRight: 5,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    fontFamily: "sans-serif"
  },
  subtitle: {
    fontSize: 18,
    color: "#000000ff",
    marginBottom: 205,
    textAlign: "center",
    fontFamily: "sans-serif-light"
  },
  loginText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
    marginBottom: 12,
  },
  input: {
    width: "80%",
    backgroundColor: "#B0B8D4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#000",
  },
  button: {
    width: "40%",
    backgroundColor: "#6B7A99",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#040404ff",
    fontSize: 14,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  linkText: {
    color: "#000",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#D98282",
    fontSize: 15,
  },
});
