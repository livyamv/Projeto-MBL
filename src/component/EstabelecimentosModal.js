import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Linking,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import api from "../axios/axios";

export default function EstabelecimentosModal({ visible, onClose, item }) {
  const [favorito, setFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(null);
  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState(0);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingAval, setLoadingAval] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !item?.place_id) return;
    let mounted = true;

    const fetchFavorito = async () => {
      try {
        setLoadingFav(true);
        const res = await api.getFavoritos();
        if (!mounted) return;
        const favoritosArray = Array.isArray(res.data.favoritos)
          ? res.data.favoritos
          : Array.isArray(res.data)
          ? res.data
          : [];
        const fav = favoritosArray.find(
          (f) => f.google_place_id === item.place_id
        );
        if (fav) {
          setFavorito(true);
          setFavoritoId(fav.id_favorito);
        } else {
          setFavorito(false);
          setFavoritoId(null);
        }
      } finally {
        if (mounted) setLoadingFav(false);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        setLoadingAval(true);
        const r = await api.getAvaliacoesPorLocal(item.place_id);
        setAvaliacoes(r.data.avaliacoes || []);
        if (r.data.media_notas !== undefined) setMediaNotas(r.data.media_notas);
      } finally {
        if (mounted) setLoadingAval(false);
      }
    };

    fetchFavorito();
    fetchAvaliacoes();

    return () => {
      mounted = false;
    };
  }, [visible, item]);

  const abrirSite = () => {
    if (item?.site) Linking.openURL(item.site).catch(() => {});
  };

  const toggleFavorito = async () => {
    if (!item?.place_id)
      return Alert.alert("Erro", "ID do estabelecimento não encontrado.");

    try {
      setLoadingFav(true);
      if (!favorito) {
        const payload = {
          google_place_id: item.place_id,
          nome_estabelecimento: item.nome,
          endereco: item.endereco,
        };
        const resp = await api.addFavorito(payload);
        setFavorito(true);
        setFavoritoId(resp.data?.id_favorito ?? null);
      } else {
        let idToRemove = favoritoId;
        if (!idToRemove) {
          const resp = await api.getFavoritos();
          const favs = Array.isArray(resp.data.favoritos)
            ? resp.data.favoritos
            : Array.isArray(resp.data)
            ? resp.data
            : [];
          const found = favs.find((f) => f.google_place_id === item.place_id);
          idToRemove = found?.id_favorito ?? null;
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
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
    } finally {
      setLoadingFav(false);
    }
  };

  const handleCreate = async () => {
    if (!comentario.trim())
      return Alert.alert("Atenção", "Digite um comentário");
    if (nota === 0) return Alert.alert("Atenção", "Escolha uma nota");

    try {
      setSubmitting(true);
      const avaliacao = {
        google_place_id: item.place_id,
        comentario: comentario.trim(),
        nota,
        nome_estabelecimento: item.nome,
        endereco: item.endereco,
      };
      await api.createAvaliacao(avaliacao);
      setComentario("");
      setNota(0);
      const r = await api.getAvaliacoesPorLocal(item.place_id);
      setAvaliacoes(r.data.avaliacoes || []);
      if (r.data.media_notas !== undefined) setMediaNotas(r.data.media_notas);
      Alert.alert("Sucesso", "Comentário enviado!");
    } catch {
      Alert.alert("Erro", "Não foi possível enviar o comentário.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.containerWrapper}
        >
          <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.nome}
                </Text>
                {item.categoria && (
                  <Text style={styles.category}>{item.categoria}</Text>
                )}
              </View>
              <Pressable
                onPress={toggleFavorito}
                style={styles.heartWrap}
                disabled={loadingFav}
              >
                {loadingFav ? (
                  <ActivityIndicator size="small" color="#e91e63" />
                ) : (
                  <AntDesign
                    name="heart"
                    size={22}
                    color={favorito ? "#e91e63" : "#C0C0C0"}
                  />
                )}
              </Pressable>
            </View>

            {/* Corpo rolável */}
            <View style={styles.body}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
              >
                <View style={styles.infoRow}>
                  <Text style={styles.infoTitle}>Endereço</Text>
                  <Text style={styles.infoValue}>{item.endereco || "—"}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTitle}>Telefone</Text>
                  <Text style={styles.infoValue}>{item.telefone || "—"}</Text>
                </View>

                <View style={styles.scheduleSection}>
                  <Text style={styles.sectionTitle}>Horários</Text>
                  {item.horarios && item.horarios.length > 0 ? (
                    <View style={styles.scheduleContainer}>
                      {item.horarios.map((horario, index) => (
                        <View key={index} style={styles.scheduleBox}>
                          <Text style={styles.scheduleText}>{horario}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.infoValue}>Não informado</Text>
                  )}
                </View>

                {item.site && (
                  <Pressable onPress={abrirSite} style={styles.linkRow}>
                    <Text style={styles.linkText}>{item.site}</Text>
                  </Pressable>
                )}

                {item.latitude && item.longitude ? (
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: parseFloat(item.latitude),
                          longitude: parseFloat(item.longitude),
                        }}
                        title={item.nome}
                        description={item.endereco}
                      />
                    </MapView>
                  </View>
                ) : (
                  <Text style={styles.infoValue}>Mapa não disponível</Text>
                )}

                <View style={styles.divider} />

                <View style={styles.ratingHeader}>
                  <Text style={styles.sectionTitle}>Avaliação</Text>
                  <Text style={styles.avgText}>
                    {mediaNotas !== null
                      ? mediaNotas.toFixed(1)
                      : "Sem avaliação"}
                  </Text>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                  Comentários
                </Text>
                {loadingAval ? (
                  <ActivityIndicator style={{ marginVertical: 10 }} />
                ) : avaliacoes.length === 0 ? (
                  <Text style={styles.emptyComments}>
                    Seja o primeiro a avaliar.
                  </Text>
                ) : (
                  avaliacoes.map((a) => (
                    <View key={a.id_avaliacao} style={styles.commentBox}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>
                          {a.usuario || "Anônimo"}
                        </Text>
                        <Text style={styles.commentRating}>⭐ {a.nota}/5</Text>
                      </View>
                      <Text style={styles.commentText}>{a.comentario}</Text>
                    </View>
                  ))
                )}

                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                  Deixe sua avaliação:
                </Text>

                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setNota(s)}
                      activeOpacity={0.7}
                      style={styles.starButton}
                    >
                      <Text
                        style={[styles.star, s <= nota && styles.starActive]}
                      >
                        {s <= nota ? "★" : "☆"}
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
                  editable={!submitting}
                />

                <TouchableOpacity
                  style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                  onPress={handleCreate}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      ENVIAR COMENTÁRIO
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Botão fixo no rodapé */}
            <View style={styles.footer}>
              <Pressable onPress={onClose} style={styles.closeBtnBottom}>
                <Text style={styles.closeTextBottom}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  containerWrapper: { width: "100%", alignItems: "center" },
  container: {
    width: "92%",
    height: "88%",
    backgroundColor: "#f8f9fb",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f3",
  },
  headerLeft: { flex: 1, paddingRight: 8 },
  name: { fontSize: 18, fontWeight: "700", color: "#233044" },
  category: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  heartWrap: { backgroundColor: "#fff", padding: 8, marginRight: 8 },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  infoRow: { marginBottom: 10 },
  infoTitle: { fontSize: 13, color: "#6b7280", fontWeight: "600" },
  infoValue: { marginTop: 4, fontSize: 15, color: "#111827" },
  linkRow: { marginTop: 6, marginBottom: 10 },
  linkText: { color: "#2563eb", textDecorationLine: "underline" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  scheduleSection: { marginBottom: 15 },
  scheduleContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  scheduleBox: {
    backgroundColor: "#E8ECF8",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  scheduleText: { fontSize: 13, color: "#2c3e50", fontWeight: "500" },
  mapContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    height: 180,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: { flex: 1 },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avgText: { fontSize: 14, color: "#374151", fontWeight: "600" },
  emptyComments: { color: "#6b7280", marginVertical: 8 },
  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eef2f6",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentUser: { fontWeight: "700", color: "#111827" },
  commentRating: { color: "#f59e0b", fontWeight: "700" },
  commentText: { color: "#374151" },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  starButton: { marginHorizontal: 4 },
  star: { fontSize: 30, color: "#ccc" },
  starActive: { color: "#f59e0b" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#5A6FA1",
    borderRadius: 10,
    paddingVertical: 12,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 10,
    backgroundColor: "#fff",
  },
  closeBtnBottom: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 10,
  },
  closeTextBottom: {
    textAlign: "center",
    fontWeight: "600",
    color: "#374151",
    fontSize: 15,
  },
});
