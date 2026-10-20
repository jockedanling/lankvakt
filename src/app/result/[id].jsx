import { StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text>Resultat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
