import HistoryRow from "@/components/HistoryRow";
import { getAllChecks } from "@/storage/historyRepository";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  const [checks, setChecks] = useState([]);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    useCallback(() => {
      getAllChecks().then(setChecks);
    }, []),
  );

  // Filtrering och trim av ordet för att hitta träffar oavsett stora eller
  // små bokstäver eller ett mellanslag för mycket.
  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredChecks = checks.filter((check) =>
    check.link.toLowerCase().includes(normalizedSearch),
  );

  // Varierande meddelande till användaren beroende på om historiken innehåller inga checks alls eller
  // om den inte innehåller just det sökordet.
  const emptyMessage =
    checks.length === 0
      ? "Du har inte kontrollerat några länkar än. Dina kontroller sparas här."
      : `Ingen kontroll innehåller "${searchText.trim()}".`;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Sök bland dina kontroller",
            hideWhenScrolling: false,
            onChangeText: (event) => setSearchText(event.nativeEvent.text),
          },
        }}
      ></Stack.Screen>
      <FlatList
        data={filteredChecks}
        keyExtractor={(check) => String(check.id)}
        contentContainerStyle={{ padding: spacing.md }}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
        renderItem={({ item }) => (
          <HistoryRow
            check={item}
            onPress={() =>
              router.push({ pathname: "/result/[id]", params: { id: item.id } })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyText: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
