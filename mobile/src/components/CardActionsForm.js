import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import { EMAIL_PATTERN, todayISODate } from "../utils/vcard";

function dateToISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Butonlar henüz bir webhook'a bağlı değil (web sürümüyle aynı durum);
// gönderim setTimeout ile simüle edilir ve ilgili buton kısa süreliğine
// kilitlenir, böylece art arda tıklanarak birden fazla kez tetiklenmesi
// engellenir.
export default function CardActionsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState({ card: false, meeting: false });
  const [consent, setConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  function validateContact() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Lütfen adınızı girin.";
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    }
    if (!consent) {
      nextErrors.consent = "Lütfen KVKK Aydınlatma Metni'ni onaylayın.";
    }
    return nextErrors;
  }

  function handleSaveCard() {
    const nextErrors = validateContact();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }
    setSubmitting((prev) => ({ ...prev, card: true }));
    setTimeout(() => {
      setSubmitting((prev) => ({ ...prev, card: false }));
      setStatus({ action: "card", state: "success" });
    }, 600);
  }

  function handleRequestMeeting() {
    const nextErrors = validateContact();
    if (!date) {
      nextErrors.date = "Lütfen bir tarih seçin.";
    } else if (dateToISODate(date) < todayISODate()) {
      nextErrors.date = "Geçmiş bir tarih seçemezsiniz.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }
    setSubmitting((prev) => ({ ...prev, meeting: true }));
    setTimeout(() => {
      setSubmitting((prev) => ({ ...prev, meeting: false }));
      setStatus({ action: "meeting", state: "success" });
    }, 600);
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>İsim</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="ornek@eposta.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tarih</Text>
        <TouchableOpacity
          style={[styles.input, errors.date && styles.inputError]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={date ? styles.dateText : styles.datePlaceholder}>
            {date ? dateToISODate(date) : "Tarih seçin"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        {errors.date && <Text style={styles.error}>{errors.date}</Text>}
      </View>

      <View style={styles.consentField}>
        <TouchableOpacity style={styles.consentRow} onPress={() => setConsent((prev) => !prev)}>
          <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
            {consent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            Kişisel verilerimin ulaşım/toplantı talebimin değerlendirilmesi amacıyla işlenmesini{" "}
            <Text style={styles.consentLink} onPress={() => setShowPolicy(true)}>
              KVKK Aydınlatma Metni
            </Text>{" "}
            kapsamında kabul ediyorum.
          </Text>
        </TouchableOpacity>
        {errors.consent && <Text style={styles.error}>{errors.consent}</Text>}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, submitting.card && styles.buttonDisabled]}
          onPress={handleSaveCard}
          disabled={submitting.card}
        >
          <Text style={styles.buttonText}>{submitting.card ? "Gönderiliyor..." : "Kartı Kaydet"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, submitting.meeting && styles.buttonDisabled]}
          onPress={handleRequestMeeting}
          disabled={submitting.meeting}
        >
          <Text style={styles.buttonText}>{submitting.meeting ? "Gönderiliyor..." : "Toplantı Talep Et"}</Text>
        </TouchableOpacity>
      </View>

      {status && status.action === "card" && status.state === "success" && (
        <Text style={styles.statusSuccess}>Kart kaydedildi, teşekkürler!</Text>
      )}
      {status && status.action === "meeting" && status.state === "success" && (
        <Text style={styles.statusSuccess}>Toplantı talebiniz alındı, teşekkürler!</Text>
      )}

      <PrivacyPolicyModal open={showPolicy} onClose={() => setShowPolicy(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginVertical: 8 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: "#3a3560", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#eceaf6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#1f1b3d",
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  inputError: { borderColor: "#e5484d" },
  dateText: { color: "#1f1b3d", fontSize: 14 },
  datePlaceholder: { color: "#8a86a3", fontSize: 14 },
  error: { color: "#e5484d", fontSize: 12, marginTop: 4 },
  consentField: { marginBottom: 16 },
  consentRow: { flexDirection: "row", alignItems: "flex-start" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6a5cff",
    marginRight: 8,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#6a5cff" },
  checkmark: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
  consentText: { flex: 1, fontSize: 12, color: "#3a3560", lineHeight: 18 },
  consentLink: { color: "#6a5cff", fontWeight: "700", textDecorationLine: "underline" },
  buttons: { gap: 10, marginTop: 4 },
  button: { backgroundColor: "#6a5cff", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  statusSuccess: { color: "#1f8a4c", fontSize: 13, marginTop: 10, textAlign: "center" },
});
