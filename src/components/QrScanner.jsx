import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { useCameraPermissions } from "expo-camera";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

export default function QrScanner({ onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleStart = async () => {
    if (permission?.granted) {
      setIsCameraOn(true);
      return;
    }

    // IOS frågar bara en gång. Har hon sagt nej måste hon ändra det i inställningar
    if (permission && !permission.canAskAgain) {
      Linking.openSettings();
      return;
    }
    const response = await requestPermission();
    if (response.granted) {
      setIsCameraOn(true);
    }
  };

  if (isCameraOn) {
    return (
      <View style={styles.frame}>
        <Text>Här kommer kameran i steg 3</Text>
      </View>
    );
  }

  const isBlocked =
    permission !== null && !permission.granted && !permission.canAskAgain;

  return (
    <Pressable onPress={handleStart} style={styles.frame}>
      <SymbolView
        name="qrcode.viewfinder"
        size={56}
        tintColor={colors.accent}
      />
      <Text style={styles.title}>Skanna QR-kod</Text>
      <Text style={styles.hint}>
        {isBlocked
          ? "Kameran är avstängd för LänkVakt. Tryck för att slå på den i inställningar"
          : "Tryck för att använda kameran"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 240,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headline,
    color: colors.text,
    marginTop: spacing.sm,
  },
  hint: {
    ...typography.subhead,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});
