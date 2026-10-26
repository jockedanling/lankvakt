import { initDatabase } from "@/storage/database";
import { Stack } from "expo-router";

initDatabase(); // Körs en gång när filen när appen startar.

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="result/[id]"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          title: "Resultat",
        }}
      />
    </Stack>
  );
}
