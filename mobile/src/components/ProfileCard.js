import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ContactList from "./ContactList";
import SocialLinks from "./SocialLinks";
import CardActionsForm from "./CardActionsForm";
import SaveToPhoneSection from "./SaveToPhoneSection";
import QRCodeSection from "./QRCodeSection";
import PhoneIcon from "./icons/PhoneIcon";
import MailIcon from "./icons/MailIcon";
import LocationIcon from "./icons/LocationIcon";

export default function ProfileCard({ person, siteUrl }) {
  const locationHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.location)}`;

  const contactItems = [
    { href: person.phoneHref, icon: <PhoneIcon />, label: person.phone },
    { href: person.emailHref, icon: <MailIcon />, label: person.email },
    { href: locationHref, icon: <LocationIcon />, label: person.location },
  ];

  return (
    <View style={styles.card}>
      <LinearGradient colors={["#6a5cff", "#8a6bff", "#5eb8ff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.company}>{person.company}</Text>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.title}>{person.title}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <ContactList items={contactItems} />
        <SocialLinks linkedin={person.linkedin} github={person.github} />
        <View style={styles.divider} />
        <CardActionsForm />
        <View style={styles.divider} />
        <SaveToPhoneSection person={person} />
        <View style={styles.divider} />
        <QRCodeSection url={siteUrl} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Linking.openURL(person.website)}>
          <Text style={styles.footerText}>www.veriendustri.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#ffffff", borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 380 },
  header: { paddingVertical: 24, paddingHorizontal: 20, alignItems: "center" },
  company: { color: "#e6e1ff", fontSize: 12, marginBottom: 6, textAlign: "center" },
  name: { color: "#ffffff", fontSize: 20, fontWeight: "700", marginBottom: 4, textAlign: "center" },
  title: { color: "#e6e1ff", fontSize: 13, textAlign: "center" },
  body: { padding: 20 },
  divider: { height: 1, backgroundColor: "#eceaf6", marginVertical: 18 },
  footer: { paddingVertical: 14, alignItems: "center", backgroundColor: "#f3f1ff" },
  footerText: { color: "#6a5cff", fontSize: 12, fontWeight: "600" },
});
