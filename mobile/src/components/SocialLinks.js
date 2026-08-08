import React from "react";
import { View, TouchableOpacity, Linking, StyleSheet } from "react-native";
import LinkedinIcon from "./icons/LinkedinIcon";
import GithubIcon from "./icons/GithubIcon";

export default function SocialLinks({ linkedin, github }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(linkedin)} accessibilityLabel="LinkedIn">
        <LinkedinIcon size={18} color="#ffffff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(github)} accessibilityLabel="GitHub">
        <GithubIcon size={18} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 12, marginVertical: 16 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6a5cff",
    alignItems: "center",
    justifyContent: "center",
  },
});
