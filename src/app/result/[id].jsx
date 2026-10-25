import { assessLink } from "@/analysis/verdict";
import PrimaryButton from "@/components/PrimaryButton";
import ReasonRow from "@/components/ReasonRow";
import RiskBadge from "@/components/RiskBadge";
import { VERDICT_ADVICE } from "@/domain/verdicts";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const { verdict, reasons } = assessLink(id);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <RiskBadge verdict={verdict} />
      <Text style={styles.adviceText}>{VERDICT_ADVICE[verdict]}</Text>
      <View style={styles.linkCard}>
        <Text style={styles.linkLabel}>Länk</Text>
        <Text style={styles.linkText}>{id}</Text>
      </View>

      {reasons.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Varför?</Text>
          {reasons.map((reason, index) => (
            <ReasonRow key={reason} number={index + 1} text={reason} />
          ))}
        </>
      )}
      <PrimaryButton title="Klar" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
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
  sectionTitle: {
    ...typography.headline,
    color: colors.text,
    marginTop: spacing.lg,
  },
});
