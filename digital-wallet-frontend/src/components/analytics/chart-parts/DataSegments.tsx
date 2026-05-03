import React from 'react';
import { G, Circle } from 'react-native-svg';

export const DataSegments = ({ segments, center, radius, strokeWidth, circumference }: any) => (
    <>
        {segments.map((seg: any, index: number) => (
            <G key={index} rotation={seg.rotation} origin={`${center}, ${center}`}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={`url(#${seg.id})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="butt" // Düz bitiş
                    fill="none"
                />
            </G>
        ))}
    </>
);