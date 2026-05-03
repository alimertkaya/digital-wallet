import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExchangeRate, getCurrencyByCode } from '../../types/exchange';

interface ExchangeRateCardProps {
    rate: ExchangeRate;
}

const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ rate }) => {
    const targetCurrency = getCurrencyByCode(rate.targetCurrency);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.currencyRow}>
                <View style={styles.currencyBadge}>
                    <Text style={styles.flag}>{targetCurrency?.flag || '💱'}</Text>
                    <Text style={styles.currencyCode}>{rate.targetCurrency}</Text>
                </View>
                <View style={styles.rateContainer}>
                    <Text style={styles.rateValue}>
                        {rate.rate.toLocaleString('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                        })}
                    </Text>
                    <Text style={styles.rateLabel}>
                        1 {rate.sourceCurrency} = {rate.rate.toFixed(2)} {rate.targetCurrency}
                    </Text>
                </View>
            </View>
            <Text style={styles.updatedAt}>Son güncelleme: {formatDate(rate.updatedAt)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    currencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    currencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    flag: {
        fontSize: 24,
        marginRight: 8,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    rateContainer: {
        alignItems: 'flex-end',
    },
    rateValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    rateLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    updatedAt: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 12,
        textAlign: 'right',
    },
});

export default ExchangeRateCard;
