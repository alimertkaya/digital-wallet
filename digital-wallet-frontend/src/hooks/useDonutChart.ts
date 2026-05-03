import { useMemo } from 'react';

export interface ChartSegmentData {
    value: number;
    color: string;
    gradientEnd?: string;
    label: string;
}

export const useDonutChart = (data: ChartSegmentData[], size: number, strokeWidth: number) => {
    return useMemo(() => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const center = size / 2;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let cumulativePercent = 0;

        const segments = data.map((item, index) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;
            const strokeDashoffset = circumference - (percent / 100) * circumference;
            const rotation = (cumulativePercent / 100) * 360 - 90;
            cumulativePercent += percent;

            return {
                ...item,
                id: `grad-${index}`,
                percent,
                strokeDashoffset,
                rotation,
            };
        });
        return { radius, circumference, center, segments }
    }, [data, size, strokeWidth]);
};