// components/CodigoModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../axios/axios";

export default function CodigoModal({ visible, email, onClose, onSuccess }) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    if (!codigo.trim()) {
      Alert.alert("Erro", "Informe o código enviado por e-mail.");
      return;
    }

    setLoading(true);
    try {
        await api.confirmarCodigo({ email, code: codigo });

      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      setCodigo("");
      onClose();
      onSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Código inválido ou expirado";
      Alert.alert("Erro", errorMessage);
      console.log("Erro ao confirmar código:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1 }}> {/* <- adiciona flex:1 aqui */}
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Insira o código enviado por e-mail</Text>
  
            <TextInput
              placeholder="Código"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="numeric"
              style={styles.input}
            />
  
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Confirmando..." : "Confirmar Código"}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCodigo("");
                onClose();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
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
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#6B7E91",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FF7A7A",
    fontSize: 16,
  },
});