import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { buildVCard, slugify } from "../utils/vcard";

// Contacts izni istemeden (expo-contacts kullanılmıyor) kartviziti
// telefona eklemenin yolu: .vcf dosyasını native paylaşım sayfası
// üzerinden açmak. İzni işletim sisteminin kendi kişiler uygulaması
// yönetir, bu uygulama CONTACTS izni istemez.
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
  title: { fontSize: 14, fontWeight: "700", color: "#1f1b3d", marginBottom: 4 },
  desc: { fontSize: 12, color: "#8a86a3", textAlign: "center", marginBottom: 12 },
  button: { backgroundColor: "#f3f1ff", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  buttonText: { color: "#6a5cff", fontWeight: "700", fontSize: 14 },
});
