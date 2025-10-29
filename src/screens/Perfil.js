import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { Portal } from "react-native-paper";
import api from "../axios/axios";

const { width } = Dimensions.get("window");

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [evento, setEvento] = useState(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [excluirConfirm, setExcluirConfirm] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("token");
        if (!userId || !token) return;

        const response = await api.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usuario = response.data.user;
        setNome(usuario.nome);
        setEmail(usuario.email);
        setCpf(usuario.cpf);

        if (usuario.fotoPerfil) {
          setFotoPerfil(usuario.fotoPerfil);
          await SecureStore.setItemAsync("fotoPerfil", usuario.fotoPerfil);
        } else {
          const localFoto = await SecureStore.getItemAsync("fotoPerfil");
          if (localFoto) setFotoPerfil(localFoto);
        }

        if (usuario.evento) setEvento(usuario.evento);
      } catch (error) {
        console.log(error.response?.data || error);
        showSnackbar("Não foi possível carregar os dados do usuário.");
      }
    };
    carregarUsuario();
  }, []);

  const atualizarFoto = async (uri) => {
    try {
      setFotoPerfil(uri);
      await SecureStore.setItemAsync("fotoPerfil", uri);

      const userId = await SecureStore.getItemAsync("userId");

      const formData = new FormData();
      formData.append("imagem", {
        uri,
        name: "foto.jpg",
        type: "image/jpeg",
      });
      formData.append("id", userId);

      await api.updateUserWithImage(formData);
      showSnackbar("Foto de perfil atualizada!");
    } catch (error) {
      console.log(error.response?.data || error);
      showSnackbar("Não foi possível atualizar a foto.");
    }
  };

  async function escolherFoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await atualizarFoto(uri);
    }
  }

  async function tirarFoto() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await atualizarFoto(uri);
    }
  }

  function escolherOpcaoFoto() {
    Alert.alert("Foto de Perfil", "Escolha uma opção", [
      { text: "Galeria", onPress: escolherFoto },
      { text: "Câmera", onPress: tirarFoto },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  const atualizarPerfil = async () => {
    try {
      const id = await SecureStore.getItemAsync("userId");
      if (!id) {
        showSnackbar("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const usuarioAtualizado = { id, nome, email };
      if (senha) usuarioAtualizado.senha = senha;

      const response = await api.updateUser(usuarioAtualizado);

      if (response.data.token) {
        await SecureStore.setItemAsync("token", response.data.token);
      }

      if (response.data.user) {
        setNome(response.data.user.nome || nome);
        setEmail(response.data.user.email || email);
      }

      showSnackbar(response.data.message || "Perfil atualizado!");
      setSenha("");
    } catch (error) {
      console.log(error.response?.data || error);
      showSnackbar(
        error.response?.data?.message || "Não foi possível atualizar o perfil."
      );
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const confirmarExclusao = () => {
    setExcluirConfirm(true);
    showSnackbar("Tem certeza que deseja excluir sua conta?", true);
  };

  const excluirConta = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      await api.deleteUser(userId);
      showSnackbar("Conta excluída com sucesso!");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      console.log(error.response?.data || error);
      showSnackbar(
        error.response?.data?.message || "Não foi possível excluir a conta."
      );
    } finally {
      setExcluirConfirm(false);
      setSnackbarVisible(false);
    }
  };

  const showSnackbar = (message, confirm = false) => {
    setExcluirConfirm(confirm);
    setSnackbarMessage(message);
    setSnackbarVisible(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!confirm) {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
          ]).start(() => setSnackbarVisible(false));
        }, 2500);
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5D6EAA", "#8F9AAC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <AntDesign
          name="left"
          size={24}
          color="#fff"
          onPress={() => navigation.navigate("Home")}
        />
      </LinearGradient>

      <TouchableOpacity onPress={escolherOpcaoFoto}>
        <Image
          source={
            fotoPerfil
              ? { uri: fotoPerfil }
              : require("../../assets/pessoa.jpg")
          }
          style={styles.fotoPerfil}
        />
      </TouchableOpacity>

      {evento?.id_evento && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image
            source={{
              uri: `http://192.168.0.100:3000/api/v1/evento/imagem/${evento.id_evento}`,
            }}
            style={{ width: 80, height: 80, borderRadius: 10, resizeMode: "cover" }}
          />
          <Text style={{ marginTop: 5, fontSize: 14 }}>Imagem do evento</Text>
        </View>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={cpf}
          placeholder="CPF"
          keyboardType="numeric"
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={atualizarPerfil}>
        <Text style={styles.textoBotao}>Salvar alterações</Text>
        <Feather name="check" size={18} color="#ffffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.excluirButton} onPress={confirmarExclusao}>
        <Text style={styles.excluirButtonText}>Excluir conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={28} color="gray" />
        </Pressable>
      </View>

      {/* Snackbar */}
      {snackbarVisible && (
        <Portal>
          <Pressable
            style={excluirConfirm ? styles.portalOverlay : styles.portalOverlayCenter}
            onPress={excluirConfirm ? () => setSnackbarVisible(false) : null}
          >
            <Animated.View
              onTouchStart={(e) => e.stopPropagation()}
              style={[styles.snackbarContent, { opacity, transform: [{ scale }] }]}
            >
              <Text style={styles.snackbarMessage}>{snackbarMessage}</Text>

              {excluirConfirm && (
                <View style={styles.snackbarActionsWithMargin}>
                  <Pressable style={styles.cancelButton} onPress={() => setSnackbarVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable style={styles.confirmButton} onPress={excluirConta}>
                    <Text style={styles.confirmButtonText}>Excluir</Text>
                  </Pressable>
                </View>
              )}
            </Animated.View>
          </Pressable>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9D9D9", alignItems: "center" },
  header: {
    width: "100%",
    height: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  fotoPerfil: {
    width: 180,
    height: 180,
    borderRadius: 50,
    marginTop: -65,
    borderWidth: 3,
    borderColor: "#fff",
  },
  form: { width: "85%", marginTop: 105 },
  input: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#BFBFBF",
    fontSize: 16,
  },
  botao: {
    flexDirection: "row",
    backgroundColor: "#5D6EAA",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 15,
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  textoBotao: { color: "#ffffffff", fontSize: 16, fontWeight: "600" },
  excluirButton: {
    backgroundColor: "#C9302C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  excluirButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  footer: { position: "absolute", bottom: 35, right: 25 },
  logoutButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
  },
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  portalOverlayCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  snackbarContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    width: "85%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  snackbarMessage: { color: "#555", fontSize: 15, textAlign: "center", lineHeight: 22 },
  snackbarActionsWithMargin: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: { color: "#555", fontWeight: "bold", fontSize: 16 },
  confirmButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
