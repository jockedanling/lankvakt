import { parseLink } from "@/analysis/verdict";
import PrimaryButton from "@/components/PrimaryButton";
import ReasonRow from "@/components/ReasonRow";
import RiskBadge from "@/components/RiskBadge";
import VirusTotalRow from "@/components/VirusTotalRow";
import { VERDICT, VERDICT_ADVICE } from "@/domain/verdicts";
import { useUrlCheck } from "@/hooks/useUrlCheck";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const { check, virusTotal } = useUrlCheck(id);

  useEffect(() => {
    if (check?.verdict === VERDICT.DANGEROUS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [check?.verdict]);

  if (check === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  const openLink = () => {
    WebBrowser.openBrowserAsync(parseLink(check.link).href);
  };

  const confirmOpen = () => {
    if (check.verdict !== VERDICT.DANGEROUS) {
      openLink();
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Är du säker?",
        message: "LänkVakt rekommenderar att du inte öppnar den här länken.",
        options: ["Avbryt", "Öppna ändå"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          openLink();
        }
      },
    );
  };

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
      <Pressable
        onPress={confirmOpen}
        style={styles.openLinkButton}
        accessibilityRole="button"
      >
        <Text style={styles.openLinkText}>Tryck här för att öppna länken</Text>
      </Pressable>
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
  openLinkButton: {
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  openLinkText: {
    ...typography.body,
    color: colors.secondaryText,
    textDecorationLine: "underline",
  },
});
