import { StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text>Skanna</Text>
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
