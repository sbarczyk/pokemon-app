import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isFavorite: boolean;
  onPress: () => void;
};

export const FavoriteActionButton = ({ isFavorite, onPress }: Props) => (
  <TouchableOpacity
    style={[styles.button, isFavorite ? styles.favoriteActive : styles.notFavorite]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.text, { color: isFavorite ? '#FF4757' : 'white' }]}>
      {isFavorite ? 'Remove from Favorites' : 'Set as my Favorite'}
    </Text>
    
    <Ionicons 
      name={isFavorite ? "heart" : "heart-outline"} 
      size={20} 
      color={isFavorite ? "#FF4757" : "white"} 
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    gap: 12,
    borderWidth: 2,
  },
  favoriteActive: { 
    backgroundColor: 'transparent', 
    borderColor: '#FF4757' 
  },
  notFavorite: { 
    backgroundColor: '#1A1A1A', 
    borderColor: '#1A1A1A' 
  },
  text: { 
    fontWeight: '700', 
    fontSize: 16 
  },
});