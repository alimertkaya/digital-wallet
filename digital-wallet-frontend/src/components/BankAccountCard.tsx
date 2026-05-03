import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    username: string;
}

const BankAccountCard = ({ username }: Props) => {
    return (
        <View style={styles.bankCard}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="bank" size={24} color="#FFF" />
                    <Text style={styles.bankName}>GARANTİ BBVA</Text>
                </View>
                <MaterialCommunityIcons name="contactless-payment" size={24} color="rgba(255,255,255,0.6)" />
            </View>

            <View style={styles.ibanContainer}>
                <Text style={styles.ibanLabel}>TR56 0006 2000 ... 4422</Text>
            </View>

            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.cardLabel}>Hesap Sahibi</Text>
                    <Text style={styles.cardValue}>{username || 'KULLANICI'}</Text>
                </View>
                <View style={styles.mastercardBadge}>
                    <View style={[styles.circle, { backgroundColor: '#EB001B', left: 0 }]} />
                    <View style={[styles.circle, { backgroundColor: '#F79E1B', right: 0 }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bankCard: {
        backgroundColor: '#059669', borderRadius: 24, padding: 24, height: 190, marginBottom: 30,
        justifyContent: 'space-between', shadowColor: '#059669', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bankName: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    ibanContainer: { marginTop: 10 },
    ibanLabel: { color: '#FFF', fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 2 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase' },
    cardValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
    mastercardBadge: { flexDirection: 'row', width: 40, height: 24, position: 'relative' },
    circle: { width: 24, height: 24, borderRadius: 12, position: 'absolute', opacity: 0.8 },
});

export default BankAccountCard;