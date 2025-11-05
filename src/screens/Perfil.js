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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { Portal } from "react-native-paper";
import api from "../axios/axios";

const { width, height } = Dimensions.get("window");

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [fotoModalVisible, setFotoModalVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

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
    fecharFotoModal();
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
    fecharFotoModal();
  }

  const abrirFotoModal = () => {
    setFotoModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fecharFotoModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFotoModalVisible(false));
  };

  const atualizarPerfil = async () => {
    try {
      const id = await SecureStore.getItemAsync("userId");
      if (!id) {
        showSnackbar("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const usuarioAtualizado = { id, nome, email };

      if (senhaAtual && novaSenha) {
        usuarioAtualizado.senha_atual = senhaAtual;
        usuarioAtualizado.nova_senha = novaSenha;
      }

      const response = await api.updateUser(usuarioAtualizado);

      if (response.data.message) showSnackbar(response.data.message);

      setSenhaAtual("");
      setNovaSenha("");
      setMostrarCamposSenha(false);
    } catch (error) {
      console.log(error.response?.data || error);
      showSnackbar(
        error.response?.data?.error || "Não foi possível atualizar o perfil."
      );
    }
  };

  const excluirConta = async () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const id = await SecureStore.getItemAsync("userId");
              if (!id) {
                showSnackbar("Erro: usuário não encontrado.");
                return;
              }

              await api.delete(`/user/${id}`);
              await SecureStore.deleteItemAsync("userId");
              await SecureStore.deleteItemAsync("token");
              await SecureStore.deleteItemAsync("fotoPerfil");

              showSnackbar("Conta excluída com sucesso.");
              setTimeout(() => navigation.navigate("Login"), 1500);
            } catch (error) {
              console.log(error.response?.data || error);
              showSnackbar("Não foi possível excluir a conta.");
            }
          },
        },
      ]
    );
  };

  const showSnackbar = (message) => {
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
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setSnackbarVisible(false));
      }, 2500);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#D9D9D9" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

          <TouchableOpacity onPress={abrirFotoModal}>
            <Image
              source={
                fotoPerfil
                  ? { uri: fotoPerfil }
                  : require("../../assets/pessoa.jpg")
              }
              style={styles.fotoPerfil}
            />
          </TouchableOpacity>

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

            <Pressable
              onPress={() => setMostrarCamposSenha(!mostrarCamposSenha)}
            >
              <Text
                style={{
                  color: "#5D6EAA",
                  fontWeight: "600",
                  marginBottom: 10,
                }}
              >
                Alterar senha
              </Text>
            </Pressable>

            {mostrarCamposSenha && (
              <View>
                <TextInput
                  style={styles.input}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  placeholder="Senha atual"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  placeholder="Nova senha"
                  secureTextEntry
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.botao} onPress={atualizarPerfil}>
            <Text style={styles.textoBotao}>Salvar alterações</Text>
            <Feather name="check" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#e74c3c" }]}
            onPress={excluirConta}
          >
            <Text style={styles.textoBotao}>Excluir conta</Text>
            <Feather name="trash-2" size={18} color="#fff" />
          </TouchableOpacity>

          {snackbarVisible && (
            <Portal>
              <Pressable style={styles.portalOverlay}>
                <Animated.View
                  style={[
                    styles.snackbarContent,
                    { opacity, transform: [{ scale }] },
                  ]}
                >
                  <Text style={styles.snackbarMessage}>{snackbarMessage}</Text>
                </Animated.View>
              </Pressable>
            </Portal>
          )}

          {fotoModalVisible && (
            <Portal>
              <Pressable style={styles.overlay} onPress={fecharFotoModal}>
                <Animated.View
                  style={[
                    styles.bottomSheet,
                    { transform: [{ translateY: slideAnim }] },
                  ]}
                >
                  <Text style={styles.sheetTitle}>Foto do Perfil</Text>

                  <Pressable style={styles.sheetButton} onPress={tirarFoto}>
                    <Feather name="camera" size={20} color="#5D6EAA" />
                    <Text style={styles.sheetButtonText}>Tirar foto</Text>
                  </Pressable>

                  <Pressable style={styles.sheetButton} onPress={escolherFoto}>
                    <Feather name="image" size={20} color="#5D6EAA" />
                    <Text style={styles.sheetButtonText}>
                      Escolher da galeria
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.sheetButton, styles.cancelarBtn]}
                    onPress={fecharFotoModal}
                  >
                    <Text
                      style={[styles.sheetButtonText, { color: "#e74c3c" }]}
                    >
                      Cancelar
                    </Text>
                  </Pressable>
                </Animated.View>
              </Pressable>
            </Portal>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
    paddingBottom: 120,
  },
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
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  snackbarContent: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 25,
    width: "88%",
    maxWidth: 420,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  snackbarMessage: {
    color: "#333",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    gap: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sheetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  sheetButtonText: { fontSize: 16, fontWeight: "500", color: "#333" },
  cancelarBtn: { marginTop: 5 },
});