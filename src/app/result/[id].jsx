import PrimaryButton from "@/components/PrimaryButton";
import ReasonRow from "@/components/ReasonRow";
import RiskBadge from "@/components/RiskBadge";
import VirusTotalRow from "@/components/VirusTotalRow";
import { VERDICT_ADVICE } from "@/domain/verdicts";
import { useUrlCheck } from "@/hooks/useUrlCheck";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const { check, virusTotal } = useUrlCheck(id);

  if (check === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <RiskBadge verdict={check.verdict} />
      <Text style={styles.adviceText}>{VERDICT_ADVICE[check.verdict]}</Text>
      <View style={styles.linkCard}>
        <Text style={styles.linkLabel}>Länk</Text>
        <Text style={styles.linkText}>{check.link}</Text>
      </View>
      <VirusTotalRow virusTotal={virusTotal} />
      {check.reasons.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Varför?</Text>
          {check.reasons.map((reason, index) => (
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
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
