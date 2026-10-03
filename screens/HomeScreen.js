// ─────────────────────────────────────────────
//  HomeScreen – main menu of tappable cards
//  Each card navigates to a view by updating
//  the currentView state in App.js.
// ─────────────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '../theme';


// Navigation cards shown on the home screen
const MENU_ITEMS = [
  {
    id:       'dashboard',
    icon:     '📊',
    title:    'Dashboard',
    subtitle: 'Charts, GPA & overall summary',
    color:    '#6366f1',
  },
  {
    id:       'courses',
    icon:     '📚',
    title:    'Courses & Attendance',
    subtitle: 'Track attendance, mark present/absent',
    color:    '#06b6d4',
  },
  {
    id:       'calculator',
    icon:     '🧮',
    title:    'Grade Calculator',
    subtitle: 'What mark do I need in the final?',
    color:    '#f59e0b',
  },
  {
    id:       'addCourse',
    icon:     '➕',
    title:    'Add Course',
    subtitle: 'Register a new course',
    color:    '#22c55e',
  },
];

export default function HomeScreen({ onNavigate }) {
  // Stagger-fade each card in
  const anims = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      100,
      anims.map(a => Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 60 })),
    ).start();
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero banner */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🧭</Text>
        <Text style={styles.heroTitle}>FLEX Compass</Text>
        <Text style={styles.heroSub}>Smart Academic Planner</Text>
        <Text style={styles.heroStudent}>Muhammad Hamza Khan · 23I-3032</Text>
      </View>

      {/* Menu cards */}
      {MENU_ITEMS.map((item, idx) => (
        <Animated.View
          key={item.id}
          style={{
            opacity:   anims[idx],
            transform: [{ scale: anims[idx].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
          }}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => onNavigate(item.id)}
            activeOpacity={0.8}
          >
            {/* Gradient-like accent bar */}
            <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
            <View style={styles.cardContent}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Footer */}
      <Text style={styles.footer}>Software for Mobile Devices · FAST-NUCES</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },

  // Hero section
  hero: {
    alignItems:      'center',
    paddingVertical: SPACING.xl,
    paddingTop:      SPACING.xxl,
  },
  heroIcon:    { fontSize: 56, marginBottom: SPACING.sm },
  heroTitle: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.xxl + 4,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroSub: {
    color:     COLORS.primary,
    fontSize:  FONT_SIZE.md,
    fontWeight: '600',
    marginTop: 4,
  },
  heroStudent: {
    color:     COLORS.textDim,
    fontSize:  FONT_SIZE.xs,
    marginTop: SPACING.sm,
  },

  // Menu cards
  card: {
    backgroundColor:  COLORS.surface,
    borderRadius:     RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom:     SPACING.md,
    overflow:         'hidden',
    ...SHADOW,
  },
  cardAccent:  { height: 4 },
  cardContent: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       SPACING.md + 4,
  },
  cardIcon: { fontSize: 32, marginRight: SPACING.md },
  cardText: { flex: 1 },
  cardTitle: {
    color:      COLORS.text,
    fontSize:   FONT_SIZE.lg,
    fontWeight: '700',
  },
  cardSub: {
    color:     COLORS.textMuted,
    fontSize:  FONT_SIZE.sm,
    marginTop: 3,
  },
  arrow: { color: COLORS.textDim, fontSize: 26, fontWeight: '300' },

  footer: {
    color:     COLORS.textDim,
    fontSize:  FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
