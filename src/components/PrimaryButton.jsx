import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { Pressable, StyleSheet, Text } from "react-native";

export default function PrimaryButton({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  text: {
    ...typography.headline,
    color: colors.surface,
    textAlign: "center",
  },
});
