// ─────────────────────────────────────────────
//  PrimaryButton – full-width action button
// ─────────────────────────────────────────────
import React, { useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../theme';

export default function PrimaryButton({ label, onPress, color, disabled }) {
  // Tiny press animation
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1.00, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: color || COLORS.primary },
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.85}
        disabled={disabled}
      >
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius:    RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems:      'center',
    justifyContent:  'center',
    marginHorizontal: SPACING.md,
    marginVertical:   SPACING.sm,
  },
  disabled: { opacity: 0.45 },
  label: {
    color:      COLORS.white,
    fontSize:   FONT_SIZE.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
