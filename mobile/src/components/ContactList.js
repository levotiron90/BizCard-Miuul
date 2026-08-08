import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

export default function ContactList({ items }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.href}
          style={styles.item}
          onPress={() => Linking.openURL(item.href)}
        >
          <View style={styles.icon}>{item.icon}</View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e6f7f8",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: "#33404f", fontSize: 14.5, flexShrink: 1 },
});
