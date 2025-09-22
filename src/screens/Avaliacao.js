import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Logo from "../component/logo";

export default function Avaliacao() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Logo /> 
        <Text style={styles.subtitle}>
          Grandes Lugares Inspiram Momentos Perfeitos.
        </Text>
      </View>

      {/* Seção Avaliações */}
      <Text style={styles.sectionTitle}>Avaliações:</Text>

      {/* Avaliação principal */}
      <View style={styles.mainReview}>
        <View style={styles.imagePlaceholder}></View>
        <Text style={styles.reviewText}>
          Aqui vai a descrição da avaliação principal.
        </Text>
      </View>

      {/* Outras avaliações */}
      <View style={styles.otherReviews}>
        <View style={styles.smallReview}>
          <View style={styles.imagePlaceholder}></View>
          <Text style={styles.reviewText}>Avaliação 1</Text>
        </View>
        <View style={styles.smallReview}>
          <View style={styles.imagePlaceholder}></View>
          <Text style={styles.reviewText}>Avaliação 2</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center", // garante alinhamento
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  mainReview: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  otherReviews: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallReview: {
    width: "48%",
  },
});
