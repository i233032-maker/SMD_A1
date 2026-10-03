// ─────────────────────────────────────────────
//  WarningBanner – collapsible warning row
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../theme';

export default function WarningBanner({ warnings }) {
  const [expanded, setExpanded] = useState(true);

  // Nothing to show
  if (!warnings || warnings.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header row with collapse toggle */}
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(e => !e)}>
        <Text style={styles.headerText}>⚠️  {warnings.length} Warning{warnings.length > 1 ? 's' : ''}</Text>
        <Text style={styles.toggle}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Warning list */}
      {expanded && warnings.map((w, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.text}>{w}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:  COLORS.dangerDim,
    borderRadius:     RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    overflow:         'hidden',
    borderWidth:      1,
    borderColor:      COLORS.danger,
  },
  header: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
    padding:          SPACING.md,
  },
  headerText: { color: COLORS.danger, fontSize: FONT_SIZE.md, fontWeight: '700' },
  toggle:     { color: COLORS.danger, fontSize: FONT_SIZE.sm },
  row:        { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  text:       { color: COLORS.text, fontSize: FONT_SIZE.sm, lineHeight: 20 },
});
