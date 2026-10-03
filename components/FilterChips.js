// ─────────────────────────────────────────────
//  FilterChips – horizontal filter / sort pills
// ─────────────────────────────────────────────
import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../theme';

export default function FilterChips({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {options.map(opt => {
        const active = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flexGrow: 0 },
  content:  { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm, gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.xs,
    borderRadius:      RADIUS.xl,
    backgroundColor:   COLORS.surfaceAlt,
    borderWidth:       1,
    borderColor:       COLORS.border,
  },
  chipActive:  { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  label:       { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  labelActive: { color: COLORS.white },
});
