import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMonthlyAnalysis } from '../services/analyticsService';
import { AnalysisResponse } from '../types/analytics';

export const useAnalytics = () => {
    const [data, setData] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalysis = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getMonthlyAnalysis();
            setData(result);
        } catch (error) {
            console.error("Analiz verisi çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAnalysis();
        }, [fetchAnalysis])
    );
    return { data, loading, refresh: fetchAnalysis };
};