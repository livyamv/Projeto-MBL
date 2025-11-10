import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import api from "../axios/axios";
import Snackbar from "./Snackbar";

export default function RedefinirSenhaModal({
  visible,
  onClose,
  onSuccess,
  onError,
}) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  if (!visible) return null; // Não renderiza se não estiver visível

  const handleEnviarCodigo = async () => {
    if (!email.trim()) return onError("Informe o email.");
    setLoading(true);
    try {
      await api.solicitarRedefinicaoSenha(email.trim().toLowerCase());
      onSuccess(`Código enviado para ${email}`);
      setStep(2);
    } catch (err) {
      console.log(err);
      onError(err.response?.data?.error || "Falha ao enviar código");
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async () => {
    if (!codigo.trim() || !novaSenha.trim())
      return onError("Todos os campos são obrigatórios.");
    setLoading(true);
    try {
      await api.resetarSenha(email.trim().toLowerCase(), codigo, novaSenha);
      onSuccess("Senha redefinida com sucesso!");
      setEmail("");
      setCodigo("");
      setNovaSenha("");
      setStep(1);
      onClose();
    } catch (err) {
      console.log(err);
      onError(err.response?.data?.error || "Código inválido ou expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={styles.modalContainer}>
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    zIndex: 10000, // garante estar acima do conteúdo
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
  buttonText: { color: "#fff", fontSize: 16 },
  cancelButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: { color: "#FF7A7A", fontSize: 16 },
});
