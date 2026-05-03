import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

export const GradientDefs = ({ segments }: { segments: any[] }) => (
    <Defs>
        {segments.map((seg) => (
            <LinearGradient key={seg.id} id={seg.id} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={seg.color} stopOpacity="1" />
                <Stop offset="100%" stopColor={seg.gradientEnd || seg.color} stopOpacity="1" />
            </LinearGradient>
        ))}
    </Defs>
);