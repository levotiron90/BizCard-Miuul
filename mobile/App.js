import React from "react";
import { ScrollView, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProfileCard from "./src/components/ProfileCard";
import person from "./src/data/person";
import siteUrl from "./src/data/site";

export default function App() {
  return (
    <LinearGradient colors={["#eef2f7", "#dbe6f0"]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <ProfileCard person={person} siteUrl={siteUrl} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20 },
});
