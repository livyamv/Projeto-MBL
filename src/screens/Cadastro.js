import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";
import Logo from "../component/logo";
import CodigoModal from "../component/CodigoModal";
import Snackbar from "../component/Snackbar"; // import do Snackbar

export default function Cadastro() {
  const navigation = useNavigation();

  const [usuario, setUsuario] = useState({
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    nome: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModalCodigo, setShowModalCodigo] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const mostrarSnackbar = (mensagem, tempo = 1500) => {
    setSnackbarMessage(mensagem);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), tempo);
  };

  async function handleCadastro() {
    if (usuario.senha !== usuario.confirmarSenha) {
      mostrarSnackbar("As senhas não coincidem!");
      return;
    }

    try {
      await api.post("/user", {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        confirmarSenha: usuario.confirmarSenha,
        cpf: usuario.cpf,
      });

      setShowModalCodigo(true); // abre modal
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      mostrarSnackbar(errorMessage);
      console.log("Erro no cadastro:", error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <Logo />
        </View>

        <Text style={styles.subtitle}>
          Grandes Lugares Inspiram Momentos Perfeitos.
        </Text>

        <Text style={styles.title}>Faça seu cadastro!</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#000"
          value={usuario.nome}
          onChangeText={(value) => setUsuario({ ...usuario, nome: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#000"
          value={usuario.cpf}
          onChangeText={(value) => setUsuario({ ...usuario, cpf: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000"
          value={usuario.email}
          onChangeText={(value) => setUsuario({ ...usuario, email: value })}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#000"
            secureTextEntry={!showPassword}
            value={usuario.senha}
            onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar Senha"
            placeholderTextColor="#000"
            secureTextEntry={!showConfirmPassword}
            value={usuario.confirmarSenha}
            onChangeText={(value) =>
              setUsuario({ ...usuario, confirmarSenha: value })
            }
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Logar!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* Modal para inserir código */}
        <CodigoModal
          visible={showModalCodigo}
          email={usuario.email}
          onClose={() => setShowModalCodigo(false)}
          onSuccess={() => navigation.navigate("Login")}
        />

        {/* Snackbar */}
        <Snackbar visible={snackbarVisible} message={snackbarMessage} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 50,
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
    width: "70%",
    backgroundColor: "#AEB8D1",
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
