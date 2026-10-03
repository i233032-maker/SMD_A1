// ─────────────────────────────────────────────
//  CoursesScreen – FlatList with search, filter,
//  sort, mark present/absent, empty state
// ─────────────────────────────────────────────
import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Header      from '../components/Header';
import SearchBar   from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import CourseCard  from '../components/CourseCard';
import EmptyState  from '../components/EmptyState';

import { COLORS, SPACING, FONT_SIZE } from '../theme';
import { calcAttendancePct, calcCurrentMarks } from '../utils/calculations';
import { ATTENDANCE_THRESHOLD } from '../constants';

// Filter options
const FILTERS = [
  { label: 'All',     value: 'all'     },
  { label: '⚠️ At Risk', value: 'risk' },
  { label: '✅ Safe',    value: 'safe' },
];

// Sort options
const SORTS = [
  { label: 'Name ↑',      value: 'name'       },
  { label: 'Attendance ↑', value: 'attend_asc' },
  { label: 'Attendance ↓', value: 'attend_desc'},
  { label: 'Marks ↓',     value: 'marks_desc'  },
];

export default function CoursesScreen({ courses, onMarkPresent, onMarkAbsent, onDeleteCourse, onEditCourse, onAddCourse, onBack }) {
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState('all');
  const [sort,   setSort]   = useState('name');

  /**
   * Derive the visible course list by:
   * 1. Filter by search query (name or code)
   * 2. Filter by attendance status (all / risk / safe)
   * 3. Sort by chosen criterion
   * Uses .filter, .sort from Array – good viva talking point!
   */
  const visibleCourses = useMemo(() => {
    return courses
      // Step 1 – search filter
      .filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase()),
      )
      // Step 2 – status filter
      .filter(c => {
        const pct = calcAttendancePct(c.attendance);
        if (filter === 'risk') return pct < ATTENDANCE_THRESHOLD;
        if (filter === 'safe') return pct >= ATTENDANCE_THRESHOLD;
        return true;
      })
      // Step 3 – sort
      .sort((a, b) => {
        if (sort === 'name')        return a.name.localeCompare(b.name);
        if (sort === 'attend_asc')  return calcAttendancePct(a.attendance) - calcAttendancePct(b.attendance);
        if (sort === 'attend_desc') return calcAttendancePct(b.attendance) - calcAttendancePct(a.attendance);
        if (sort === 'marks_desc')  return calcCurrentMarks(b.assessments).pct - calcCurrentMarks(a.assessments).pct;
        return 0;
      });
  }, [courses, query, filter, sort]);

  return (
    <View style={styles.screen}>
      <Header title="Courses & Attendance" onBack={onBack} />

      {/* Search */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name or code…"
      />

      {/* Filter chips */}
      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />

      {/* Sort chips */}
      <FilterChips options={SORTS}   selected={sort}   onSelect={setSort}   />

      {/* Result count */}
      <Text style={styles.count}>
        {visibleCourses.length} course{visibleCourses.length !== 1 ? 's' : ''} found
      </Text>

      {/* Course list */}
      <FlatList
        data={visibleCourses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPresent={onMarkPresent}
            onAbsent={onMarkAbsent}
            onDelete={onDeleteCourse}
            onEdit={onEditCourse}
          />
        )}
        // Empty state when no results match or no courses exist
        ListEmptyComponent={
          courses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="📚"
                title="No courses yet"
                subtitle="Add your first course to start tracking."
              />
              <TouchableOpacity style={styles.addBtn} onPress={onAddCourse}>
                <Text style={styles.addBtnText}>+ Add Course</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <EmptyState
              icon="🔍"
              title="No courses found"
              subtitle="Try a different search term or filter."
            />
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  list:   { paddingBottom: SPACING.xl },
  count:  {
    color:     COLORS.textDim,
    fontSize:  FONT_SIZE.xs,
    paddingHorizontal: SPACING.md + 4,
    marginBottom: SPACING.xs,
  },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
