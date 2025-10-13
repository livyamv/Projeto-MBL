import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../axios/axios";
import Sidebar from "../component/Sidebar"; // ✅ importe o Sidebar

export default function MinhasAvaliacoes({ navigation }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ controle do modal lateral

  const fetchAvaliacoes = async () => {
    try {
      const response = await api.getAvaliacoesUsuario();
      setAvaliacoes(response.data.avaliacoes || []);
    } catch (error) {
      console.error(
        "Erro ao buscar avaliações:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const renderStars = (nota) => {
    const stars = [];
    const fullStars = Math.floor(nota);
    const hasHalfStar = nota % 1 >= 0.25 && nota % 1 < 0.75;
    const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
    const emptyStars = 5 - totalStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="star" size={20} color="#f1c40f" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half-full" size={20} color="#f1c40f" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-o" size={20} color="#ccc" />
      );
    }

    return <View style={styles.stars}>{stars}</View>;
  };

  const handleDelete = (id_avaliacao) => {
    Alert.alert(
      "Excluir Avaliação",
      "Tem certeza que deseja excluir esta avaliação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteAvaliacao(id_avaliacao);
              setAvaliacoes((prev) =>
                prev.filter((a) => a.id_avaliacao !== id_avaliacao)
              );
            } catch (error) {
              console.error(
                "Erro ao excluir avaliação:",
                error.response?.data || error.message
              );
              Alert.alert("Erro", "Não foi possível excluir a avaliação.");
            }
          },
        },
      ]
    );
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.reviewTitle}>
          {item.nome_estabelecimento || "Sem nome"}
        </Text>

        <Pressable onPress={() => handleDelete(item.id_avaliacao)}>
          <Icon name="trash" size={18} color="#c0392b" />
        </Pressable>
      </View>

      {renderStars(item.nota || 0)}

      <Text style={styles.reviewText}>
        {item.comentario || "Sem comentário."}
      </Text>

      <Text style={styles.reviewDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Sidebar lateral */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        onLogout={() => {
          Alert.alert("Sair", "Deseja realmente sair?", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ]);
        }}
      />

      <ScrollView style={styles.container}>
        {/* 🔹 Cabeçalho estilo Glimp */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            {/* ✅ botão abre o sidebar */}
            <Pressable onPress={() => setSidebarOpen(true)}>
              <Icon name="bars" size={22} color="#000" />
            </Pressable>
            <Text style={styles.logo}>Glimp</Text>
          </View>
          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>

        {/* 🔹 Título */}
        <Text style={styles.sectionTitle}>Minhas Avaliações:</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#5a6fa1"
            style={{ marginTop: 30 }}
          />
        ) : avaliacoes.length === 0 ? (
          <Text style={styles.emptyText}>
            Você ainda não fez nenhuma avaliação.
          </Text>
        ) : (
          <FlatList
            data={avaliacoes}
            keyExtractor={(item) => item.id_avaliacao.toString()}
            renderItem={renderReview}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 28,
    fontFamily: "serif",
    color: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 11,
    color: "#777",
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    marginTop: 25,
    fontSize: 14,
  },
});
