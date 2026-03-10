import { Image, StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function PokedexHeader() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <Image
        source={require('../../../assets/pokemon-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable
        style={[styles.settings, { backgroundColor: colors.border }]}
        onPress={() => router.push('/settings')}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      >
        <Ionicons name="settings-outline" size={22} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    width: 250,
    height: 60,
    marginLeft: -60,
  },
  settings: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
