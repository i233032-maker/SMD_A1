// ─────────────────────────────────────────────
//  FLEX Compass – App.js (Root)
//
//  Navigation: currentView state + conditional
//  rendering.  No navigation library used.
//
//  Global state held here and passed via props.
//
//  Student: Muhammad Hamza Khan | 23I-3032
// ─────────────────────────────────────────────
import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
// SafeAreaView from the proper package (not deprecated react-native version)
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// ── Screens ──────────────────────────────────
import HomeScreen       from './screens/HomeScreen';
import DashboardScreen  from './screens/DashboardScreen';
import CoursesScreen    from './screens/CoursesScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import AddCourseScreen  from './screens/AddCourseScreen';

// ── Static data ───────────────────────────────
import { INITIAL_COURSES, SEMESTER_GPA_HISTORY } from './data/courses';

// ── Theme ─────────────────────────────────────
import { COLORS } from './theme';

export default function App() {
  // ─── Global state ──────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState('home');  // view-switching state
  const [courses, setCourses]         = useState(INITIAL_COURSES);
  const [editingCourse, setEditingCourse] = useState(null);

  // ─── Navigation helpers ────────────────────────────────────────────────
  /** Navigate to a named view */
  const navigateTo = useCallback(view => setCurrentView(view), []);
  /** Return to home screen */
  const goHome     = useCallback(()   => setCurrentView('home'), []);

  // ─── Attendance handlers (update attendance array inside state) ────────

  /** Mark a class as Present for a course */
  const markPresent = useCallback(courseId => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, attendance: [...c.attendance, true] }
          : c,
      ),
    );
    Alert.alert('✓ Marked Present', 'Attendance updated.');
  }, []);

  /** Mark a class as Absent for a course */
  const markAbsent = useCallback(courseId => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, attendance: [...c.attendance, false] }
          : c,
      ),
    );
    Alert.alert('✗ Marked Absent', 'Attendance updated.');
  }, []);

  /** Delete a course completely */
  const deleteCourse = useCallback((courseId, courseCode) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    Alert.alert('Course Deleted', `${courseCode} has been removed.`);
  }, []);

  // ─── Add/Edit Course handlers ──────────────────────────────────────────

  /** Prepend a new course to the list (updates all charts immediately) */
  const addCourse = useCallback(newCourse => {
    setCourses(prev => [newCourse, ...prev]);
  }, []);

  const handleEditCourse = useCallback(updatedCourse => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  }, []);

  const startEditing = useCallback(course => {
    setEditingCourse(course);
    setCurrentView('addCourse');
  }, []);

  const clearEditAndGoBack = useCallback(() => {
    setEditingCourse(null);
    setCurrentView('courses'); // return to courses view
  }, []);

  // ─── Conditional rendering (the "router") ─────────────────────────────
  return (
    // SafeAreaProvider is required by react-native-safe-area-context
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        {currentView === 'home' && (
          <HomeScreen onNavigate={navigateTo} />
        )}

        {currentView === 'dashboard' && (
          <DashboardScreen
            courses={courses}
            semesterGPA={SEMESTER_GPA_HISTORY}
            onBack={goHome}
          />
        )}

        {currentView === 'courses' && (
          <CoursesScreen
            courses={courses}
            onMarkPresent={markPresent}
            onMarkAbsent={markAbsent}
            onDeleteCourse={deleteCourse}
            onEditCourse={startEditing}
            onAddCourse={() => { setEditingCourse(null); navigateTo('addCourse'); }}
            onBack={goHome}
          />
        )}

        {currentView === 'calculator' && (
          <CalculatorScreen
            courses={courses}
            onBack={goHome}
          />
        )}

        {currentView === 'addCourse' && (
          <AddCourseScreen
            courses={courses}
            editingCourse={editingCourse}
            onAddCourse={addCourse}
            onEditCourse={handleEditCourse}
            onBack={clearEditAndGoBack}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: COLORS.bg,
  },
});
