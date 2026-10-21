import { assessLink } from "@/analysis/verdict";
import RiskBadge from "@/components/RiskBadge";
import { VERDICT_ADVICE } from "@/domain/verdicts";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const { verdict, reasons } = assessLink(id);

  return (
    <View style={styles.container}>
      <RiskBadge verdict={verdict} />
      <Text style={styles.adviceText}>{VERDICT_ADVICE[verdict]}</Text>
      <View style={styles.linkCard}>
        <Text style={styles.linkLabel}>Länk</Text>
        <Text style={styles.linkText}>{id}</Text>
      </View>

      <Text>{reasons.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  adviceText: {
    ...typography.title2,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.md,
  },
  linkCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  linkLabel: {
    ...typography.footnote,
    color: colors.secondaryText,
  },
  linkText: {
    ...typography.body,
    fontFamily: "Menlo",
    color: colors.text,
  },
});
