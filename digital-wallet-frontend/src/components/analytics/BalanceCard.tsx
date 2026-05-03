// src/components/analytics/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber } from '../../utils/formatters';

interface BalanceCardProps {
    usdBalance: number;
    tlBalance: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ usdBalance, tlBalance }) => {
    return (
        <View style={styles.balanceCard}>
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
            <View style={styles.decorCircle3} />

            <View style={styles.balanceCardHeader}>
                <View style={styles.balanceIconContainer}>
                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#FFF" />
                </View>
                <Text style={styles.balanceCardTitle}>Toplam Varlık</Text>
            </View>

            <View style={styles.currencyContainer}>
                <View style={styles.currencySection}>
                    <View style={styles.currencyLabelRow}>
                        <Text style={styles.currencyFlag}>🇺🇸</Text>
                        <Text style={styles.currencyLabel}>USD</Text>
                    </View>
                    <Text style={styles.currencyAmount}>${formatNumber(usdBalance)}</Text>
                </View>

                <View style={styles.currencyDivider} />

                <View style={styles.currencySection}>
                    <View style={styles.currencyLabelRow}>
                        <Text style={styles.currencyFlag}>🇹🇷</Text>
                        <Text style={styles.currencyLabel}>TRY</Text>
                    </View>
                    <Text style={styles.currencyAmount}>₺{formatNumber(tlBalance)}</Text>
                </View>
            </View>

            <View style={styles.exchangeBadge}>
                <MaterialCommunityIcons name="sync" size={14} color="#10B981" />
                <Text style={styles.exchangeBadgeText}>Güncel Kur İle Hesaplandı</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    balanceCard: { backgroundColor: '#1E293B', borderRadius: 28, padding: 24, marginBottom: 20, overflow: 'hidden', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 12 },
    decorCircle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(99, 102, 241, 0.1)', top: -80, right: -60 },
    decorCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(16, 185, 129, 0.08)', bottom: -40, left: -30 },
    decorCircle3: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.03)', top: 40, right: 80 },
    balanceCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    balanceIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.12)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    balanceCardTitle: { fontSize: 16, fontWeight: '600', color: '#94A3B8' },
    currencyContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    currencySection: { flex: 1 },
    currencyLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    currencyFlag: { fontSize: 16, marginRight: 6 },
    currencyLabel: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    currencyAmount: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
    currencyDivider: { width: 1, height: 50, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginHorizontal: 20 },
    exchangeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.12)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
    exchangeBadgeText: { fontSize: 12, fontWeight: '600', color: '#10B981' },
});