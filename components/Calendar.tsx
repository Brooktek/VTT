// geminie/components/Calendar.tsx
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "@/contexts/ThemeContext"

const { width } = Dimensions.get("window")

interface CalendarProps {
  onDateSelect: (date: Date) => void
}

// --- MUI IMPORT START ---
// interface DateObject { // Original position - moving to top with other interfaces
//   day: number
//   currentMonth: boolean
//   month: number
//   year: number
// }
// --- MUI IMPORT END ---
// --- RE-ADD THE MISSING DateObject INTERFACE HERE ---
interface DateObject {
  day: number;
  currentMonth: boolean;
  month: number; // 0-11 for month index
  year: number;
}
// --- END RE-ADD ---


interface Task { // This interface was correctly present
  id: string
  task: string
  category: string
  date: string // Should be a string representation of a date, e.g., from Date.toDateString()
  timeSlotIds: string[]
  timeSlots: string[] // Array of display strings for time slots
  timestamp: string // Or Date object for creation/update time
  totalTime: number // In hours or some consistent unit
}


const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const { colors } = useTheme()
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()) // 0-11
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedDateVisual, setSelectedDateVisual] = useState<number>(new Date().getDate()) // For visual selection within the calendar
  const [tasksForMonth, setTasksForMonth] = useState<Task[]>([])
  const [monthAnimation] = useState(new Animated.Value(0))

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"] // Assuming Monday is the start of the week

  const loadTasksForMonth = useCallback(async () => {
    try {
      const storedTasksJson = await AsyncStorage.getItem("tasks")
      if (storedTasksJson) {
        const allTasks = JSON.parse(storedTasksJson) as Task[];
        const filteredTasks = allTasks.filter((task: Task) => {
          const taskDate = new Date(task.date) // Assuming task.date is a string that can be parsed into a Date
          return taskDate.getFullYear() === currentYear && taskDate.getMonth() === currentMonth
        })
        setTasksForMonth(filteredTasks)
      } else {
        setTasksForMonth([])
      }
    } catch (error) {
      console.error("Failed to load tasks for month:", error)
      setTasksForMonth([])
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    loadTasksForMonth();
  }, [loadTasksForMonth]);

  const isLeapYear = useCallback((year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }, []);

  const getDaysInMonth = useCallback((year: number, month: number): number => {
    const daysInMonthArr = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return daysInMonthArr[month]
  }, [isLeapYear]);

  const getFirstDayOfMonth = useCallback((year: number, month: number): number => {
    const dayOfWeek = new Date(year, month, 1).getDay() // 0 (Sun) - 6 (Sat)
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust to 0 (Mon) - 6 (Sun)
  }, []);

  const handleDateSelection = (day: number, month = currentMonth, year = currentYear) => {
    setSelectedDateVisual(day); // Update internal visual selection state
    if (onDateSelect) {
      onDateSelect(new Date(year, month, day)); // Notify parent component
    }
  };

  const navigateToPreviousMonth = () => {
    Animated.timing(monthAnimation, {
      toValue: width, // Slide from left (positive width)
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonth((prevMonth) => {
        if (prevMonth === 0) {
          setCurrentYear(cy => cy - 1);
          return 11;
        }
        return prevMonth - 1;
      });
      monthAnimation.setValue(-width); // Prepare for next slide-in from right
      Animated.timing(monthAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      }).start();
    })
  };

  const navigateToNextMonth = () => {
    Animated.timing(monthAnimation, {
      toValue: -width, // Slide from right (negative width)
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonth((prevMonth) => {
        if (prevMonth === 11) {
          setCurrentYear(cy => cy + 1);
          return 0;
        }
        return prevMonth + 1;
      });
      monthAnimation.setValue(width); // Prepare for next slide-in from left
       Animated.timing(monthAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      }).start();
    })
  };

  const hasTasksOnDate = useCallback((day: number): boolean => {
    return tasksForMonth.some((task) => {
      const taskDate = new Date(task.date)
      return taskDate.getDate() === day // Ensure comparing day of the month
    })
  }, [tasksForMonth]);

  const getTaskCategoryForDate = useCallback((day: number): string | null => {
    const tasksForDay = tasksForMonth.filter((task) => {
      const taskDate = new Date(task.date)
      return taskDate.getDate() === day
    })
    if (tasksForDay.length > 0) {
      return tasksForDay[0].category
    }
    return null
  }, [tasksForMonth]);

  const getCategoryThemeColor = useCallback((category: string | null): string => {
    if (!category) return colors.accent || "#7B1FA2";
    switch (category) {
      case "Work": return colors.error || "#D32F2F";
      case "Personal": return colors.success || "#388E3C";
      case "Meeting": return colors.info || "#1976D2";
      case "School": return colors.warning || "#FBC02D";
      case "Team Time": return colors.teamTime || "#03A9F4";
      case "Friends": return colors.friends || "#9C27B0";
      default: return colors.accent || "#7B1FA2";
    }
  }, [colors]);

  const renderCalendarGrid = () => {
    const daysInCurrentMonthVal = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfCurrentMonthVal = getFirstDayOfMonth(currentYear, currentMonth)
    const today = new Date()
    const isCurrentMonthAndYear = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonthVal = getDaysInMonth(prevMonthYear, prevMonth);

    const prevMonthDays: DateObject[] = []; // Correctly typed with DateObject
    for (let i = 0; i < firstDayOfCurrentMonthVal; i++) {
      prevMonthDays.unshift({
        day: daysInPrevMonthVal - i,
        currentMonth: false,
        month: prevMonth,
        year: prevMonthYear,
      })
    }

    const currentMonthDaysArr: DateObject[] = Array.from({ length: daysInCurrentMonthVal }, (_, i) => ({ // Correctly typed
      day: i + 1,
      currentMonth: true,
      month: currentMonth,
      year: currentYear,
    }))

    const totalDaysDisplayed = prevMonthDays.length + currentMonthDaysArr.length
    const nextMonthDaysArr: DateObject[] = []; // Correctly typed
    const remainingCells = (Math.ceil(totalDaysDisplayed / 7) * 7) - totalDaysDisplayed;

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDaysArr.push({
        day: i,
        currentMonth: false,
        month: nextMonth,
        year: nextMonthYear,
      })
    }

    const allDays: DateObject[] = [...prevMonthDays, ...currentMonthDaysArr, ...nextMonthDaysArr]; // Correctly typed
    const weeks: DateObject[][] = []
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7))
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={[styles.weekdaysRow, { borderBottomColor: colors.border || "#333" }]}>
          {dayNames.map((dayName, index) => (
            <Text key={index} style={[styles.weekdayName, { color: index >= 5 ? (colors.weekend || colors.textSecondary) : colors.text }]}>
              {dayName}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={[styles.weekRow, { borderBottomColor: colors.divider || colors.border }]}>
              {week.map((dateObj, dayIndex) => {
                const isToday = isCurrentMonthAndYear && dateObj.day === today.getDate() && dateObj.currentMonth;
                const isSelectedDay = dateObj.day === selectedDateVisual && dateObj.month === currentMonth && dateObj.year === currentYear && dateObj.currentMonth;
                const isWeekend = dayIndex >= 5;
                const hasTask = dateObj.currentMonth && hasTasksOnDate(dateObj.day);
                const taskCategory = dateObj.currentMonth ? getTaskCategoryForDate(dateObj.day) : null;

                return (
                  <TouchableOpacity
                    key={`${dateObj.year}-${dateObj.month}-${dateObj.day}-${dayIndex}`} // More unique key
                    style={[
                      styles.dateCell,
                      isSelectedDay && [styles.selectedDate, { borderColor: colors.primary || colors.selected }],
                    ]}
                    onPress={() => handleDateSelection(dateObj.day, dateObj.month, dateObj.year)}
                    // disabled={!dateObj.currentMonth} // Keep this if you want to disable interaction with non-current month days
                  >
                    <Text
                      style={[
                        styles.dateText,
                        { color: dateObj.currentMonth ? (isWeekend ? (colors.weekend || colors.textSecondary) : colors.text) : (colors.inactive || colors.textDisabled) },
                        isSelectedDay && { color: colors.primary || colors.selected, fontWeight: "bold" },
                        isToday && !isSelectedDay && { color: colors.accent }
                      ]}
                    >
                      {dateObj.day}
                    </Text>
                    {hasTask && (
                      <View style={[styles.taskIndicator, { backgroundColor: getCategoryThemeColor(taskCategory) }]} />
                    )}
                    {isToday && ( // Simple dot for today if not selected
                       <View style={[styles.todayIndicatorDot, {backgroundColor: colors.accent }]}/>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.monthYearContainer}>
          <Text style={[styles.monthText, { color: colors.text }]}>{monthNames[currentMonth]}</Text>
          <Text style={[styles.yearText, {color: colors.textSecondary}]}>{currentYear}</Text>
        </View>
        <TouchableOpacity onPress={navigateToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.animatedCalendar, { transform: [{ translateX: monthAnimation }] }]}>
        {renderCalendarGrid()}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 8,
  },
  monthYearContainer: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: 'uppercase',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  animatedCalendar: {
    flex: 1,
    width: '100%', // Ensure it takes full width for animation
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  weekdaysRow: {
    flexDirection: "row",
    // justifyContent: "space-around", // Not needed if children flex
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  weekdayName: {
    flex: 1, // Make each weekday name container take equal width
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    flex: 1, // Allow week rows to expand
  },
  dateCell: {
    flex: 1, // Each cell takes equal width in a row
    aspectRatio: 1, // Make cells square-ish
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioned indicators
    padding: 1, // Minimal padding, adjust as needed
  },
  dateText: {
    fontSize: 15, // Adjust for visibility
    fontWeight: "400",
  },
  selectedDate: { // Style for the selected day's TouchableOpacity
    borderWidth: 1.5,
    borderRadius: 8, // Or make it circular: borderRadius: (width / 7 * 0.9) / 2 for example
    // backgroundColor: colors.primary + '20', // Optional: slight background tint for selection
  },
  taskIndicator: { // Small dot under the date number
    position: "absolute",
    bottom: 5, // Adjust to not overlap too much with date number
    alignSelf: 'center', // Center it horizontally
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  todayIndicatorDot: { // Distinct indicator for 'today'
    position: 'absolute',
    top: 3, // Position it subtly
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});

export default Calendar;