import { useMemo } from 'react';
import { useAnalytics } from './useAnalytics'; 
import { getCategoryUI } from '../utils/categoryMapper';

export const useAnalyticsData = () => {
    const { data, loading } = useAnalytics();

    // Chart verisini hazırlama
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.categoryDistribution.map((item) => {
            const ui = getCategoryUI(item.category);
            return {
                value: item.amount,
                color: ui.color,
                gradientEnd: ui.color + 'CC',
                label: ui.label,
                percentage: item.percentage
            };
        });
    }, [data]);

    // Toplam Gider 
    const totalExpense = useMemo(() => {
        return data ? data.categoryDistribution.reduce((sum, item) => sum + item.amount, 0) : 0;
    }, [data]);

    const netFlow = data ? data.monthlyIncome - data.monthlyExpense : 0;
    return {
        data,
        loading,
        chartData,
        totalExpense,
        netFlow
    };
};