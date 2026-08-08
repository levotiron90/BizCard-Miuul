import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
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
      <View style={styles.header}>
        <Text style={styles.company}>{person.company}</Text>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.title}>{person.title}</Text>
      </View>

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
  header: { backgroundColor: "#0d1b34", paddingVertical: 28, paddingHorizontal: 24, alignItems: "center" },
  company: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  name: { color: "#ffffff", fontSize: 20, fontWeight: "700", marginTop: 6, textAlign: "center" },
  title: {
    color: "#4fd4e0",
    fontSize: 12.5,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 4,
    textAlign: "center",
  },
  body: { padding: 24 },
  divider: { height: 1, backgroundColor: "#e6ebf0", marginVertical: 20 },
  footer: { paddingVertical: 14, alignItems: "center", backgroundColor: "#0d1b34" },
  footerText: { color: "#ffffff", fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
});
