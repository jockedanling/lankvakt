import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { StyleSheet, Text, View } from "react-native";

export default function ReasonRow({ number, text }) {
  return (
    <View style={styles.card}>
      <View style={styles.circle}>
        <Text style={styles.number}>{number}</Text>
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
  number: {
    ...typography.subhead,
    fontWeight: "600",
    color: colors.surface,
  },
  text: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.accent,
  },
});
