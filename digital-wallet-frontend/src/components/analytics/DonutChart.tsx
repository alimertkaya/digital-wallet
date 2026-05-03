import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import { ChartSegmentData, useDonutChart } from '../../hooks/useDonutChart';
import { GradientDefs } from './chart-parts/GradientDefs';
import { BackgroundRing } from './chart-parts/BackgroundRing';
import { DataSegments } from './chart-parts/DataSegments';
import { CenterLabel } from './chart-parts/CenterLabel';

interface DonutChartProps {
    data: ChartSegmentData[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    size = 200,
    strokeWidth = 24,
    centerLabel,
    centerValue,
}) => {
    const { radius, circumference, center, segments } = useDonutChart(data, size, strokeWidth);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <GradientDefs segments={segments}/>
                <BackgroundRing center={center} radius={radius} strokeWidth={strokeWidth}/>
                <DataSegments
                    segments={segments}
                    center={center}
                    radius={radius}
                    strokeWidth={strokeWidth}
                    circumference={circumference}
                />
            </Svg>
            <CenterLabel label={centerLabel} value={centerValue} size={size}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DonutChart;
