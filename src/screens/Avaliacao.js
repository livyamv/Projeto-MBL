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
import Sidebar from "../component/Sidebar";
import Logo from "../component/logo"; // <-- componente de logo usado aqui
import api from "../axios/axios";

export default function MinhasAvaliacoes({ navigation }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchAvaliacoes = async () => {
    try {
      const response = await api.getAvaliacoesUsuario();
      setAvaliacoes(response.data.avaliacoes || []);
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
        <Icon key={`full-${i}`} name="star" size={20} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half-full" size={20} color="#FFD700" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-o" size={20} color="#FFD700" />
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
      <Text style={styles.reviewTitle}>
        {item.nome_estabelecimento || "Sem nome"}
      </Text>

      {/* ⭐ Nota */}
      {renderStars(item.nota || 0)}

      {/* 💬 Comentário */}
      <Text style={styles.commentText}>
        {item.comentario || "Sem comentário."}
      </Text>

      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id_avaliacao)}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar (overlay quando aberta) */}
      {isSidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            navigation={navigation}
            onLogout={() => console.log("Logout")}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.topBar}>
            <Pressable onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
              <Icon name="bars" size={20} color="#000" />
            </Pressable>

            {/* Usa o componente Logo (ícone + texto) */}
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
          </View>

          <Text style={styles.subtitle}>
            Grandes Lugares Inspiram Momentos Perfeitos.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Minhas Avaliações</Text>

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
    backgroundColor: "#F4F4F4",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 25,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 6,
    marginRight: 8,
  },
  logoWrapper: {
    // garante que o logo fique bem alinhado e não ocupe todo o espaço
    marginLeft: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#5a6fa1",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#444",
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 8,
    fontStyle: "italic",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#5a6fa1",
    borderRadius: 20,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 35,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
    fontSize: 14,
  },
});
