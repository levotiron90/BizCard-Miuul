import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeSection({ url }) {
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <View style={styles.section}>
      <QRCode value={url} size={132} backgroundColor="#ffffff" color="#0d1b34" />
      <Text style={styles.caption}>Telefonla tarayarak görüntüleyin</Text>
      <Text style={styles.domain}>{displayUrl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { alignItems: "center", marginVertical: 8 },
  caption: { fontSize: 12, color: "#8a86a3", marginTop: 10 },
  domain: { fontSize: 13, color: "#3a3560", fontWeight: "600", marginTop: 2 },
});
