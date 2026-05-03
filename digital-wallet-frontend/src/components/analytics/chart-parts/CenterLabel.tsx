import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CenterLabel = ({ label, value, size }: any) => (
    <View style={[styles.centerContent, { width: size, height: size }]}>
        {label && <Text style={styles.centerLabel}>{label}</Text>}
        {value && <Text style={styles.centerValue}>{value}</Text>}
    </View>
);

const styles = StyleSheet.create({
    centerContent: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    centerLabel: { fontSize: 12, fontWeight: '500', color: '#64748B', marginBottom: 4 },
    centerValue: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
});