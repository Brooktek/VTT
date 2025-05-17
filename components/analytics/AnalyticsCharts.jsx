// geminie/components/analytics/AnalyticsCharts.jsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import ChartCard from './ChartCard';
// Assume getCategoryColor and CATEGORIES are imported from a central util
// import { getCategoryColor } from '@/utils/colorUtils';
// import { CATEGORIES } from '@/utils/constants';

const screenWidth = Dimensions.get('window').width;

const AnalyticsCharts = ({ filteredTasks, colors, getCategoryColor, CATEGORIES_LIST }) => {
  const prepareBarChartData = useCallback(() => {
    const categoryTotals = {};
    CATEGORIES_LIST.forEach(cat => {
      if (cat !== "All") categoryTotals[cat] = 0; // Initialize all relevant categories
    });

    filteredTasks.forEach((task) => {
      if (categoryTotals[task.category] !== undefined) { // Ensure task.category is valid
        categoryTotals[task.category] += (task.totalTime || 0);
      }
    });

    const labels = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
    const data = labels.map(label => categoryTotals[label]);

    if (labels.length === 0) {
        return { labels: ["No Data"], datasets: [{ data: [0] }] };
    }

    return {
      labels,
      datasets: [
        {
          data,
          colors: labels.map(label => (opacity = 1) => getCategoryColor(label, opacity)) // For react-native-chart-kit specific color format
        },
      ],
    };
  }, [filteredTasks, getCategoryColor, CATEGORIES_LIST]);

  const preparePieChartData = useCallback(() => {
    const categoryCounts = {};
     CATEGORIES_LIST.forEach(cat => {
      if (cat !== "All") categoryCounts[cat] = 0;
    });

    filteredTasks.forEach((task) => {
      if (categoryCounts[task.category] !== undefined) {
        categoryCounts[task.category]++;
      }
    });

    const pieData = CATEGORIES_LIST
      .filter(category => category !== 'All' && categoryCounts[category] > 0)
      .map(category => ({
        name: category,
        population: categoryCounts[category],
        color: getCategoryColor(category), // getCategoryColor should return a hex string
        legendFontColor: colors.text,
        legendFontSize: 12,
      }));

    return pieData.length > 0 ? pieData : [{ name: "No Data", population: 1, color: colors.textDisabled, legendFontColor: colors.textSecondary, legendFontSize: 12 }];
  }, [filteredTasks, getCategoryColor, colors, CATEGORIES_LIST]);

  const chartConfig = {
    backgroundColor: colors.surfaceVariant,
    backgroundGradientFrom: colors.surfaceVariant,
    backgroundGradientTo: colors.surfaceVariant,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.primary || `rgba(0, 0, 0, ${opacity})`, // Primary text color for charts
    labelColor: (opacity = 1) => colors.textSecondary || `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.accent,
    },
  };

  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  const styles = StyleSheet.create({
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 20,
      marginBottom: 16,
    },
    noDataText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginVertical: 20,
      padding: 10,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
  });

  if (filteredTasks.length === 0 && (barChartData.labels[0] === "No Data" || pieChartData[0].name === "No Data") ) {
    return (
      <View>
        <Text style={styles.sectionTitle}>Visual Analytics</Text>
        <Text style={styles.noDataText}>No data available for charts in the selected range.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Visual Analytics</Text>
      {barChartData.labels[0] !== "No Data" ? (
        <ChartCard title="Hours per Category" colors={colors}>
          <BarChart
            data={barChartData}
            width={screenWidth - 64} // Adjust padding: 32 (ChartCard) + 32 (ScrollView) approx.
            height={230}
            chartConfig={chartConfig}
            showValuesOnTopOfBars
            verticalLabelRotation={barChartData.labels.length > 5 ? 30 : 0} // Rotate labels if too many
            fromZero
            yAxisLabel=""
            yAxisSuffix="h"
          />
        </ChartCard>
      ) : null}
      {pieChartData[0].name !== "No Data" ? (
        <ChartCard title="Task Distribution" colors={colors}>
          <PieChart
            data={pieChartData}
            width={screenWidth - 64}
            height={230}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute // Shows actual numbers instead of percentages if true
          />
        </ChartCard>
      ) : null}
       {(barChartData.labels[0] === "No Data" && pieChartData[0].name === "No Data" && filteredTasks.length > 0) &&
         <Text style={styles.noDataText}>Not enough data diversity to display charts for the current selection.</Text>
       }
    </View>
  );
};

export default AnalyticsCharts;