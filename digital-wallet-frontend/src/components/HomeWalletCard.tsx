import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Wallet } from '../types/wallet'; 
import { formatCurrency } from '../utils/formatters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface Props {
    item: Wallet;
    index: number;
}

const HomeWalletCard = ({ item, index }: Props) => {
    return (
        <View style={styles.cardContainer}>
            <View style={[styles.mainCard, index % 2 === 0 ? styles.bgPink : styles.bgBlue]}>
                {/* header */}
                <View style={styles.cardHeaderRow}>
                    <Text style={styles.totalLabel}>{item.name}</Text>
                    <View style={styles.currencyBadge}>
                        <Text style={styles.currencyText}>{item.currencyCode}</Text>
                    </View>
                </View>

                {/* balance */}
                <View>
                    <Text style={styles.balanceAmount}>
                        {formatCurrency(item.balance, item.currencyCode)}
                    </Text>
                </View>

                <View style={styles.circle1}/>
                <View style={styles.circle2} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: { width: width, alignItems: 'center', paddingBottom: 10 },
    mainCard: { 
        width: CARD_WIDTH, height: 180, borderRadius: 24, padding: 24, 
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden', 
        shadowColor: '#F43F5E', shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 
    },
    bgPink: { backgroundColor: '#F43F5E' }, // Rose 500
    bgBlue: { backgroundColor: '#3B82F6' }, // Blue 500
    
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    totalLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
    currencyBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    currencyText: { color: '#FFF', fontWeight: 'bold' },
    balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: 'bold', letterSpacing: 1 },
    
    circle1: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' },
    circle2: { position: 'absolute', bottom: -50, left: 10, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },
});

export default HomeWalletCard;