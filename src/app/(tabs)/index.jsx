import { assessLink } from "@/analysis/verdict";
import PrimaryButton from "@/components/PrimaryButton";
import { InvalidLinkError } from "@/domain/errors";
import { saveCheck } from "@/storage/historyRepository";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ScanScreen() {
  const [link, setLink] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePaste = async () => {
    const input = await Clipboard.getStringAsync();
    setLink(input);
  };

  const handleCheck = async () => {
    let assessment;
    try {
      assessment = assessLink(link);
    } catch (error) {
      if (error instanceof InvalidLinkError) {
        setErrorMessage(
          "Det här ser inte ut som en webbadress. Kontrollera att du har kopierat hela länken.",
        );
        return;
      }
      throw error;
    }
    const id = await saveCheck(
      link.trim(),
      assessment.verdict,
      assessment.reasons,
    );
    router.push({ pathname: "/result/[id]", params: { id } });
  };
  const handleChangeText = (text) => {
    setLink(text);
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.secondaryText}
        onChangeText={handleChangeText}
        value={link}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="Klistra in länk här…"
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Pressable onPress={handlePaste} style={styles.secondaryButton}>
        <Text style={styles.pasteButtonText}>Klistra in</Text>
      </Pressable>
      <PrimaryButton title="Kontrollera" onPress={handleCheck} />
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
  secondaryButton: {
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    alignItems: "center",
  },
  pasteButtonText: {
    ...typography.headline,
    color: colors.accent,
  },
  errorText: {
    ...typography.subhead,
    color: colors.text,
    marginTop: spacing.sm,
  },
});
