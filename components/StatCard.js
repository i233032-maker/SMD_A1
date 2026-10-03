// ─────────────────────────────────────────────
//  StatCard – small KPI tile on the Dashboard
// ─────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';

export default function StatCard({ label, value, subtext, color }) {
  // Fade-in + slide-up animation when the card mounts
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
  }, []);

  const animStyle = {
    opacity:   anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  };

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <View style={[styles.accent, { backgroundColor: color || COLORS.primary }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.md,
    padding:         SPACING.md,
    flex:            1,
    margin:          SPACING.xs,
    ...SHADOW,
    overflow: 'hidden',
  },
  accent: {
    position:      'absolute',
    top:           0,
    left:          0,
    right:         0,
    height:        4,
    borderTopLeftRadius:  RADIUS.md,
    borderTopRightRadius: RADIUS.md,
  },
  value: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.xxl,
    fontWeight: '800',
    marginTop:  SPACING.xs,
  },
  label: {
    color:     COLORS.textMuted,
    fontSize:  FONT_SIZE.sm,
    marginTop: 2,
    fontWeight: '500',
  },
  subtext: {
    color:     COLORS.textDim,
    fontSize:  FONT_SIZE.xs,
    marginTop: 4,
  },
});
