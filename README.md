# FLEX Compass – Smart Academic Planner

**Student:** Muhammad Hamza Khan  
**Roll No:** 23I-3032  
**GitHub:** [i233032-maker](https://github.com/i233032-maker)  
**Course:** Software for Mobile Devices – FAST-NUCES

---

## Problem Statement

The real FLEX portal shows students raw attendance percentages and marks but provides **zero actionable guidance**. Students don't know:
- How many more classes they can miss before losing eligibility.
- What score they need in the final exam to achieve their desired grade.
- Which of their courses are at real risk.

---

## Proposed Solution

**FLEX Compass** is a mobile-first academic dashboard that turns raw numbers into **actionable insights**:
- Live attendance tracking with "classes you can still skip" counter.
- Grade What-If Calculator: enter a target grade → get the exact final-exam score required.
- Dynamic warnings when attendance drops below 75%.
- Visual charts (Progress, Bar, Line, Pie) for instant comprehension.

---

## Major Features

| Feature | Description |
|---|---|
|  Dashboard | 4 chart types + 3 KPI cards + collapsible warning banner |
|  Courses & Attendance | FlatList with search, filter (All/At Risk/Safe), sort, mark Present/Absent |
|  Grade Calculator | What-If form with full validation → required final mark |
|  Add Course | Validated form that updates all charts and lists live |
|  Live state | Marking attendance or adding courses instantly re-renders charts |

---

## How Each Requirement is Met

| Requirement | Implementation |
|---|---|
| No navigation library | `currentView` state in `App.js`, conditional rendering |
| Home screen with tappable cards | `HomeScreen.js` – staggered card animations |
| Back button on every screen | `Header` component receives `onBack` prop |
| react-native-chart-kit (3+ charts) | ProgressChart, BarChart, LineChart, PieChart in `DashboardScreen` |
| Animated API | Spring/fade on StatCard, scale on CourseCard & PrimaryButton, stagger on home cards |
| FlatList + search/filter/sort | `CoursesScreen.js` – `.filter`, `.sort`, `.map` on courses array |
| Empty state | `EmptyState` component shown when filter returns zero results |
| Mark Present / Absent | Buttons in `CourseCard` → `markPresent/markAbsent` in `App.js` → state update |
| Form validation | `CalculatorScreen` & `AddCourseScreen` – empty, non-numeric, out-of-range, duplicate code |
| KeyboardAvoidingView | Both form screens |
| Constants file | `constants.js` – `ATTENDANCE_THRESHOLD`, `GPA_SCALE`, `STATUS_COLOR` |
| Theme file | `theme.js` – `COLORS`, `SPACING`, `FONT_SIZE`, `RADIUS`, `SHADOW` |
| Reusable components | `Header`, `StatCard`, `ChartCard`, `CourseCard`, `SearchBar`, `FilterChips`, `PrimaryButton`, `InputField`, `EmptyState`, `WarningBanner` |
| Global state via props | `courses` array in `App.js`, passed down; callbacks (`onAddCourse`, `onMarkPresent`, etc.) bubble up changes |
| Data in `/data/courses.js` | `INITIAL_COURSES` + `SEMESTER_GPA_HISTORY` |
| Utility functions | `utils/calculations.js` – pure, reusable, commented |

---

## Setup & Run Instructions

### Prerequisites
- Node.js ≥ 18
- Expo Go app on your phone **OR** an Android/iOS emulator

### Install

```bash
cd SMD_A1
npm install
npx expo install react-native-svg
npm install react-native-chart-kit
```

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

---

## Project Structure

```
SMD_A1/
├── App.js                        ← Root: state + view switching
├── constants.js                  ← Thresholds, GPA scale, status colours
├── theme.js                      ← Design tokens (colours, spacing, fonts)
│
├── data/
│   └── courses.js                ← Static demo data
│
├── utils/
│   └── calculations.js           ← Pure calculation functions
│
├── components/
│   ├── Header.js                 ← Top bar with Back button
│   ├── StatCard.js               ← Animated KPI tile
│   ├── ChartCard.js              ← Chart title wrapper
│   ├── CourseCard.js             ← Course list item
│   ├── SearchBar.js              ← Search input
│   ├── FilterChips.js            ← Filter/sort pill row
│   ├── PrimaryButton.js          ← Animated action button
│   ├── InputField.js             ← Label + input + error
│   ├── EmptyState.js             ← Empty list placeholder
│   └── WarningBanner.js          ← Collapsible warning panel
│
└── screens/
    ├── HomeScreen.js             ← Main menu
    ├── DashboardScreen.js        ← Charts + KPIs
    ├── CoursesScreen.js          ← Attendance management
    ├── CalculatorScreen.js       ← Grade What-If
    └── AddCourseScreen.js        ← Add new course form
```

---

## 📸 Screenshots

> _Add screenshots here after running the app._

| Home | Dashboard | Courses | Calculator | Add Course |
|------|-----------|---------|------------|------------|
| ![home](#) | ![dashboard](#) | ![courses](#) | ![calculator](#) | ![add](#) |

---

## Dependencies

```json
"react-native-svg": "^15.x",
"react-native-chart-kit": "^6.x"
```
