// components/RedefinirSenhaModal.js
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

export default function RedefinirSenhaModal({ visible, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = enviar email, 2 = redefinir senha
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviarCodigo = async () => {
    if (!email.trim()) return Alert.alert("Erro", "Informe o email.");
    setLoading(true);
    try {
      await api.solicitarRedefinicaoSenha(email.trim().toLowerCase());
      Alert.alert("Sucesso", `Código enviado para ${email}`);
      setStep(2);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", err.response?.data?.error || "Falha ao enviar código");
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async () => {
    if (!codigo.trim() || !novaSenha.trim()) {
      return Alert.alert("Erro", "Todos os campos são obrigatórios.");
    }
    setLoading(true);
    try {
      await api.resetarSenha(email.trim().toLowerCase(), codigo, novaSenha);
      Alert.alert("Sucesso", "Senha redefinida com sucesso!");
      setEmail("");
      setCodigo("");
      setNovaSenha("");
      setStep(1);
      onClose();
      onSuccess();
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Erro",
        err.response?.data?.error || "Código inválido ou expirado"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {step === 1 ? (
            <>
              <Text style={styles.title}>Redefinir Senha</Text>
              <TextInput
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleEnviarCodigo}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Enviando..." : "Enviar Código"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Digite o Código e Nova Senha</Text>
              <TextInput
                placeholder="Código"
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Nova Senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleRedefinirSenha}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setStep(1);
              setEmail("");
              setCodigo("");
              setNovaSenha("");
              onClose();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
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