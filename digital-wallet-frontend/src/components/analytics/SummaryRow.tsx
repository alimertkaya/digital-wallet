// src/components/analytics/SummaryRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber } from '../../utils/formatters';

interface SummaryRowProps {
    income: number;
    expense: number;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ income, expense }) => {
    return (
        <View style={styles.summaryRow}>
            {/* Income Card */}
            <View style={styles.incomeCard}>
                <View style={styles.cardAccent} />
                <View style={styles.incomeIconCircle}>
                    <MaterialCommunityIcons name="arrow-bottom-left" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.cardTextContent}>
                    <Text style={styles.summaryLabel}>Gelir</Text>
                    <Text style={styles.incomeValue} numberOfLines={1} adjustsFontSizeToFit>
                        +{formatNumber(income)} ₺
                    </Text>
                </View>
                <View style={styles.cardBadge}>
                    <MaterialCommunityIcons name="chevron-up" size={14} color="#10B981" />
                    <Text style={styles.incomeBadgeText}>Bu ay</Text>
                </View>
            </View>
            
            {/* Expense Card */}
            <View style={styles.expenseCard}>
                <View style={[styles.cardAccent, styles.expenseAccent]} />
                <View style={styles.expenseIconCircle}>
                    <MaterialCommunityIcons name="arrow-top-right" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.cardTextContent}>
                    <Text style={styles.summaryLabel}>Gider</Text>
                    <Text style={styles.expenseValue} numberOfLines={1} adjustsFontSizeToFit>
                        -{formatNumber(expense)} ₺
                    </Text>
                </View>
                <View style={styles.cardBadge}>
                    <MaterialCommunityIcons name="chevron-down" size={14} color="#F43F5E" />
                    <Text style={styles.expenseBadgeText}>Bu ay</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
    incomeCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, overflow: 'hidden', shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6 },
    expenseCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, overflow: 'hidden', shadowColor: '#F43F5E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6 },
    cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#10B981' },
    expenseAccent: { backgroundColor: '#F43F5E' },
    incomeIconCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    expenseIconCircle: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F43F5E', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    cardTextContent: { marginBottom: 12 },
    summaryLabel: { fontSize: 13, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    incomeValue: { fontSize: 22, fontWeight: '800', color: '#10B981', letterSpacing: -0.5 },
    expenseValue: { fontSize: 22, fontWeight: '800', color: '#F43F5E', letterSpacing: -0.5 },
    cardBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
    incomeBadgeText: { fontSize: 11, fontWeight: '600', color: '#10B981' },
    expenseBadgeText: { fontSize: 11, fontWeight: '600', color: '#F43F5E' },
});