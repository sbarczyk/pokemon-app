import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type PokedexSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function PokedexSearchBar({
  value,
  onChangeText,
}: PokedexSearchBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
      <Ionicons
        name="search"
        size={18}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search a pokemon..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.searchInput, { color: colors.text }]}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    shadowColor: '#000',
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
