import { useRef, useState, useCallback } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';

export function usePokedexInteractions(toggleFavorite: (item: any) => void) {
  const router = useRouter();
  const lastTap = useRef<number>(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const [heartVisible, setHeartVisible] = useState(false);

  const triggerHeartAnimation = useCallback(() => {
    setHeartVisible(true);
    animatedValue.setValue(0);
    Animated.sequence([
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setHeartVisible(false));
  }, [animatedValue]);

  const handlePokemonPress = useCallback(
    (item: any) => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;

      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        if (timer.current) clearTimeout(timer.current);
        toggleFavorite(item);
        triggerHeartAnimation();
      } else {
        lastTap.current = now;
        timer.current = setTimeout(() => {
          router.push(`/pokemon/${item.id}`);
        }, DOUBLE_PRESS_DELAY);
      }
    },
    [toggleFavorite, router, triggerHeartAnimation],
  );

  return {
    handlePokemonPress,
    heartVisible,
    animatedValue,
  };
}
