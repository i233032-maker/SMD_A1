// ─────────────────────────────────────────────
//  DashboardScreen – charts + summary + warnings
//  Uses react-native-chart-kit for 4 chart types.
// ─────────────────────────────────────────────
import React, { useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import {
  BarChart, LineChart, PieChart, ProgressChart,
} from 'react-native-chart-kit';

import Header      from '../components/Header';
import ChartCard   from '../components/ChartCard';
import StatCard    from '../components/StatCard';
import WarningBanner from '../components/WarningBanner';
import EmptyState    from '../components/EmptyState';

import { COLORS, SPACING, FONT_SIZE } from '../theme';
import {
  calcAttendancePct,
  calcCurrentMarks,
  calcOverallGPA,
  buildWarnings,
  gradeDistribution,
} from '../utils/calculations';
import { ATTENDANCE_THRESHOLD } from '../constants';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.md * 4; // chart width inside card

// Shared chart config (colours, background)
const CHART_CFG = {
  backgroundColor:    COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo:   COLORS.surfaceAlt,
  decimalPlaces:      0,
  color:  (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
  style:  { borderRadius: 8 },
  propsForDots: { r: '5', strokeWidth: '2', stroke: COLORS.primary },
};

// Pie chart colour palette
const PIE_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#22c55e', '#ef4444'];

export default function DashboardScreen({ courses, onBack, semesterGPA }) {
  // ── Derived data (recomputed whenever courses state changes) ──────────
  const warnings = useMemo(() => buildWarnings(courses), [courses]);
  const overallGPA = useMemo(() => calcOverallGPA(courses), [courses]);

  // Overall attendance % across all courses
  const overallAttend = useMemo(() => {
    const allPresent = courses.reduce((s, c) => s + c.attendance.filter(Boolean).length, 0);
    const allTotal   = courses.reduce((s, c) => s + c.attendance.length, 0);
    return allTotal > 0 ? Math.round((allPresent / allTotal) * 100) : 0;
  }, [courses]);

  const atRiskCount = useMemo(
    () => courses.filter(c => calcAttendancePct(c.attendance) < ATTENDANCE_THRESHOLD).length,
    [courses],
  );

  // ── ProgressChart data (attendance per course, 0-1 range) ─────────────
  // Clamp each value to 0-1 and replace NaN (0 sessions) with 0
  const progressData = useMemo(() => ({
    labels: courses.map(c => c.code.split('-')[0]),
    data: courses.map(c => {
      const pct = calcAttendancePct(c.attendance);
      const val = pct / 100;
      return isNaN(val) ? 0 : Math.min(1, Math.max(0, val));
    }),
  }), [courses]);

  // ── BarChart data (marks % per course) ───────────────────────────────
  // Ensure no NaN values reach the chart (new courses start with 0 assessments done)
  const barData = useMemo(() => ({
    labels:   courses.map(c => c.code.split('-')[0]),
    datasets: [{
      data: courses.map(c => {
        const pct = calcCurrentMarks(c.assessments).pct;
        return isNaN(pct) ? 0 : Math.max(0, pct);
      }),
    }],
  }), [courses]);

  // ── LineChart data (semester GPA trend) ──────────────────────────────
  const lineData = useMemo(() => ({
    labels:   semesterGPA.map(s => s.label),
    datasets: [{ data: semesterGPA.map(s => s.gpa), strokeWidth: 2 }],
  }), [semesterGPA]);

  // ── PieChart data (credit-hour split per course) ──────────────────────
  // PieChart crashes with an empty array; use a placeholder when no courses exist
  const pieData = useMemo(() => {
    if (courses.length === 0) {
      return [{ name: 'No courses', population: 1, color: COLORS.border, legendFontColor: COLORS.textMuted, legendFontSize: 11 }];
    }
    return courses.map((c, i) => ({
      name:            c.code,
      population:      Math.max(1, c.creditHours), // population must be > 0
      color:           PIE_COLORS[i % PIE_COLORS.length],
      legendFontColor: COLORS.textMuted,
      legendFontSize:  11,
    }));
  }, [courses]);

  // ── Grade distribution section ────────────────────────────────────────
  const gradeDist = useMemo(() => gradeDistribution(courses), [courses]);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Header title="Dashboard" onBack={onBack} />

      {/* ── Dynamic warning banner ── */}
      {courses.length > 0 && warnings.length > 0 && (
        <View style={styles.section}>
          <WarningBanner warnings={warnings} />
        </View>
      )}

      {/* ── KPI stat cards ── */}
      <View style={styles.statsRow}>
        <StatCard
          label="Overall Attendance"
          value={courses.length > 0 ? `${overallAttend}%` : 'N/A'}
          subtext={courses.length === 0 ? 'No data' : (overallAttend >= ATTENDANCE_THRESHOLD ? 'Good standing' : 'Below threshold!')}
          color={courses.length === 0 ? COLORS.textMuted : (overallAttend >= ATTENDANCE_THRESHOLD ? COLORS.success : COLORS.danger)}
        />
        <StatCard 
          label="Current GPA" 
          value={courses.length > 0 ? overallGPA.toFixed(2) : 'N/A'} 
          color={courses.length > 0 ? COLORS.primary : COLORS.textMuted} 
        />
        <StatCard
          label="Courses at Risk"
          value={courses.length > 0 ? atRiskCount : 0}
          subtext={courses.length === 0 ? 'No data' : (atRiskCount === 0 ? 'All safe' : 'Needs attention')}
          color={courses.length === 0 ? COLORS.textMuted : (atRiskCount > 0 ? COLORS.danger : COLORS.success)}
        />
      </View>

      {courses.length === 0 ? (
        <View style={{ marginTop: 40 }}>
          <EmptyState 
            icon="📊" 
            title="No Data" 
            subtitle="Add some courses to see your dashboard charts." 
          />
        </View>
      ) : (
        <>
          {/* ── Chart 1: ProgressChart – attendance per course ── */}
          <ChartCard title="📅 Attendance per Course">
            <ProgressChart
              data={progressData}
              width={CHART_WIDTH}
              height={200}
              strokeWidth={12}
              radius={28}
              chartConfig={CHART_CFG}
              hideLegend={false}
            />
          </ChartCard>

      {/* ── Chart 2: BarChart – marks % per course ── */}
      <ChartCard title="📝 Marks % per Course">
        <BarChart
          data={barData}
          width={CHART_WIDTH}
          height={200}
          yAxisSuffix="%"
          chartConfig={{
            ...CHART_CFG,
            color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
          }}
          style={{ borderRadius: 8 }}
          showValuesOnTopOfBars
        />
      </ChartCard>

      {/* ── Chart 3: LineChart – GPA trend across semesters ── */}
      <ChartCard title="📈 GPA Trend (Semesters)">
        <LineChart
          data={lineData}
          width={CHART_WIDTH}
          height={200}
          yAxisSuffix=""
          chartConfig={{
            ...CHART_CFG,
            color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          }}
          bezier
          style={{ borderRadius: 8 }}
        />
      </ChartCard>

      {/* ── Chart 4: PieChart – credit-hour split ── */}
      <ChartCard title="🥧 Credit Hours Split">
        <PieChart
          data={pieData}
          width={CHART_WIDTH}
          height={180}
          chartConfig={CHART_CFG}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute={false}
        />
      </ChartCard>

      {/* ── Grade distribution text summary ── */}
      <ChartCard title="🎓 Current Grade Distribution">
        <View style={styles.gradeDist}>
          {gradeDist.map(({ grade, count }) => (
            <View key={grade} style={styles.gradeRow}>
              <Text style={styles.gradeLabel}>{grade}</Text>
              <View style={styles.gradeBar}>
                <View style={[styles.gradeBarFill, { flex: count }]} />
              </View>
              <Text style={styles.gradeCount}>{count} course{count > 1 ? 's' : ''}</Text>
            </View>
          ))}
        </View>
      </ChartCard>
        </>
      )}

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: COLORS.bg },
  section:  { marginTop: SPACING.md },
  statsRow: {
    flexDirection:    'row',
    paddingHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
  },
  gradeDist: { width: '100%', paddingTop: SPACING.sm },
  gradeRow:  {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  SPACING.sm,
  },
  gradeLabel: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.sm,
    fontWeight: '700',
    width:      36,
  },
  gradeBar: {
    flex:            1,
    height:          10,
    backgroundColor: COLORS.border,
    borderRadius:    5,
    overflow:        'hidden',
    marginHorizontal: SPACING.sm,
  },
  gradeBarFill: {
    height:          '100%',
    backgroundColor: COLORS.primary,
    borderRadius:    5,
  },
  gradeCount: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, width: 70, textAlign: 'right' },
});
