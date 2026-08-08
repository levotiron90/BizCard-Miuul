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
  overlay: { flex: 1, backgroundColor: "rgba(13,27,52,0.6)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#ffffff", borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "80%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#0d1b34",
  },
  title: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  close: { fontSize: 22, color: "#ffffff", lineHeight: 22 },
  body: { padding: 20 },
  section: { marginBottom: 16 },
  heading: { fontSize: 13.5, fontWeight: "700", color: "#0d1b34", marginBottom: 6 },
  paragraph: { fontSize: 13, color: "#5a6b7a", lineHeight: 19.5, marginBottom: 6 },
});
