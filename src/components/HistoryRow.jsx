import { VERDICT_LABEL } from "@/domain/verdicts";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { VERDICT_SYMBOL } from "@/theme/verdictSymbols";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HistoryRow({ check, onPress }) {
  const time = new Date(check.checkedAt).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const verdictColors = colors.verdict[check.verdict];

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <SymbolView
        name={VERDICT_SYMBOL[check.verdict]}
        size={24}
        tintColor={verdictColors.text}
      />
      <View style={styles.texts}>
        <Text style={styles.link} numberOfLines={1}>
          {check.link}
        </Text>
        <Text style={[styles.verdict, { color: verdictColors.text }]}>
          {VERDICT_LABEL[check.verdict]}
        </Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  texts: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  link: {
    ...typography.body,
    fontFamily: "Menlo",
    color: colors.text,
  },
  verdict: {
    ...typography.subhead,
    fontWeight: "600",
  },
  time: {
    ...typography.footnote,
    color: colors.secondaryText,
  },
});
