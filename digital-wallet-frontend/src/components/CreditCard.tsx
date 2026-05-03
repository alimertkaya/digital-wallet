import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CreditCardProps {
    cardHolderName: string;
    cardNumberMasked: string; 
    expiryDate: string;
}

const CreditCard = ({ cardHolderName, cardNumberMasked, expiryDate }: CreditCardProps) => {
    return (
        <View style={styles.creditCard}>
            <View style={styles.cardTop}>
                <MaterialCommunityIcons name="integrated-circuit-chip" size={40} color="#FFD700" />
                <MaterialCommunityIcons name="contactless-payment" size={30} color="#FFF" />
            </View>

            <Text style={styles.cardNumber}>{cardNumberMasked}</Text>

            <View style={styles.cardBottom}>
                <View>
                    <Text style={styles.cardLabel}>Card Holder</Text>
                    <Text style={styles.cardValue}>{cardHolderName}</Text>
                </View>
                <View>
                    <Text style={styles.cardLabel}>Expires</Text>
                    <Text style={styles.cardValue}>{expiryDate}</Text>
                </View>
                <MaterialCommunityIcons name="mastercard" size={40} color="#FFF" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Kredi Kartı
    creditCard: {
        backgroundColor: '#0F172A', borderRadius: 24, padding: 24, height: 200, marginBottom: 30,
        justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
    cardNumber: { color: '#FFF', fontSize: 22, letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginVertical: 20 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardLabel: { color: '#94A3B8', fontSize: 10, textTransform: 'uppercase' },
    cardValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});

export default CreditCard;
