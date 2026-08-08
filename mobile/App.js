import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, StatusBar } from "react-native";
import ProfileCard from "./src/components/ProfileCard";
import person from "./src/data/person";
import siteUrl from "./src/data/site";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ProfileCard person={person} siteUrl={siteUrl} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#6a5cff" },
  scroll: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20 },
});
