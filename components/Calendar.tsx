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

interface DateObject {
  day: number;
  currentMonth: boolean;
  month: number; // 0-11 for month index
  year: number;
}

interface Task {
  id: string
  task: string
  category: string
  date: string // Should be a string representation of a date, e.g., from Date.toDateString()
  timeSlotIds: string[]
  timeSlots: string[]
  timestamp: string
  totalTime: number
}


const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const { colors } = useTheme()
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedDateVisual, setSelectedDateVisual] = useState<number>(new Date().getDate())
  const [tasksForMonth, setTasksForMonth] = useState<Task[]>([])
  const [monthAnimation] = useState(new Animated.Value(0))

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"]

  const loadTasksForMonth = useCallback(async () => {
    try {
      const storedTasksJson = await AsyncStorage.getItem("tasks")
      if (storedTasksJson) {
        const allTasks = JSON.parse(storedTasksJson) as Task[];
        const filteredTasks = allTasks.filter((task: Task) => {
          const taskDate = new Date(task.date)
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
  }, [loadTasksForMonth]); // Re-run when currentYear or currentMonth changes

  const isLeapYear = useCallback((year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }, []);

  const getDaysInMonth = useCallback((year: number, month: number): number => {
    const daysInMonthArr = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return daysInMonthArr[month]
  }, [isLeapYear]);

  const getFirstDayOfMonth = useCallback((year: number, month: number): number => {
    const dayOfWeek = new Date(year, month, 1).getDay()
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1
  }, []);

  const handleDateSelection = (day: number, month = currentMonth, year = currentYear) => {
    // Ensure the selection is for the current displayed month if month/year aren't from prev/next month days
    if (month === currentMonth && year === currentYear) {
        setSelectedDateVisual(day);
    } else {
        // If a date from a prev/next month preview is clicked, switch to that month
        setCurrentMonth(month);
        setCurrentYear(year);
        setSelectedDateVisual(day); // And select the day
    }
    if (onDateSelect) {
      onDateSelect(new Date(year, month, day));
    }
  };

  const animateMonthChange = (direction: 'next' | 'prev', callback: () => void) => {
    const slideToValue = direction === 'next' ? -width : width;
    Animated.timing(monthAnimation, {
      toValue: slideToValue,
      duration: 250, // Faster animation
      useNativeDriver: true,
    }).start(() => {
      callback(); // Update month/year state
      monthAnimation.setValue(-slideToValue); // Prepare for slide-in from opposite direction
      Animated.timing(monthAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const navigateToPreviousMonth = () => {
    animateMonthChange('prev', () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 0) {
                setCurrentYear(cy => cy - 1);
                return 11;
            }
            return prevMonth - 1;
        });
    });
  };

  const navigateToNextMonth = () => {
     animateMonthChange('next', () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 11) {
                setCurrentYear(cy => cy + 1);
                return 0;
            }
            return prevMonth + 1;
        });
    });
  };

  const incrementYear = () => {
    // Optional: Add animation if desired, or just update state
    setCurrentYear(y => y + 1);
    // setSelectedDateVisual(1); // Optionally reset day or keep current if valid
  };

  const decrementYear = () => {
    setCurrentYear(y => y - 1);
    // setSelectedDateVisual(1);
  };


  const hasTasksOnDate = useCallback((day: number): boolean => {
    return tasksForMonth.some((task) => {
      const taskDate = new Date(task.date)
      return taskDate.getDate() === day
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

    const prevMonthDays: DateObject[] = [];
    for (let i = 0; i < firstDayOfCurrentMonthVal; i++) {
      prevMonthDays.unshift({
        day: daysInPrevMonthVal - i,
        currentMonth: false,
        month: prevMonth,
        year: prevMonthYear,
      })
    }

    const currentMonthDaysArr: DateObject[] = Array.from({ length: daysInCurrentMonthVal }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      month: currentMonth,
      year: currentYear,
    }))

    const totalDaysDisplayed = prevMonthDays.length + currentMonthDaysArr.length
    const nextMonthDaysArr: DateObject[] = [];
    const remainingCells = (Math.ceil(totalDaysDisplayed / 7) * 7) - totalDaysDisplayed;

    const nextMonthVal = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYearVal = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDaysArr.push({
        day: i,
        currentMonth: false,
        month: nextMonthVal,
        year: nextMonthYearVal,
      })
    }

    const allDays: DateObject[] = [...prevMonthDays, ...currentMonthDaysArr, ...nextMonthDaysArr];
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
                const isToday = dateObj.year === today.getFullYear() && dateObj.month === today.getMonth() && dateObj.day === today.getDate() && dateObj.currentMonth;
                const isSelectedDay = dateObj.day === selectedDateVisual && dateObj.month === currentMonth && dateObj.year === currentYear && dateObj.currentMonth;
                const isWeekend = dayIndex >= 5;
                const hasTask = dateObj.currentMonth && hasTasksOnDate(dateObj.day);
                const taskCategory = dateObj.currentMonth ? getTaskCategoryForDate(dateObj.day) : null;

                return (
                  <TouchableOpacity
                    key={`${dateObj.year}-${dateObj.month}-${dateObj.day}-${dayIndex}`}
                    style={[
                      styles.dateCell,
                      isSelectedDay && [styles.selectedDate, { borderColor: colors.primary || colors.selected }],
                    ]}
                    onPress={() => handleDateSelection(dateObj.day, dateObj.month, dateObj.year)}
                    disabled={!dateObj.currentMonth && false} // Allow clicking prev/next month days to navigate
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
                    {hasTask && dateObj.currentMonth && (
                      <View style={[styles.taskIndicator, { backgroundColor: getCategoryThemeColor(taskCategory) }]} />
                    )}
                    {isToday && (
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
          {/* Year Selector */}
          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={decrementYear} style={styles.yearNavButton}>
              <Ionicons name="chevron-back-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.yearText, { color: colors.textSecondary }]}>{currentYear}</Text>
            <TouchableOpacity onPress={incrementYear} style={styles.yearNavButton}>
              <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
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
  yearSelector: { // Styles for the new year selector
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10, // Space around the year text
  },
  yearNavButton: { // Style for the year +/- buttons
    padding: 4,
  },
  animatedCalendar: {
    flex: 1,
    width: '100%',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  weekdayName: {
    flex: 1,
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
    flex: 1,
  },
  dateCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "400",
  },
  selectedDate: {
    borderWidth: 1.5,
    borderRadius: 8,
  },
  taskIndicator: {
    position: "absolute",
    bottom: 5,
    alignSelf: 'center',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  todayIndicatorDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});

export default Calendar;
