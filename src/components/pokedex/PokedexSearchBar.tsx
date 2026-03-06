import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

type PokedexSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function PokedexSearchBar({
  value,
  onChangeText,
}: PokedexSearchBarProps) {
  return (
    <View style={styles.searchBox}>
      <Ionicons
        name="search"
        size={18}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search a pokemon..."
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
