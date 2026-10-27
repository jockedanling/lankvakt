import HistoryRow from "@/components/HistoryRow";
import { getAllChecks } from "@/storage/historyRepository";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HistoryScreen() {
  const [checks, setChecks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getAllChecks().then(setChecks);
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={checks}
        keyExtractor={(check) => String(check.id)}
        contentContainerStyle={{ padding: spacing.md }}
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
});
