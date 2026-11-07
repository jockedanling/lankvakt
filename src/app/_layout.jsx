import { initDatabase } from "@/storage/database";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

initDatabase(); // Körs en gång när appen startar.

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
