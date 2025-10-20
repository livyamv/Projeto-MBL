// PERFIL.JS - Corrigido e limpo

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [evento, setEvento] = useState(null);

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
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
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
      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
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
      const token = await SecureStore.getItemAsync("token");

      if (!id || !token) {
        Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
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

      Alert.alert("Sucesso", response.data.message || "Perfil atualizado!");
      setSenha("");
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível atualizar o perfil."
      );
    }
  };

  const excluirConta = async () => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const userId = await SecureStore.getItemAsync("userId");
            const response = await api.deleteUser(userId);
            Alert.alert("Sucesso", response.data.message || "Conta excluída!");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          } catch (error) {
            console.log(error.response?.data || error);
            Alert.alert(
              "Erro",
              error.response?.data?.message ||
                "Não foi possível excluir a conta."
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1f2a44", "#3A5BA0", "#6f87c7"]}
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
        <Feather name="settings" size={24} color="#fff" />
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
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              resizeMode: "cover",
            }}
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

      <View style={styles.botoesBox}>
        <TouchableOpacity style={styles.botao} onPress={atualizarPerfil}>
          <Text style={styles.textoBotao}>Salvar alterações</Text>
          <Feather name="check" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: "Login" }] })
          }
        >
          <Text style={styles.textoBotao}>Sair</Text>
          <Feather name="log-out" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.excluirConta} onPress={excluirConta}>
        <Text style={styles.excluirTexto}>Excluir conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e5e5e5", alignItems: "center" },
  header: {
    width: "100%",
    height: 160,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  fotoPerfil: {
    width: 130,
    height: 130,
    borderRadius: 20,
    marginTop: -65,
    borderWidth: 3,
    borderColor: "#fff",
  },
  form: { width: "85%", marginTop: 105 },
  input: {
    backgroundColor: "#fff",
    padding: 19,
    borderRadius: 12,
    marginBottom: 35,
    borderWidth: 1,
    fontSize: 16,
    elevation: 2,
    borderColor: "black",
  },
  botoesBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 25,
  },
  botao: {
    flexDirection: "row",
    backgroundColor: "#5a6fa1",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 15,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
  excluirConta: {
    marginTop: 25,
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  excluirTexto: { color: "red", fontSize: 16, fontWeight: "bold" },
});
