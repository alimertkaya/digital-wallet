import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { TabSelector } from '../components/analytics/TabSelector';
import { BalanceCard } from '../components/analytics/BalanceCard';
import { SummaryRow } from '../components/analytics/SummaryRow';
import { NetFlowCard } from '../components/analytics/NetFlowCard';
import { ChartSection } from '../components/analytics/ChartSection';
import CategoryList from '../components/analytics/CategoryList';

const AnalyticsScreen = () => {
    // 1. Logic Katmanı
    const { data, loading, chartData, totalExpense, netFlow } = useAnalyticsData();
    const [activeTab, setActiveTab] = useState<'analysis' | 'expenses'>('analysis');

    // 2. Loading State
    if (loading || !data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    // 3. UI Katmanı
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Modüler Tab Seçici */}
                <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'analysis' ? (
                    <>
                        <BalanceCard 
                            usdBalance={data.totalBalanceInUSD} 
                            tlBalance={data.totalBalanceInTL || 0} 
                        />
                        <SummaryRow 
                            income={data.monthlyIncome} 
                            expense={data.monthlyExpense} 
                        />
                        <NetFlowCard netFlow={netFlow} />
                    </>
                ) : (
                    <>
                        <ChartSection 
                            chartData={chartData} 
                            totalExpense={totalExpense} 
                        />
                        <View style={styles.listSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Kategoriler</Text>
                                <View style={styles.categoryCountBadge}>
                                    <Text style={styles.categoryCountText}>{data.categoryDistribution.length} kategori</Text>
                                </View>
                            </View>
                            <CategoryList categories={data.categoryDistribution} />
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    listSection: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
    categoryCountBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    categoryCountText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
});

export default AnalyticsScreen;