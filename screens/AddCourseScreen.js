// ─────────────────────────────────────────────
//  AddCourseScreen – form to add a new course
//  Validates all fields; on success it calls
//  onAddCourse() which updates App.js state,
//  causing every screen and chart to re-render.
// ─────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, Alert,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';

import Header        from '../components/Header';
import InputField    from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';

export default function AddCourseScreen({ courses, editingCourse, onAddCourse, onEditCourse, onBack }) {
  const isEditing = !!editingCourse;
  
  const [name,         setName]         = useState(editingCourse ? editingCourse.name : '');
  const [code,         setCode]         = useState(editingCourse ? editingCourse.code : '');
  const [credits,      setCredits]      = useState(editingCourse ? String(editingCourse.creditHours) : '');
  const [totalClasses, setTotalClasses] = useState(editingCourse ? String(editingCourse.totalClasses) : '');
  const [errors,       setErrors]       = useState({});

  // Refs to advance focus between fields on "next" key
  const codeRef    = useRef(null);
  const creditRef  = useRef(null);
  const classesRef = useRef(null);

  // ── Field-level validation ─────────────────────────────────────────────
  function validate() {
    const errs = {};

    if (!name.trim())
      errs.name = 'Course name is required.';

    if (!code.trim())
      errs.code = 'Course code is required.';
    else if (courses.some(c => c.code.toLowerCase() === code.trim().toLowerCase() && (!isEditing || c.id !== editingCourse.id)))
      errs.code = 'A course with this code already exists.';

    if (credits === '')
      errs.credits = 'Credit hours are required.';
    else if (isNaN(Number(credits)) || Number(credits) < 1 || Number(credits) > 6)
      errs.credits = 'Must be a number between 1 and 6.';

    if (totalClasses === '')
      errs.totalClasses = 'Total classes is required.';
    else if (isNaN(Number(totalClasses)) || Number(totalClasses) < 1 || Number(totalClasses) > 200)
      errs.totalClasses = 'Must be a number between 1 and 200.';
    else if (isEditing && Number(totalClasses) < editingCourse.attendance.length)
      errs.totalClasses = `Cannot be less than recorded classes (${editingCourse.attendance.length}).`;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit handler ─────────────────────────────────────────────────────
  function handleSubmit() {
    if (!validate()) return;

    if (isEditing) {
      const updatedCourse = {
        ...editingCourse,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        creditHours: Number(credits),
        totalClasses: Number(totalClasses),
      };
      onEditCourse(updatedCourse);
      Alert.alert('✅ Course Updated', `${updatedCourse.code} has been updated successfully.`);
      onBack(); // to clear editingCourse and go back to courses view
    } else {
      const newCourse = {
        id:           Date.now().toString(),
        name:         name.trim(),
        code:         code.trim().toUpperCase(),
        creditHours:  Number(credits),
        totalClasses: Number(totalClasses),
        attendance:   [],    // starts with no recorded sessions
        assessments:  [
          { name: 'Midterm', weight: 30, obtained: null },
          { name: 'Final',   weight: 50, obtained: null },
          { name: 'Others',  weight: 20, obtained: null },
        ],
      };

      onAddCourse(newCourse);
      Alert.alert('✅ Course Added', `${newCourse.code} – ${newCourse.name} has been added successfully.`);
      
      setName(''); setCode(''); setCredits(''); setTotalClasses(''); setErrors({});
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={isEditing ? "Edit Course" : "Add New Course"} onBack={onBack} />

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            🎓  Adding a course here updates the Dashboard charts and Attendance list instantly.
          </Text>
        </View>

        {/* Form fields */}
        <InputField
          label="Course Name *"
          value={name}
          onChangeText={v => { setName(v); setErrors(e => ({ ...e, name: null })); }}
          error={errors.name}
          placeholder="e.g. Operating Systems"
          maxLength={60}
          returnKeyType="next"
          onSubmitEditing={() => codeRef.current?.focus()}
        />
        <InputField
          label="Course Code *"
          value={code}
          onChangeText={v => { setCode(v); setErrors(e => ({ ...e, code: null })); }}
          error={errors.code}
          placeholder="e.g. OS-302"
          maxLength={10}
          returnKeyType="next"
          onSubmitEditing={() => creditRef.current?.focus()}
          inputRef={codeRef}
        />
        <InputField
          label="Credit Hours * (1–6)"
          value={credits}
          onChangeText={v => { setCredits(v); setErrors(e => ({ ...e, credits: null })); }}
          error={errors.credits}
          placeholder="e.g. 3"
          keyboardType="numeric"
          maxLength={1}
          returnKeyType="next"
          onSubmitEditing={() => classesRef.current?.focus()}
          inputRef={creditRef}
        />
        <InputField
          label="Total Classes this Semester * (1–200)"
          value={totalClasses}
          onChangeText={v => { setTotalClasses(v); setErrors(e => ({ ...e, totalClasses: null })); }}
          error={errors.totalClasses}
          placeholder="e.g. 40"
          keyboardType="numeric"
          maxLength={3}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          inputRef={classesRef}
        />

        {/* Preview card */}
        {(name || code) && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewCode}>{code.toUpperCase() || 'CODE'}</Text>
            <Text style={styles.previewName}>{name || 'Course Name'}</Text>
            <Text style={styles.previewSub}>
              {credits || '?'} credit hrs · {totalClasses || '?'} classes planned
            </Text>
          </View>
        )}

        <PrimaryButton label={isEditing ? "Save Changes" : "Add Course"} onPress={handleSubmit} />
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  infoBanner: {
    backgroundColor: COLORS.primary + '22',
    borderRadius:    RADIUS.md,
    margin:          SPACING.md,
    padding:         SPACING.md,
    borderWidth:     1,
    borderColor:     COLORS.primary + '55',
  },
  infoText: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, lineHeight: 20 },

  // Live preview card
  previewCard: {
    backgroundColor:  COLORS.surface,
    borderRadius:     RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    padding:          SPACING.md,
    ...SHADOW,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  previewTitle: { color: COLORS.textDim, fontSize: FONT_SIZE.xs, marginBottom: SPACING.xs },
  previewCode:  { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: '700' },
  previewName:  { color: COLORS.text,    fontSize: FONT_SIZE.lg, fontWeight: '700' },
  previewSub:   { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, marginTop: 4 },
});
