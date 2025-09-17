import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Linking, Alert, TextInput, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../axios/axios"; 

export default function EstabelecimentosModal({ visible, onClose, item, userToken, id_usuario }) {
  const [favorito, setFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [comentario, setComentario] = useState("");

  // Buscar favoritos
  useEffect(() => {
    if (!item) return;

    const fetchFavorito = async () => {
      try {
        const response = await api.getFavoritos();
        const fav = response.data.find(f => f.id_estabelecimento === item.id);
        if (fav) {
          setFavorito(true);
          setFavoritoId(fav.id_favorito);
        } else {
          setFavorito(false);
          setFavoritoId(null);
        }
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error.response?.data || error.message);
      }
    };

    fetchFavorito();
  }, [item]);

  // Buscar avaliações
  const fetchAvaliacoes = async () => {
    if (!item) return;
    try {
      const res = await api.getAvaliacoes(item.id); // 👈 rota centralizada
      setAvaliacoes(res.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (item) fetchAvaliacoes();
  }, [item]);

  // Criar comentário
  const handleCreate = async () => {
    if (!comentario.trim()) return Alert.alert("Atenção", "Digite um comentário");
    try {
      await api.createAvaliacao({ id_usuario, google_place_id: item.id, comentario });
      setComentario("");
      fetchAvaliacoes();
    } catch (error) {
      console.error("Erro ao criar comentário:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível enviar o comentário.");
    }
  };

  // Deletar comentário
  const handleDelete = async (id_avaliacao) => {
    try {
      await api.deleteAvaliacao(id_avaliacao); // 👈 rota centralizada
      fetchAvaliacoes();
    } catch (error) {
      console.error("Erro ao deletar comentário:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível deletar o comentário.");
    }
  };

  const abrirSite = () => {
    if (item.site) Linking.openURL(item.site).catch(err => console.error("Erro ao abrir site:", err));
  };

  const toggleFavorito = async () => {
    try {
      if (!favorito) {
        const response = await api.addFavorito({ id_estabelecimento: item.id });
        setFavorito(true);
        setFavoritoId(response.data.id_favorito);
      } else {
        await api.removeFavorito(favoritoId);
        setFavorito(false);
        setFavoritoId(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.nome}</Text>
            <Pressable onPress={toggleFavorito}>
              <Icon name={favorito ? "heart" : "heart-o"} size={24} color="#e91e63" />
            </Pressable>
          </View>

          <View style={styles.info}>
            <Text>Endereço: {item.endereco}</Text>
            <Text>Categoria: {item.categoria || "Não informado"}</Text>
            <Text>Telefone: {item.telefone || "Não informado"}</Text>
            <Text>Horários: {item.horarios?.join(", ") || "Não informado"}</Text>
            <Text>
              Sites: {item.site ? <Text style={styles.link} onPress={abrirSite}>{item.site}</Text> : "Não informado"}
            </Text>
            <Text>Avaliação: {item.media_notas ? item.media_notas.toFixed(1) : "Sem nota"}</Text>
          </View>

          <ScrollView style={styles.comentarios}>
            <Text style={styles.comentariosTitle}>Comentários:</Text>
            {avaliacoes.length > 0 
              ? avaliacoes.map((a) => (
                  <View key={a.id_avaliacao} style={styles.comentario}>
                    <Text>Usuário: {a.usuario || "Anônimo"}</Text>
                    <Text>Comentário: {a.comentario}</Text>
                    <Text style={styles.date}>{new Date(a.created_at).toLocaleString()}</Text>
                    {a.id_usuario === id_usuario && (
                      <Button title="Deletar" color="red" onPress={() => handleDelete(a.id_avaliacao)} />
                    )}
                  </View>
                ))
              : <Text>Sem comentários</Text>
            }
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Escreva seu comentário"
            value={comentario}
            onChangeText={setComentario}
          />
          <Button title="Enviar comentário" onPress={handleCreate} />

          <Pressable style={styles.okButton} onPress={onClose}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems:'center'
  },
  container: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    maxHeight: '85%'
  },
  header: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom: 10
  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    flex:1
  },
  info: {
    marginBottom: 15
  },
  link: {
    color: '#1e90ff',
    textDecorationLine:'underline'
  },
  okButton: {
    backgroundColor:'#5a6fa1',
    paddingVertical:8,
    borderRadius:8,
    alignItems:'center',
    marginTop:10
  },
  okText: {
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  comentarios: {
    maxHeight:200,
    marginBottom: 10
  },
  comentariosTitle: {
    fontWeight:'bold',
    marginBottom:5
  },
  comentario: {
    marginBottom:8,
    padding:8,
    backgroundColor:"#fff",
    borderRadius:6
  },
  input: {
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    padding:8,
    marginBottom:8,
    backgroundColor:"#fff"
  },
  date: {
    fontSize:12,
    color:"#666"
  }
});
