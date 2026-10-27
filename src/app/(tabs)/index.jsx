import { assessLink } from "@/analysis/verdict";
import PrimaryButton from "@/components/PrimaryButton";
import QrScanner from "@/components/QrScanner";
import { InvalidLinkError } from "@/domain/errors";
import { saveCheck } from "@/storage/historyRepository";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const [link, setLink] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePaste = async () => {
    const input = await Clipboard.getStringAsync();
    setLink(input);
  };

  async function checkLink(text) {
    let assessment;
    try {
      assessment = assessLink(text);
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
      text.trim(),
      assessment.verdict,
      assessment.reasons,
    );
    router.push({ pathname: "/result/[id]", params: { id } });
  }

  const handleChangeText = (text) => {
    setLink(text);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <QrScanner onScanned={checkLink} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>eller</Text>
          <View style={styles.dividerLine} />
        </View>

        <View>
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
          <PrimaryButton title="Kontrollera" onPress={() => checkLink(link)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  section: {
    flex: 1,
  },
  pasteSection: {
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.separator,
  },
  dividerText: {
    ...typography.subhead,
    color: colors.secondaryText,
    marginHorizontal: spacing.sm,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
