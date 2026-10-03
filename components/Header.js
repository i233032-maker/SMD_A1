// ─────────────────────────────────────────────
//  Header – top bar with optional Back button
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../theme';

export default function Header({ title, onBack }) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.container}>
        {/* Back button – only shown when onBack prop is provided */}
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.spacer} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    minWidth: 70,
  },
  backArrow: {
    color:    COLORS.primary,
    fontSize: FONT_SIZE.xl,
    marginRight: 4,
  },
  backText: {
    color:    COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  title: {
    flex:      1,
    textAlign: 'center',
    color:     COLORS.text,
    fontSize:  FONT_SIZE.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spacer: { minWidth: 70 },
});
