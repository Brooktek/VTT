// // geminie/components/analytics/ActivityCalendarView.jsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const ActivityCalendarView = ({
//   tasks = [],
//   selectedMonth,
//   selectedYear,
//   monthNames,
//   colors,
//   dateFilterRange,
//   selectedDayForHighlight
// }) => {
//   const styles = getActivityStyles(colors);

//   const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
//   const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
//   const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
//   const emptyStartCells = Array.from({ length: dayOffset }, (_, i) => `empty-start-${i}`);

//   const activeDaysInMonth = new Set();
//   tasks.forEach((task) => {
//     const taskDate = new Date(task.date);
//     if (taskDate.getFullYear() === selectedYear && taskDate.getMonth() === selectedMonth) {
//       activeDaysInMonth.add(taskDate.getDate());
//     }
//   });

//   const weekDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Define it once

//   return (
//     <View style={styles.activityCalendarCard}>
//         <View style={styles.calendarHeader}>
//             <Text style={styles.calendarTitle}>Monthly Activity</Text>
//             <Text style={styles.calendarMonthYear}>
//                 {monthNames[selectedMonth]} {selectedYear}
//             </Text>
//         </View>
//         <View style={styles.weekDaysContainer}>
//             {/* Corrected key usage here */}
//             {weekDayLabels.map((dayLabel, index) => (
//                 <Text key={`${dayLabel}-${index}`} style={styles.weekDayText}>{dayLabel}</Text>
//             ))}
//         </View>
//       <View style={styles.calendarGrid}>
//         {emptyStartCells.map(key => <View key={key} style={styles.calendarDayContainer} />)}
//         {monthDays.map((day) => {
//           const isActive = activeDaysInMonth.has(day);
//           const isSelected = dateFilterRange === 'day' && day === selectedDayForHighlight;
//           return (
//             <View key={day} style={styles.calendarDayContainer}>
//               <View
//                 style={[
//                   styles.calendarDay,
//                   isActive ? styles.activeDay : styles.emptyDay,
//                   isSelected && styles.selectedDayHighlight,
//                   isSelected && { borderColor: colors.primary, borderWidth: 2 },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.calendarDayText,
//                     isActive ? styles.activeDayText : styles.emptyDayText,
//                     isSelected && { fontWeight: 'bold', color: colors.primary }
//                   ]}
//                 >
//                   {day}
//                 </Text>
//               </View>
//             </View>
//           );
//         })}
//       </View>
//       <View style={styles.calendarLegend}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendDot, styles.legendDotActive]} />
//           <Text style={styles.legendText}>Active Day</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendDot, styles.legendDotEmpty]} />
//           <Text style={styles.legendText}>No Activity</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// // Styles remain the same...
// const getActivityStyles = (colors) => StyleSheet.create({
//   activityCalendarCard: {
//     backgroundColor: colors.surfaceVariant,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: colors.shadowOpacity || 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   calendarTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: colors.text,
//   },
//   calendarMonthYear: {
//     color: colors.primary,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   weekDaysContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 8,
//   },
//   weekDayText: {
//     color: colors.textSecondary,
//     fontSize: 11,
//     fontWeight: '500',
//     width: `${100/7}%`, // Equal width for each day
//     textAlign: 'center',
//   },
//   calendarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   calendarDayContainer: {
//     width: `${100/7}%`,
//     aspectRatio: 1,
//     padding: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   calendarDay: {
//     width: '90%',
//     height: '90%',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyDay: {
//     backgroundColor: colors.surface,
//   },
//   activeDay: {
//     backgroundColor: colors.primary + '40',
//   },
//   selectedDayHighlight: {
//     // Border applied dynamically
//   },
//   calendarDayText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   emptyDayText: {
//     color: colors.textSecondary,
//   },
//   activeDayText: {
//     color: colors.primary,
//     fontWeight: 'bold',
//   },
//   calendarLegend: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 16,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   legendDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 6,
//   },
//   legendDotActive: {
//     backgroundColor: colors.primary + '40',
//   },
//   legendDotEmpty: {
//     backgroundColor: colors.surface,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   legendText: {
//     color: colors.textSecondary,
//     fontSize: 12,
//   },
// });

// export default ActivityCalendarView;
