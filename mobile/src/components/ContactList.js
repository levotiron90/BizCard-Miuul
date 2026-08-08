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
  list: { gap: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f1ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  icon: { marginRight: 12 },
  label: { color: "#3a3560", fontSize: 14, flexShrink: 1 },
});
