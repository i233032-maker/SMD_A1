// ─────────────────────────────────────────────
//  ChartCard – wraps a chart with a title label
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';

export default function ChartCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    ...SHADOW,
  },
  title: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  chartArea: {
    alignItems: 'center',
  },
});
