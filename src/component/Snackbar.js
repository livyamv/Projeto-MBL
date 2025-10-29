// Snackbar.js
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Portal } from "react-native-paper";

export default function Snackbar({ visible, message, onConfirm, onCancel }) {
  const [show, setShow] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Se for snackbar de mensagem simples, fecha automaticamente
      if (!onConfirm && !onCancel) {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
          ]).start(() => setShow(false));
        }, 2500);
      }
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShow(false));
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Portal>
      <Pressable
        style={onConfirm && onCancel ? styles.portalOverlay : styles.portalOverlayCenter}
        onPress={onConfirm && onCancel ? onCancel : null}
      >
        <Animated.View
          onTouchStart={(e) => e.stopPropagation()}
          style={[
            styles.snackbarContent,
            {
              opacity,
              transform: [{ scale }],
              backgroundColor: onConfirm && onCancel ? "#b84d4dff" : "#ccc", // cinza se mensagem simples
            },
          ]}
        >
          {onConfirm && onCancel && <Text style={styles.snackbarTitle}>Confirmação</Text>}
          <Text style={styles.snackbarMessage}>{message}</Text>

          {onConfirm && onCancel && (
            <View style={styles.snackbarActionsWithMargin}>
              <Pressable onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={onConfirm} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Excluir</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Portal>
  );
}

const styles = StyleSheet.create({
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  portalOverlayCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  snackbarContent: {
    borderRadius: 12,
    padding: 25,
    width: "85%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  snackbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  snackbarMessage: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  snackbarActionsWithMargin: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
    marginTop: 20, // distância entre mensagem e botões
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
