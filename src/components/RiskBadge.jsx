import { VERDICT_LABEL } from "@/domain/verdicts";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { VERDICT_SYMBOL } from "@/theme/verdictSymbols";
import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

export default function RiskBadge({ verdict }) {
  const verdictColors = colors.verdict[verdict];
  return (
    <View
      style={[styles.circle, { backgroundColor: verdictColors.background }]}
    >
      <SymbolView
        name={VERDICT_SYMBOL[verdict]}
        size={64}
        tintColor={verdictColors.text}
      />
      <Text style={[styles.label, { color: verdictColors.text }]}>
        {VERDICT_LABEL[verdict]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 200,
    height: 200,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  label: {
    ...typography.title2,
  },
});
