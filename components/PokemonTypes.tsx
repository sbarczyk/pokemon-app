import { View, Text, StyleSheet } from "react-native";

type Type = {
  type: {
    name: string;
  };
};

export default function PokemonTypes({ types }: { types: Type[] }) {
  return (
    <View style={styles.types}>
      {types.map((t) => (
        <Text key={t.type.name} style={styles.type}>
          {t.type.name}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  types: {
    flexDirection: "row",
    marginTop: 4,
  },
  type: {
    marginRight: 8,
    fontSize: 12,
    color: "#666",
    textTransform: "capitalize",
  },
});
