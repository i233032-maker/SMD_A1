// ─────────────────────────────────────────────
//  CourseCard – displays one course in a list
// ─────────────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';
import { STATUS_COLOR } from '../constants';
import { calcAttendancePct, calcCurrentMarks, calcSkippableClasses, getAttendanceStatus } from '../utils/calculations';

export default function CourseCard({ course, onPresent, onAbsent, onDelete, onEdit }) {
  const attendPct = calcAttendancePct(course.attendance);
  const { pct: marksPct } = calcCurrentMarks(course.assessments);
  const skippable = calcSkippableClasses(course.attendance, course.totalClasses);
  const status    = getAttendanceStatus(attendPct);
  const statusCol = STATUS_COLOR[status];

  // Scale animation on mount
  const scale = useRef(new Animated.Value(0.92)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80 }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      {/* Coloured left border indicates attendance status */}
      <View style={[styles.leftBar, { backgroundColor: statusCol }]} />

      <View style={styles.content}>
        {/* Course title row */}
        <View style={styles.row}>
          <View style={styles.titleWrap}>
            <Text style={styles.code}>{course.code}</Text>
            <Text style={styles.name} numberOfLines={1}>{course.name}</Text>
          </View>
          <View style={styles.rightActions}>
            <View style={[styles.badge, { backgroundColor: statusCol + '33' }]}>
              <Text style={[styles.badgeText, { color: statusCol }]}>
                {status === 'safe' ? '✓ Safe' : status === 'warning' ? '⚡ Low' : '✗ Risk'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => onEdit(course)}
            >
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => {
                Alert.alert(
                  "Delete course",
                  `Remove ${course.code}? This cannot be undone.`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => onDelete(course.id, course.code) }
                  ]
                );
              }}
            >
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Stat label="Attendance" value={`${attendPct}%`} color={statusCol} />
          <Stat label="Marks So Far" value={`${marksPct}%`} color={COLORS.primary} />
          <Stat label="Can Skip" value={`${skippable}`} color={COLORS.textMuted} />
          <Stat label="Credits" value={`${course.creditHours}`} color={COLORS.textDim} />
        </View>

        {/* Progress bar for attendance */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${attendPct}%`, backgroundColor: statusCol }]} />
        </View>

        {/* Action buttons – mark Present / Absent */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.presentBtn]} onPress={() => onPresent(course.id)}>
            <Text style={styles.btnText}>✓ Present</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.absentBtn]} onPress={() => onAbsent(course.id)}>
            <Text style={styles.btnText}>✗ Absent</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// Small inline stat display
function Stat({ label, value, color }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:  COLORS.surface,
    borderRadius:     RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    flexDirection:    'row',
    overflow:         'hidden',
    ...SHADOW,
  },
  leftBar: { width: 5 },
  content: { flex: 1, padding: SPACING.md },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   SPACING.sm,
  },
  titleWrap: { flex: 1, marginRight: SPACING.sm },
  code: {
    color:      COLORS.primary,
    fontSize:   FONT_SIZE.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  name: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.md,
    fontWeight: '600',
    marginTop:  2,
  },
  badge: {
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.sm,
    paddingVertical:   3,
  },
  badgeText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  rightActions: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  actionBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    marginTop: -8, // pull up to align nicely with title
  },
  editBtn: { backgroundColor: COLORS.primary + '11' },
  deleteBtn: { backgroundColor: COLORS.danger + '11' },
  editIcon: { fontSize: FONT_SIZE.md, color: COLORS.primary },
  deleteIcon: { fontSize: FONT_SIZE.md, color: COLORS.danger },
  statsRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   SPACING.sm,
  },
  stat:      { alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.md, fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textDim, marginTop: 1 },
  progressBg: {
    height:         5,
    backgroundColor: COLORS.border,
    borderRadius:   3,
    marginBottom:   SPACING.md,
    overflow:       'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  btnRow: { flexDirection: 'row', gap: SPACING.sm },
  btn: {
    flex:           1,
    paddingVertical: SPACING.xs + 2,
    borderRadius:   RADIUS.sm,
    alignItems:     'center',
  },
  presentBtn: { backgroundColor: COLORS.success + '22', borderWidth: 1, borderColor: COLORS.success },
  absentBtn:  { backgroundColor: COLORS.danger  + '22', borderWidth: 1, borderColor: COLORS.danger  },
  btnText: { color: COLORS.text, fontSize: FONT_SIZE.sm, fontWeight: '600' },
});
