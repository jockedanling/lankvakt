import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { StyleSheet, Text, View } from "react-native";

export default function ReasonRow({ number, text }) {
  return (
    <View style={styles.cardard}>
      <View style={styles.circle}>
        <Text>{number}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  text: {
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.accent,
  },
});
