<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
<<<<<<< HEAD
  ScrollView,
  Linking,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import api from "../axios/axios";

export default function EstabelecimentosModal({
  visible,
  onClose,
  item,
  userToken,
  id_usuario,
}) {
  const [favorito, setFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(null);
  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState(0);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingAval, setLoadingAval] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Buscar favoritos do usuário
  useEffect(() => {
    if (!visible || !item || !item.id || !id_usuario) return;

    let mounted = true;
    const fetchFavorito = async () => {
      try {
        setLoadingFav(true);
        const response = await api.getFavoritos();
        if (!mounted) return;
        const fav = response.data.find(
          (f) => f.google_place_id === item.id && f.id_usuario === id_usuario
        );
        if (fav) {
          setFavorito(true);
          setFavoritoId(fav.id_favorito);
        } else {
          setFavorito(false);
          setFavoritoId(null);
        }
      } catch (error) {
        console.error(
          "Erro ao buscar favoritos:",
          error.response?.data || error.message
        );
      } finally {
        if (mounted) setLoadingFav(false);
      }
    };

    fetchFavorito();
    return () => {
      mounted = false;
    };
  }, [visible, item, id_usuario]);

  // Buscar avaliações do lugar
  const fetchAvaliacoes = async () => {
    if (!item || !item.place_id) return;
    try {
      setLoadingAval(true);
      const res = await api.get(`/avaliacoes/${item.place_id}`);
      setAvaliacoes(res.data.avaliacoes || []);
      if (res.data.media_notas !== undefined) {
        setMediaNotas(res.data.media_notas);
      }
    } catch (error) {
      console.error(
        "Erro ao buscar avaliações do lugar:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingAval(false);
    }
  };

  useEffect(() => {
    if (visible && item && item.place_id) fetchAvaliacoes();
  }, [visible, item]);

  // Abrir site do estabelecimento
  const abrirSite = () => {
    if (item?.site)
      Linking.openURL(item.site).catch((err) =>
        console.error("Erro ao abrir site:", err)
      );
  };

  // Adicionar/remover favorito
  const toggleFavorito = async () => {
    try {
      if (!id_usuario) return Alert.alert("Erro", "Usuário não identificado.");
      if (!item?.id)
        return Alert.alert("Erro", "ID do estabelecimento não encontrado.");

      setLoadingFav(true);

      if (!favorito) {
        const payload = {
          id_usuario,
          google_place_id: item.id,
          nome_estabelecimento: item.nome,
          endereco: item.endereco,
        };
        const response = await api.addFavorito(payload);
        setFavorito(true);
        setFavoritoId(response.data?.id_favorito ?? null);
      } else {
        let idToRemove = favoritoId;
        if (!idToRemove) {
          const response = await api.getFavoritos();
          const fav = response.data.find(
            (f) => f.google_place_id === item.id && f.id_usuario === id_usuario
          );
          idToRemove = fav?.id_favorito ?? null;
        }

        if (!idToRemove) {
          setFavorito(false);
          setFavoritoId(null);
          return;
        }

        await api.removeFavorito(idToRemove);
        setFavorito(false);
        setFavoritoId(null);
      }
    } catch (error) {
      console.error(
        "Erro ao atualizar favoritos:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    } finally {
      setLoadingFav(false);
    }
  };

  // Criar comentário
  const handleCreate = async () => {
    if (!userToken) return Alert.alert("Erro", "Usuário não autenticado.");
    if (!comentario.trim())
      return Alert.alert("Atenção", "Digite um comentário");
    if (nota === 0)
      return Alert.alert("Atenção", "Escolha uma nota de 1 a 5 estrelas");

    try {
      setSubmitting(true);
      const avaliacao = {
        id_usuario,
        google_place_id: item.place_id,
        comentario: comentario.trim(),
        nota,
        nome_estabelecimento: item.nome,
        endereco: item.endereco,
      };

      await api.createAvaliacao(avaliacao);

      setComentario("");
      setNota(0);
      fetchAvaliacoes();
      Alert.alert("Sucesso", "Comentário enviado!");
    } catch (error) {
      console.error(
        "Erro ao criar comentário:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível enviar o comentário.");
    } finally {
      setSubmitting(false);
    }
  };
=======
  Linking,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../axios/axios";

export default function EstabelecimentosModal({ visible, onClose, item }) {
  const [loading, setLoading] = useState(false);
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132

  if (!item) return null;

  const abrirSite = () => {
    if (item.site) {
      Linking.openURL(item.site).catch((err) =>
        console.error("Erro ao abrir site:", err)
      );
    }
  };

  const adicionarFavorito = async () => {
    if (!item.place_id) {
      Alert.alert("Erro", "ID do estabelecimento não disponível.");
      return;
    }

    setLoading(true);

    try {
      await api.addFavorito({
        google_place_id: item.place_id,
        nome_estabelecimento: item.nome || "",
        endereco: item.endereco || "",
      });
      Alert.alert("Sucesso", "Adicionado aos favoritos!");
    } catch (error) {
      console.error(
        "Erro ao adicionar favorito:",
        error.response?.data || error
      );
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível adicionar aos favoritos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
<<<<<<< HEAD
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.containerWrapper}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.nome}</Text>
                  <Text style={styles.subtitle}>{item.categoria}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={toggleFavorito}
                >
                  <AntDesign
                    name={favorito ? "heart" : "heart"}
                    size={24}
                    color={favorito ? "#e91e63" : "#C0C0C0"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.body}>
              <ScrollView showsVerticalScrollIndicator={true}>
                <Text style={styles.infoText}>Endereço: {item.endereco}</Text>
                <Text style={styles.infoText}>
                  Telefone: {item.telefone || "Não informado"}
                </Text>
                <Text style={styles.infoText}>
                  Horários: {item.horarios?.join(", ") || "Não informado"}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>Site: </Text>
                  {item.site ? (
                    <Pressable onPress={abrirSite}>
                      <Text style={styles.linkText}>{item.site}</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.infoText}>Não informado</Text>
                  )}
                </View>

                <Text style={styles.infoText}>
                  Avaliação:{" "}
                  {mediaNotas !== null
                    ? mediaNotas.toFixed(1)
                    : "Sem avaliação"}
                </Text>

                <Text style={styles.sectionTitle}>Comentários:</Text>
                {loadingAval ? (
                  <ActivityIndicator />
                ) : (
                  <View>
                    {avaliacoes.map((avaliacao) => (
                      <View
                        key={avaliacao.id_avaliacao}
                        style={styles.commentBox}
                      >
                        <Text style={styles.commentUser}>
                          {avaliacao.usuario || "Anônimo"}
                        </Text>
                        <Text style={styles.commentText}>
                          {avaliacao.comentario}
                        </Text>
                        <Text style={styles.commentRating}>
                          ⭐ {avaliacao.nota}/5
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.sectionTitle}>Deixe sua avaliação:</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setNota(star)}
                      style={styles.starButton}
                    >
                      <Text style={styles.star}>
                        {star <= nota ? "⭐" : "☆"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Escreva seu comentário"
                  value={comentario}
                  onChangeText={setComentario}
                  multiline
                  numberOfLines={4}
                />
                <Button
                  title={submitting ? "Enviando..." : "Enviar comentário"}
                  onPress={handleCreate}
                  disabled={submitting}
                />
              </ScrollView>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
=======
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.nome}</Text>
            <View style={styles.icons}>
              <Pressable onPress={adicionarFavorito} style={styles.iconButton}>
                {loading ? (
                  <ActivityIndicator size="small" color="#e63946" />
                ) : (
                  <Icon name="heart" size={22} color="#e63946" />
                )}
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.info}>
            <Text>Endereço: {item.endereco}</Text>
            <Text>Categoria: {item.categoria || "Não informado"}</Text>
            <Text>Telefone: {item.telefone || "Não informado"}</Text>
            <Text>
              Horários: {item.horarios?.join(", ") || "Não informado"}
            </Text>
            <Text>
              Site:{" "}
              {item.site ? (
                <Text style={styles.link} onPress={abrirSite}>
                  {item.site}
                </Text>
              ) : (
                "Não informado"
              )}
            </Text>
            <Text>
              Avaliação:{" "}
              {item.media_notas ? item.media_notas.toFixed(1) : "Sem nota"}
            </Text>
          </ScrollView>

          <Pressable style={styles.okButton} onPress={onClose}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  containerWrapper: { width: "100%", alignItems: "center" },
  container: {
    width: "90%",
<<<<<<< HEAD
    height: "90%",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    borderWidth: 15,
    borderColor: "rgba(72, 85, 132, 0.80)",
    flexDirection: "column",
  },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleContainer: { flex: 1, alignItems: "center" },
  favoriteButton: { padding: 5, position: "absolute", right: 20, top: 20 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#777" },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 15 },
  infoText: { marginBottom: 10, fontSize: 14 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  linkText: { fontSize: 14, color: "#5A6FA1", textDecorationLine: "underline" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  commentBox: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    elevation: 2,
  },
  commentUser: { fontWeight: "600", marginBottom: 5 },
  commentText: { fontSize: 14, marginBottom: 5, color: "#333" },
  commentRating: { marginBottom: 8 },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  starButton: { marginHorizontal: 10, padding: 5 },
  star: { fontSize: 32 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  closeButton: {
    backgroundColor: "#5A6FA1",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
=======
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 15,
    maxHeight: "85%",
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", flex: 1 },
  icons: { flexDirection: "row", marginLeft: 10 },
  iconButton: { marginHorizontal: 5 },
  info: { marginBottom: 15 },
  link: { color: "#1e90ff", textDecorationLine: "underline" },
  okButton: {
    backgroundColor: "#5a6fa1",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  okText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
});
