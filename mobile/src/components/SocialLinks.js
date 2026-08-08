import React from "react";
import { View, TouchableOpacity, Linking, StyleSheet } from "react-native";
import LinkedinIcon from "./icons/LinkedinIcon";
import GithubIcon from "./icons/GithubIcon";

export default function SocialLinks({ linkedin, github }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(linkedin)} accessibilityLabel="LinkedIn">
        <LinkedinIcon size={18} color="#1fb6c9" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(github)} accessibilityLabel="GitHub">
        <GithubIcon size={18} color="#1fb6c9" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 26 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f7f8",
    alignItems: "center",
    justifyContent: "center",
  },
});
