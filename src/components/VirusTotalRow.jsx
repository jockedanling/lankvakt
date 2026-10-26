import { VT_STATUS } from "@/hooks/useUrlCheck";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const ICON_SIZE = 20;

export default function VirusTotalRow({ virusTotal }) {
  const { status, report } = virusTotal;

  if (status === VT_STATUS.LOADING) {
    return (
      <InfoRow icon={<ActivityIndicator color={colors.secondaryText} />}>
        Frågar säkerhetstjänster om länken ...{" "}
      </InfoRow>
    );
  }
  if (status === VT_STATUS.ERROR) {
    return (
      <InfoRow
        icon={
          <SymbolView
            name="wifi.exclamationmark"
            size={ICON_SIZE}
            tintcolor={colors.secondaryText}
          />
        }
      >
        Kunde inte fråga säkerhetstjänsterna just nu. Bedömningen bygger på
        LänkVakts egen kontroll.
      </InfoRow>
    );
  }
  if (report === null) {
    return (
      <InfoRow
        icon={
          <SymbolView
            name="clock"
            size={ICON_SIZE}
            tintcolor={colors.secondaryText}
          />
        }
      >
        Säkerhetstjänsterna har inte hunnit granska länken än.
      </InfoRow>
    );
  }
  if (report.flagged === 0) {
    return (
      <InfoRow
        icon={
          <SymbolView
            name="checkmark.circle"
            size={ICON_SIZE}
            tintcolor={colors.secondaryText}
          />
        }
      >
        {" "}
        Ingen av {report.total} säkerhetstjänster varnar för länken.
      </InfoRow>
    );
  }

  return (
    <InfoRow
      icon={
        <SymbolView
          name="exclamationmark.triangle.fill"
          size={ICON_SIZE}
          tintColor={colors.text}
        />
      }
    >
      <Text style={styles.bold}>
        {report.flagged} av {report.total}
      </Text>{" "}
      säkerhetstjänster varnar för länken.
    </InfoRow>
  );
}

// Gemensam ram för alla lägen: ikon till vänster, text till höger
function InfoRow({ icon, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  icon: {
    width: 24,
    alignItems: "center",
    marginRight: spacing.sm,
  },
  text: {
    ...typography.subhead,
    colors: colors.text,
    flex: 1,
  },
  bold: {
    fontWeight: "700",
  },
});
