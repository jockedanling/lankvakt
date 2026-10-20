import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ScanScreen() {
  const [link, setLink] = useState("");

  return (
    <View style={styles.container}>
      <Text>Skanna</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.secondaryText}
        onChangeText={setLink}
        value={link}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="Klistra in länk här…"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  input: {
    typography: typography.body,
    fontFamily: "Menlo",
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderWidth: 1,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
