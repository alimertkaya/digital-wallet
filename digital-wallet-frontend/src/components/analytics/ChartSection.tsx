// src/components/analytics/ChartSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DonutChart from './DonutChart';
import { formatNumber } from '../../utils/formatters';

interface ChartSectionProps {
    chartData: any[];
    totalExpense: number;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ chartData, totalExpense }) => {
    return (
        <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Harcama Dağılımı</Text>
                <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>{formatNumber(totalExpense)} ₺</Text>
                </View>
            </View>
            
            {chartData.length > 0 ? (
                <View style={styles.chartWrapper}>
                    <DonutChart
                        data={chartData}
                        size={160}
                        strokeWidth={28}
                        centerLabel="Toplam"
                        centerValue={`${totalExpense.toFixed(0)} ₺`}
                    />
                    <View style={styles.compactLegend}>
                        {chartData.map((item, index) => (
                            <View key={index} style={styles.compactLegendItem}>
                                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                <Text style={styles.compactLegendText}>
                                    {item.label} <Text style={styles.compactLegendPercent}>%{item.percentage?.toFixed(0)}</Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="chart-pie" size={64} color="#E2E8F0" />
                    <Text style={styles.emptyChartText}>Bu ay henüz harcama yapılmadı</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chartSection: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
    totalBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    totalBadgeText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
    chartWrapper: { alignItems: 'center', paddingTop: 8 },
    compactLegend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12, gap: 6 },
    compactLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    compactLegendText: { fontSize: 11, fontWeight: '500', color: '#64748B' },
    compactLegendPercent: { fontWeight: '700', color: '#0F172A' },
    emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
    emptyChartText: { color: '#94A3B8', fontSize: 14, fontWeight: '500' },
});