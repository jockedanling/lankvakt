import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { StyleSheet, Text } from "react-native";

export default function ScreenTitle({ title }) {
  return <Text style={styles.title}>{title}</Text>;
}
const styles = StyleSheet.create({
  title: {
    ...typography.largeTitle,
    colors: colors.text,
    marginBottom: spacing.md,
  },
});
