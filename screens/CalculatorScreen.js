// ─────────────────────────────────────────────
//  CalculatorScreen – Grade What-If Calculator
//  Select course → enter target → get required
//  final mark, with full form validation.
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';

import Header        from '../components/Header';
import InputField    from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState    from '../components/EmptyState';

import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';
import { calcRequiredFinalMark, calcCurrentMarks, pctToGrade } from '../utils/calculations';

export default function CalculatorScreen({ courses, onBack }) {
  const [selectedId, setSelectedId] = useState(null);
  const [targetPct,  setTargetPct]  = useState('');
  const [errors,     setErrors]     = useState({});
  const [result,     setResult]     = useState(null);

  const selectedCourse = courses.find(c => c.id === selectedId);

  // ── Validation ─────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!selectedId) errs.course = 'Please select a course.';
    if (targetPct === '' || targetPct === null) {
      errs.target = 'Target percentage is required.';
    } else if (isNaN(Number(targetPct))) {
      errs.target = 'Must be a numeric value.';
    } else if (Number(targetPct) < 0 || Number(targetPct) > 100) {
      errs.target = 'Must be between 0 and 100.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Calculate result ───────────────────────────────────────────────────
  function handleCalculate() {
    if (!validate()) return;

    const { requiredPct, finalWeight, possible, alreadyAchieved } = calcRequiredFinalMark(
      selectedCourse.assessments,
      Number(targetPct),
    );

    const { pct: currentPct } = calcCurrentMarks(selectedCourse.assessments);
    setResult({ requiredPct, finalWeight, possible, alreadyAchieved, currentPct });
  }

  // ── Reset form ─────────────────────────────────────────────────────────
  function handleReset() {
    setSelectedId(null);
    setTargetPct('');
    setErrors({});
    setResult(null);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Header title="Grade Calculator" onBack={onBack} />

        {courses.length === 0 ? (
          <View style={{ marginTop: 40 }}>
            <EmptyState icon="🧮" title="No Courses" subtitle="Add a course first to use the calculator." />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Course</Text>

            {/* Course selector list */}
          {courses.map(c => {
            const active = c.id === selectedId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.courseOpt, active && styles.courseOptActive]}
                onPress={() => { setSelectedId(c.id); setResult(null); setErrors(e => ({ ...e, course: null })); }}
              >
                <View>
                  <Text style={[styles.optCode, active && styles.optCodeActive]}>{c.code}</Text>
                  <Text style={[styles.optName, active && styles.optNameActive]}>{c.name}</Text>
                </View>
                {active && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
          {errors.course ? <Text style={styles.errorText}>{errors.course}</Text> : null}
        </View>

        {/* Current marks info */}
        {selectedCourse && (
          <View style={styles.currentCard}>
            <Text style={styles.currentTitle}>Current Standing – {selectedCourse.code}</Text>
            {selectedCourse.assessments.map((a, i) => (
              <View key={i} style={styles.assessRow}>
                <Text style={styles.assessName}>{a.name} ({a.weight}%)</Text>
                <Text style={styles.assessVal}>
                  {a.obtained !== null ? `${a.obtained} / ${a.weight}` : '—  (pending)'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Target input */}
        <InputField
          label="Target Overall Percentage (%)"
          value={targetPct}
          onChangeText={v => { setTargetPct(v); setResult(null); setErrors(e => ({ ...e, target: null })); }}
          error={errors.target}
          placeholder="e.g. 85"
          keyboardType="numeric"
          maxLength={5}
          returnKeyType="done"
        />

        {/* Calculate button */}
        <PrimaryButton label="Calculate Required Mark" onPress={handleCalculate} />
        <PrimaryButton label="Reset" onPress={handleReset} color={COLORS.surfaceAlt} />

        {/* ── Result card ── */}
        {result && (
          <View style={[
            styles.resultCard,
            result.alreadyAchieved ? styles.resultAchieved
            : result.possible      ? styles.resultOk
            : styles.resultImpossible,
          ]}>
            {result.alreadyAchieved ? (
              <>
                <Text style={styles.resultHeading}>🎉 Already Achieved!</Text>
                <Text style={styles.resultMain}>
                  You have already surpassed your target of{' '}
                  <Text style={styles.resultHighlight}>{targetPct}%</Text>
                  {' '}based on marks submitted so far.
                </Text>
                <Text style={styles.resultSub}>
                  Current Grade: <Text style={{ fontWeight: '700', color: COLORS.success }}>{pctToGrade(Number(targetPct))}</Text>
                </Text>
              </>
            ) : result.possible ? (
              <>
                <Text style={styles.resultHeading}>📊 Result</Text>
                <Text style={styles.resultMain}>
                  You need{' '}
                  <Text style={styles.resultHighlight}>{result.requiredPct}%</Text>
                  {' '}in your remaining assessment{result.finalWeight > 0 ? ` (${result.finalWeight}% weight)` : ''}
                </Text>
                <Text style={styles.resultSub}>
                  To reach your target of <Text style={{ fontWeight: '700' }}>{targetPct}%</Text>
                  {'  →  Grade: '}
                  <Text style={{ fontWeight: '700', color: COLORS.success }}>{pctToGrade(Number(targetPct))}</Text>
                </Text>
                {result.requiredPct > 90 && (
                  <Text style={styles.resultWarn}>
                    ⚠️  That's very challenging — you'll need to score above 90%!
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.resultHeading}>❌ Not Achievable</Text>
                <Text style={styles.resultMain}>
                  Even with 100%, you cannot reach {targetPct}%.
                </Text>
                <Text style={styles.resultSub}>
                  Lower your target or check the marks entered above.
                </Text>
              </>
            )}
          </View>
        )}
        </>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: COLORS.bg },
  section: { marginHorizontal: SPACING.md, marginVertical: SPACING.md },
  sectionTitle: {
    color:        COLORS.textMuted,
    fontSize:     FONT_SIZE.sm,
    fontWeight:   '700',
    marginBottom: SPACING.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Course selector
  courseOpt: {
    backgroundColor:  COLORS.surface,
    borderRadius:     RADIUS.md,
    padding:          SPACING.md,
    marginBottom:     SPACING.sm,
    borderWidth:      1,
    borderColor:      COLORS.border,
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
  },
  courseOptActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  optCode:       { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 1 },
  optCodeActive: { color: COLORS.primary },
  optName:       { color: COLORS.text, fontSize: FONT_SIZE.md, marginTop: 2 },
  optNameActive: { fontWeight: '700' },
  checkmark:     { color: COLORS.primary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  errorText:     { color: COLORS.danger, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },

  // Current marks mini-table
  currentCard: {
    backgroundColor:  COLORS.surface,
    borderRadius:     RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    padding:          SPACING.md,
    ...SHADOW,
  },
  currentTitle: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: SPACING.sm },
  assessRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  assessName: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  assessVal:  { color: COLORS.text,      fontSize: FONT_SIZE.sm, fontWeight: '600' },

  // Result card
  resultCard: {
    borderRadius:     RADIUS.md,
    marginHorizontal: SPACING.md,
    marginTop:        SPACING.sm,
    padding:          SPACING.lg,
    ...SHADOW,
  },
  resultOk:         { backgroundColor: COLORS.primary + '22', borderWidth: 1, borderColor: COLORS.primary },
  resultAchieved:   { backgroundColor: COLORS.success  + '22', borderWidth: 1, borderColor: COLORS.success  },
  resultImpossible: { backgroundColor: COLORS.dangerDim,       borderWidth: 1, borderColor: COLORS.danger   },
  resultHeading:    { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: '800', marginBottom: SPACING.sm },
  resultMain:       { color: COLORS.text, fontSize: FONT_SIZE.md, lineHeight: 24 },
  resultHighlight:  { color: COLORS.primary, fontWeight: '800', fontSize: FONT_SIZE.xl },
  resultSub:        { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, marginTop: SPACING.sm },
  resultWarn:       { color: COLORS.warning,   fontSize: FONT_SIZE.sm, marginTop: SPACING.sm },
});
