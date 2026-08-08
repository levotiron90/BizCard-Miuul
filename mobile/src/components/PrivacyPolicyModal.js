import React from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import privacyPolicy from "../data/privacy";

export default function PrivacyPolicyModal({ open, onClose }) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>KVKK Aydınlatma Metni</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Kapat">
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            {privacyPolicy.sections.map((section) => (
              <View key={section.heading} style={styles.section}>
                <Text style={styles.heading}>{section.heading}</Text>
                {section.body.map((paragraph, index) => (
                  <Text key={index} style={styles.paragraph}>{paragraph}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(13,27,52,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#ffffff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "80%", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700", color: "#1f1b3d" },
  close: { fontSize: 24, color: "#8a86a3" },
  body: { marginBottom: 8 },
  section: { marginBottom: 16 },
  heading: { fontSize: 14, fontWeight: "700", color: "#3a3560", marginBottom: 6 },
  paragraph: { fontSize: 13, color: "#3a3560", lineHeight: 19, marginBottom: 6 },
});
