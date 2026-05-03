import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface ReceiptCardProps {
    amount: string;
    symbol: string;
    recipient: string;
    date: string;
    style?: StyleProp<ViewStyle>; // Animasyon için stil alabilsin
}

const ReceiptCard = ({ amount, symbol, recipient, date, style }: ReceiptCardProps) => {
    return (
        <View style={[styles.receiptCard, style]}>
            <View style={styles.row}>
                <Text style={styles.label}>Gönderilen Tutar</Text>
                <Text style={styles.valueHighlight}>{amount} {symbol}</Text>
            </View>
            <View style={styles.divider}/>    
            <View style={styles.row}>
                <Text style={styles.label}>Alıcı</Text>
                <Text style={styles.value}>{recipient}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Tarih</Text>
                <Text style={styles.value}>{date}</Text>
            </View>       
        </View>
    );
};

const styles = StyleSheet.create({
    receiptCard: {
        width: '100%', backgroundColor: '#F9FAFB', borderRadius: 24, padding: 24,
        borderWidth: 1, borderColor: '#E5E7EB'
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E5E7EB' },
    label: { fontSize: 14, color: '#6B7280' },
    value: { fontSize: 16, fontWeight: '600', color: '#111' },
    valueHighlight: { fontSize: 20, fontWeight: 'bold', color: '#10B981' },
})

export default ReceiptCard;