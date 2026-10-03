// ─────────────────────────────────────────────
//  SearchBar – text input for searching courses
// ─────────────────────────────────────────────
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../theme';

export default function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search…'}
        placeholderTextColor={COLORS.textDim}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {/* Clear button for Android (iOS handled by clearButtonMode) */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius:    RADIUS.xl,
    paddingHorizontal: SPACING.md,
    marginHorizontal:  SPACING.md,
    marginBottom:      SPACING.sm,
    borderWidth:  1,
    borderColor:  COLORS.border,
  },
  icon:  { fontSize: FONT_SIZE.md, marginRight: SPACING.sm },
  input: {
    flex:      1,
    color:     COLORS.text,
    fontSize:  FONT_SIZE.md,
    paddingVertical: SPACING.sm + 2,
  },
  clearBtn:  { padding: SPACING.xs },
  clearText: { color: COLORS.textDim, fontSize: FONT_SIZE.sm },
});
