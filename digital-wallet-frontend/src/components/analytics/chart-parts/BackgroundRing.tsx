import React from 'react';
import { Circle } from 'react-native-svg';

export const BackgroundRing = ({ center, radius, strokeWidth }: any) => (
    <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#F1F5F9"
        strokeWidth={strokeWidth}
        fill="none"
    />
);