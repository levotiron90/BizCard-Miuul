import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { buildVCard, slugify } from "../utils/vcard";

// Contacts izni istemeden (expo-contacts kullanılmıyor) kartviziti
// telefona eklemenin yolu: .vcf dosyasını native paylaşım sayfası
// üzerinden açmak. İzni işletim sisteminin kendi kişiler uygulaması
// yönetir, bu uygulama CONTACTS izni istemez. expo-file-system'in
// SDK 54 ile gelen yeni (File/Directory) API'si cacheDirectory /
// writeAsStringAsync / EncodingType'ı kaldırdığı için bunlar artık
// "expo-file-system/legacy" alt yolundan import ediliyor.
export default function SaveToPhoneSection({ person }) {
  async function handleSave() {
    const vcard = buildVCard(person);
    const filename = `${slugify(person.name)}.vcf`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, vcard, { encoding: FileSystem.EncodingType.UTF8 });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) return;

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/vcard",
      dialogTitle: "Kartviziti Telefonuma Kaydet",
    });
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Kartviziti Telefonuma Kaydet</Text>
      <Text style={styles.desc}>
        Bilgilerimi rehberine ekle, ihtiyacın olduğunda doğrudan bana ulaşabilirsin.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Telefonuma Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { alignItems: "center", marginVertical: 8 },
  title: { fontSize: 15, fontWeight: "700", color: "#0d1b34", marginBottom: 6 },
  desc: { fontSize: 13, color: "#5a6b7a", textAlign: "center", lineHeight: 18, marginBottom: 14 },
  button: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#1fb6c9",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  buttonText: { color: "#1fb6c9", fontWeight: "600", fontSize: 14 },
});
