// geminie/app/(tabs)/explore.jsx
"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
// import ActivityCalendarView from "@/components/analytics/ActivityCalendarView";
import AnalyticsSummaryCards from "@/components/analytics/AnalyticsSummaryCards"; 

import { MONTH_NAMES_SHORT } from "@/utils/constants";
import { getAllCategories, getCategoryDisplayColor } from "@/utils/categoryManager";


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
  const [allScreenCategories, setAllScreenCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchScreenCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
        const cats = await getAllCategories();
        setAllScreenCategories(cats);
    } catch (error) {
        console.error("Failed to load categories in ExploreScreen", error);
        // Optionally, set an error state here
    } finally {
        setIsLoadingCategories(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchScreenCategories();
    }, [fetchScreenCategories])
  );

  const getDynamicCategoryColorForExplore = useCallback((categoryNameOrObject) => {
    return getCategoryDisplayColor(categoryNameOrObject, allScreenCategories, colors, isDarkMode);
  }, [allScreenCategories, colors, isDarkMode]);

  const chartCategoriesList = useMemo(() => {
      const names = allScreenCategories.map(cat => cat.name);
      return ["All", ...new Set(names)]; // Use Set to ensure unique names if defaults and custom overlap by name
  }, [allScreenCategories]);
  
  const filterButtonCategories = useMemo(() => {
      // Ensure "All" is distinct and other categories are unique objects
      const uniqueCategories = [];
      const seenNames = new Set();
      allScreenCategories.forEach(cat => {
          if (!seenNames.has(cat.name)) {
              uniqueCategories.push(cat);
              seenNames.add(cat.name);
          }
      });
      return [{id: 'all-filter', name: "All", isDefault: true, colorKey: 'accent'}, ...uniqueCategories];
  }, [allScreenCategories]);


  const styles = getAnalyticsStyles(colors);

  const overallIsLoading = isLoadingInitialData || isLoadingCategories;

  if (overallIsLoading) { // Combined initial loading state
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <AnalyticsHeader
            onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('index')}
            title="Analytics" colors={colors} showAnalytics={false} onToggleAnalytics={()=>{}}/>
        <View style={styles.fullScreenLoadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading analytics data...</Text>
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
          categories={filterButtonCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          getCategoryColor={getDynamicCategoryColorForExplore}
          colors={colors}
        />

        <AnalyticsSummaryCards
          tasks={filteredTasks}       
          isLoading={isFiltering}
        />

        {isFiltering ? (
          <View style={styles.inlineLoadingContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={[styles.loadingText, { fontSize: 14, marginLeft: 8 }]}>Filtering data...</Text>
          </View>
        ) : (
          <>
            {/* <ActivityCalendarView
                tasks={dateFilter.range === 'month' || dateFilter.range === 'year' ? allTasks : filteredTasks}
                dateFilter={dateFilter}
                monthNames={MONTH_NAMES_SHORT}
                colors={colors}
                onDateChangeFromView={(newFilterParams) => {
                    handleDateFilterChange({
                        range: newFilterParams.range,
                        year: newFilterParams.year.toString(),
                        month: newFilterParams.month,
                        day: newFilterParams.day.toString(),
                    });
                }}
            /> */}
            {filteredTasks.length > 0 && (
              <RecentTasksList
                tasks={filteredTasks}
                getCategoryColor={getDynamicCategoryColorForExplore}
                colors={colors}
              />
            )}
            {showAnalyticsCharts && allScreenCategories.length > 0 && (
              <AnalyticsCharts
                filteredTasks={filteredTasks}
                colors={colors}
                getCategoryColor={getDynamicCategoryColorForExplore}
                CATEGORIES_LIST={chartCategoriesList}
              />
            )}
          </>
        )}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getAnalyticsStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  fullScreenLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  inlineLoadingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, minHeight: 60 },
  loadingText: { color: colors.textSecondary, marginTop: 12, fontSize: 14, textAlign: 'center' },
  contentScroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 0 }, // Adjust padding as needed
  bottomSpace: { height: 60 },
});

export default AnalyticsScreen;