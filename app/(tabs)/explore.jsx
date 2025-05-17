// geminie/app/(tabs)/explore.jsx
"use client";

import React, { useState, useCallback } from "react"; // Added useState and useCallback
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";

import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import DateFilterControls from "@/components/analytics/DateFilterControls";
import CategoryFilterButtons from "@/components/analytics/CategoryFilterButtons";
import RecentTasksList from "@/components/analytics/RecentTasksList";
import ActivityCalendarView from "@/components/analytics/ActivityCalendarView";

// Centralized constants and utils
import { MONTH_NAMES_SHORT, CATEGORIES } from "@/utils/constants";
import { getCategoryColor as getThemeCategoryColor } from "@/utils/colorUtils";

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();

  const {
    isLoading: isLoadingInitialData,
    isFiltering,
    allTasks,
    filteredTasks,
    dateFilter,
    handleDateFilterChange,
    selectedCategory,
    handleCategoryChange,
  } = useAnalyticsData();

  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState(true);

  const getCategoryColorForChart = useCallback((category, opacity = 1) => {
    return getThemeCategoryColor(category, colors, opacity);
  }, [colors]);


  const styles = getAnalyticsStyles(colors);

  if (isLoadingInitialData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <View style={styles.fullScreenLoadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <AnalyticsHeader
        onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('index')}
        title="Analytics"
        showAnalytics={showAnalyticsCharts}
        onToggleAnalytics={() => setShowAnalyticsCharts(!showAnalyticsCharts)}
        colors={colors}
      />

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <DateFilterControls
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
          monthNames={MONTH_NAMES_SHORT}
          colors={colors}
          isDarkMode={isDarkMode}
        />
        <CategoryFilterButtons
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          getCategoryColor={(cat) => getCategoryColorForChart(cat)}
          colors={colors}
        />

        {isFiltering ? (
          <View style={styles.inlineLoadingContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={[styles.loadingText, { fontSize: 1, marginLeft: 8 }]}>Filtering data...</Text>
          </View>
        ) : (
          <>

            {filteredTasks.length > 0 && (
              <RecentTasksList
                tasks={filteredTasks}
                getCategoryColor={(cat) => getCategoryColorForChart(cat)}
                colors={colors}
              />
            )}

            {showAnalyticsCharts && (
              <AnalyticsCharts
                filteredTasks={filteredTasks}
                colors={colors}
                getCategoryColor={getCategoryColorForChart}
                CATEGORIES_LIST = {CATEGORIES}
              />
            )}
             <ActivityCalendarView
                tasks={allTasks} 
                selectedMonth={dateFilter.month}
                selectedYear={parseInt(dateFilter.year)}
                monthNames={MONTH_NAMES_SHORT}
                colors={colors}
                dateFilterRange={dateFilter.range}
                selectedDayForHighlight={parseInt(dateFilter.day)}
            />
          </>
        )}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getAnalyticsStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  fullScreenLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inlineLoadingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  loadingText: { color: colors.textSecondary, marginTop: 12, fontSize: 14, opacity: 0.7 },
  contentScroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 0 },
  bottomSpace: { height: 60 },
});

export default AnalyticsScreen;
