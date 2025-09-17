import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Linking } from "react-native";

export default function EstabelecimentosModal({ visible, onClose, item }) {
  if (!item) return null;

  const abrirSite = () => {
    if (item.site) Linking.openURL(item.site).catch(err => console.error("Erro ao abrir site:", err));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>{item.nome}</Text>

            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.text}>{item.endereco}</Text>

            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.text}>{item.telefone || "Não informado"}</Text>

            <Text style={styles.label}>Site:</Text>
            {item.site 
              ? <Text style={[styles.text, styles.link]} onPress={abrirSite}>{item.site}</Text>
              : <Text style={styles.text}>Não informado</Text>
            }

            <Text style={styles.label}>Horários:</Text>
            {item.horarios?.length > 0 
              ? item.horarios.map((h, i) => (
                  <Text key={`${item.nome}-horario-${i}`} style={styles.text}>- {h}</Text>
                ))
              : <Text style={styles.text}>Não informado</Text>
            }

            <Text style={styles.label}>Avaliações:</Text>
            {item.avaliacoes?.length > 0 
              ? item.avaliacoes.map((a, i) => (
                  <Text key={`${item.nome}-avaliacao-${i}`} style={styles.text}>
                    - {a.comentario || "Sem comentário"}
                  </Text>
                ))
              : <Text style={styles.text}>Nenhuma avaliação</Text>
            }

            <Text style={styles.label}>Nota Média:</Text>
            <Text style={styles.text}>{item.media_notas ? item.media_notas.toFixed(1) : "Sem nota"}</Text>
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </View>
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
  container: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 2,
    color: "#333",
  },
  link: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#5a6fa1",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
