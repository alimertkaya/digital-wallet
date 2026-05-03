import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber} from '../../utils/formatters';

interface NetFlowCardProps {
    netFlow: number;
}

export const NetFlowCard: React.FC<NetFlowCardProps> = ({ netFlow }) => {
    const isPositive = netFlow >= 0;
    const color = isPositive ? '#10B981' : '#F43F5E';
    const bgColor = isPositive ? '#DCFCE7' : '#FEE2E2';
    const icon = isPositive ? 'check-circle' : 'alert-circle';
    const message = isPositive ? 'Harika gidiyorsunuz! 🎉' : 'Harcamalar yüksek ⚠️';

    return (
        <View style={[styles.netFlowCard, { borderLeftColor: color }]}>
            <View style={styles.netFlowLeft}>
                <View style={[styles.netFlowIconCircle, { backgroundColor: bgColor }]}>
                    <MaterialCommunityIcons name={icon} size={24} color={color} />
                </View>
                <View style={styles.netFlowTextContainer}>
                    <Text style={styles.netFlowTitle}>Aylık Net Durum</Text>
                    <Text style={styles.netFlowSubtitle}>{message}</Text>
                </View>
            </View>
            <Text style={[styles.netFlowAmount, { color: color }]}>
                {isPositive ? '+' : ''}{formatNumber(netFlow)} ₺
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    netFlowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 20, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
    netFlowLeft: { flexDirection: 'row', alignItems: 'center' },
    netFlowIconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    netFlowTextContainer: { gap: 2 },
    netFlowTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
    netFlowSubtitle: { fontSize: 13, color: '#64748B' },
    netFlowAmount: { fontSize: 18, fontWeight: '800' },
});