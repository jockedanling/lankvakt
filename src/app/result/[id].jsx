import { assessLink } from "@/analysis/verdict";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const { verdict, reasons } = assessLink(id);

  return (
    <View style={styles.container}>
      <Text>{id}</Text>
      <Text>{verdict}</Text>
      <Text>{reasons.length}</Text>
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
