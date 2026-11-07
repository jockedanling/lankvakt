import { VT_STATUS } from "@/hooks/useUrlCheck";
import {
  InvalidApiKeyError,
  NetworkError,
  QuotaExceededError,
  TimeoutError,
} from "@/services/apiErrors";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { SymbolView } from "expo-symbols";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ICON_SIZE = 20;

export default function VirusTotalRow({ virusTotal, onRetry }) {
  const { status, report, error } = virusTotal;

  if (status === VT_STATUS.LOADING) {
    return (
      <InfoRow icon={<ActivityIndicator color={colors.secondaryText} />}>
        Frågar säkerhetstjänster om länken ...
      </InfoRow>
    );
  }
  if (status === VT_STATUS.ERROR) {
    return (
      <View>
        <InfoRow
          icon={
            <SymbolView
              name="wifi.exclamationmark"
              size={ICON_SIZE}
              tintColor={colors.secondaryText}
            />
          }
        >
          {getErrorText(error)} Bedömningen bygger på LänkVakts egen kontroll.
        </InfoRow>
        <Pressable
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Försök igen</Text>
        </Pressable>
      </View>
    );
  }
  if (report === null) {
    return (
      <InfoRow
        icon={
          <SymbolView
            name="clock"
            size={ICON_SIZE}
            tintColor={colors.secondaryText}
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
            tintColor={colors.secondaryText}
          />
        }
      >
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

// Översätter felklassen till en text användaren förstår.
function getErrorText(error) {
  if (error instanceof NetworkError) {
    return "Ingen internetanslutning.";
  }
  if (error instanceof TimeoutError) {
    return "Säkerhetstjänsterna svarade inte i tid.";
  }
  if (error instanceof QuotaExceededError) {
    return "För många kontroller på kort tid. Vänta en minut och försök igen.";
  }
  if (error instanceof InvalidApiKeyError) {
    return "Appen saknar en giltig nyckel till säkerhetstjänsterna.";
  }
  return "Kunde inte fråga säkerhetstjänsterna just nu.";
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
    color: colors.text,
    flex: 1,
  },
  bold: {
    fontWeight: "700",
  },
  retryButton: {
    alignSelf: "flex-start",
    padding: spacing.sm,
  },
  retryText: {
    ...typography.subhead,
    color: colors.accent,
    textDecorationLine: "underline",
  },
});
