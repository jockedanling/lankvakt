import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ScanScreen() {
  const [link, setLink] = useState("");

  const handlePaste = async () => {
    const input = await Clipboard.getStringAsync();
    setLink(input);
  };

  return (
    <View style={styles.container}>
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
      <Pressable onPress={handlePaste} style={styles.secondaryBtn}>
        <Text style={styles.pasteBtnText}>Klistra in</Text>
      </Pressable>
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
    ...typography.body,
    fontFamily: "Menlo",
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderWidth: 1,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  secondaryBtn: {
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    alignItems: "center",
  },
  pasteBtnText: {
    ...typography.headline,
    color: colors.accent,
  },
});
