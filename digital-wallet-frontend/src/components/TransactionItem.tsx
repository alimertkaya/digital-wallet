import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Transaction } from '../types/transaction';

interface Props {
    item: Transaction;
    currencyCode: string;
}

const TransactionItem = ({ item, currencyCode }: Props) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    const getIconInfo = (t: Transaction) => {
        if (t.type === 'INCOME') return { icon: 'arrow-down-left', color: '#10B981', bg: '#ECFDF5' };
        
        const desc = (t.description || "").toLowerCase();
        if (desc.includes('market') || desc.includes('shop')) return { icon: 'cart-outline', color: '#F43F5E', bg: '#FFF1F2' };
        if (desc.includes('food') || desc.includes('yemek')) return { icon: 'food-fork-drink', color: '#F59E0B', bg: '#FEF3C7' };
        if (desc.includes('transfer')) return { icon: 'bank-transfer', color: '#6366F1', bg: '#EEF2FF' };
        
        return { icon: 'credit-card-outline', color: '#64748B', bg: '#F1F5F9' };
    };

    const { icon, color, bg } = getIconInfo(item);
    const isIncome = item.type === 'INCOME';

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>

            <View style={styles.amountBox}>
                <Text style={[styles.amount, { color: isIncome ? '#10B981' : '#1E293B' }]}>
                    {isIncome ? '+' : '-'}{Math.abs(item.amount).toFixed(2)} {currencyCode}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, marginBottom: 12,
        // Hafif modern gölge
        borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1
    },
    iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
    date: { fontSize: 12, fontWeight: '500', color: '#94A3B8' },
    amountBox: { alignItems: 'flex-end' },
    amount: { fontSize: 16, fontWeight: '700' }
});

export default TransactionItem;