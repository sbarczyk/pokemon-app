import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isFavorite: boolean;
  onPress: () => void;
};

export const FavoriteActionButton = ({ isFavorite, onPress }: Props) => (
  <TouchableOpacity
    style={[styles.button, isFavorite ? styles.disabled : styles.active]}
    onPress={onPress}
    disabled={isFavorite}
  >
    <Text style={[styles.text, { color: isFavorite ? "#AAA" : "white" }]}>
      {isFavorite ? "This is your Favorite" : "Set as my Favorite"}
    </Text>
    {!isFavorite && <Ionicons name="star" size={18} color="white" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { flexDirection: "row", padding: 18, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 25, gap: 12 },
  active: { backgroundColor: "#1A1A1A" },
  disabled: { backgroundColor: "#F0F0F0" },
  text: { fontWeight: "700", fontSize: 16 },
});