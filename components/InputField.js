// ─────────────────────────────────────────────
//  InputField – label + TextInput + error text
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS } from '../theme';

export default function InputField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType,
  maxLength,
  returnKeyType,
  onSubmitEditing,
  inputRef,
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={inputRef}
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textDim}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
        returnKeyType={returnKeyType || 'done'}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
        autoCapitalize="words"
      />
      {/* Inline validation error message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  label: {
    color:      COLORS.textMuted,
    fontSize:   FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    color:           COLORS.text,
    fontSize:        FONT_SIZE.md,
    borderRadius:    RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm + 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.danger },
  error: {
    color:     COLORS.danger,
    fontSize:  FONT_SIZE.xs,
    marginTop: 5,
  },
});
