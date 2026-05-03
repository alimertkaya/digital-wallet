import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTransferSuccess } from '../hooks/useTransferSuccess';
import ReceiptCard from '../components/ReceiptCard';

const AnimatedReceiptCard = Animated.createAnimatedComponent(View);

const TransferSuccessScreen = () => {
    const { 
        amount, recipient, symbol, 
        scaleAnim, fadeAnim, 
        handleShareReceipt, handleGoHome 
    } = useTransferSuccess();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* animation */}
                <View style={styles.animationContainer}>
                    {/* gecici icon lottle yoksa */}
                    <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
                        <MaterialCommunityIcons name="check" size={60} color="#FFF"/>
                    </Animated.View>
                </View>
                <Text style={styles.title}>Transfer Başarılı!</Text>
                <Text style={styles.subtitle}>İşleminiz gerçekleştirildi.</Text>

                {/* dekont */}
                <AnimatedReceiptCard style={{ 
                    opacity: fadeAnim,
                    width: '100%',
                    transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] 
                    }}
                > 
                        <ReceiptCard
                            amount={amount}
                            symbol={symbol}
                            recipient={recipient}
                            date={new Date().toLocaleDateString('tr-TR')}
                        />
                </AnimatedReceiptCard>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleShareReceipt}>
                    <MaterialCommunityIcons name="share" size={20} color="#111" style={{marginRight: 8}}/>
                    <Text style={styles.secondaryButtonText}>Dekont Paylaş</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleGoHome}
                >
                    <Text style={styles.primaryButtonText}>Ana Sayfaya Dön</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    animationContainer: { marginBottom: 20 },
    iconCircle: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#10B981',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: "#10B981", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginTop: 20 },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, marginBottom: 40 },

    footer: { padding: 24 },
    primaryButton: {
        backgroundColor: '#10B981', padding: 18, borderRadius: 16, alignItems: 'center',
        shadowColor: "#10B981", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
    },
    primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        padding: 18, borderRadius: 16, marginBottom: 12, backgroundColor: '#F3F4F6'
    },
    secondaryButtonText: { color: '#111', fontSize: 16, fontWeight: '600' },
});

export default TransferSuccessScreen;