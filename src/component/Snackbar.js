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
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();

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
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 150, useNativeDriver: true }),
      ]).start(() => setShow(false));
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Portal>
      <Pressable
        style={styles.portalOverlay} // sempre fundo escuro
        onPress={onConfirm && onCancel ? onCancel : null}
      >
        <Animated.View
          onTouchStart={(e) => e.stopPropagation()}
          style={[
            styles.snackbarContent,
            {
              opacity,
              transform: [{ scale }],
              // Se houver botões, mantém estilo padrão, senão caixa grande branca
              backgroundColor: "#fff",
              padding: onConfirm && onCancel ? 20 : 30,
              borderRadius: onConfirm && onCancel ? 12 : 15,
              width: onConfirm && onCancel ? "85%" : "90%",
              maxWidth: 450,
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
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)", // fundo escuro
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  snackbarContent: {
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
    marginBottom: 10,
  },
  snackbarMessage: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  snackbarActionsWithMargin: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
    marginTop: 25,
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
