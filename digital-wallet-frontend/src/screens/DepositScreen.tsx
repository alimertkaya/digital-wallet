import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    FlatList, ActivityIndicator, StatusBar, ScrollView, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDeposit } from '../hooks/useDeposit';
import { Wallet } from '../types/wallet';
import CreditCard from '../components/CreditCard';

const DepositScreen = ({ navigation }: any) => {
    const {
        wallets, selectedWallet, setSelectedWallet,
        amount, setAmount, loading, depositing, handleDeposit
    } = useDeposit();

    const [walletModalVisible, setWalletModalVisible] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('KART SAHİBİ');

    useEffect(() => {
        AsyncStorage.getItem('firstName').then(name => {
            if (name) setCardHolderName(name.toUpperCase());
        });
    }, []);

    // Modal içindeki liste elemanı
    const renderModalItem = ({ item }: { item: Wallet }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedWallet(item);
                setWalletModalVisible(false);
            }}
        >
            <View style={styles.modalIconBox}>
                <Text style={styles.modalCurrency}>{item.currencyCode}</Text>
            </View>
            <Text style={styles.modalWalletName}>{item.name}</Text>
            {selectedWallet?.id === item.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#F43F5E" style={{ marginLeft: 'auto' }} />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#F43F5E" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC"/>
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.title}>Para Yatır</Text>
                <View style={{width: 40}} /> 
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* 1. Kredi Kartı Görünümü */}
                <CreditCard
                    cardHolderName={cardHolderName}
                    cardNumberMasked='**** **** **** ****'
                    expiryDate='--/--'
                />


                {/* 2. Cüzdan Seçimi (YENİ: Dropdown Tarzı) */}
                <Text style={styles.sectionLabel}>Hangi Cüzdana?</Text>
                <TouchableOpacity 
                    style={styles.selectorCard}
                    onPress={() => setWalletModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.selectorLeft}>
                        <View style={styles.selectorIconBox}>
                            <MaterialCommunityIcons name="wallet" size={24} color="#F43F5E" />
                        </View>
                        <View>
                            <Text style={styles.selectorTitle}>
                                {selectedWallet ? selectedWallet.name : 'Cüzdan Seç'}
                            </Text>
                            <Text style={styles.selectorSubtitle}>
                                {selectedWallet ? `${selectedWallet.currencyCode} Hesabı` : 'Lütfen seçiniz'}
                            </Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#94A3B8" />
                </TouchableOpacity>

                {/* 3. Tutar Girişi */}
                <Text style={styles.sectionLabel}>Yatırılacak Tutar</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>{selectedWallet?.currencyCode === 'USD' ? '$' : '₺'}</Text>
                    <TextInput 
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#CBD5E1"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* 4. Hızlı Tutarlar */}
                <View style={styles.quickAmountContainer}>
                    {['100', '250', '500', '1000'].map((val) => (
                        <TouchableOpacity 
                            key={val} 
                            style={styles.quickChip}
                            onPress={() => setAmount(val)}
                        >
                            <Text style={styles.quickText}>+{val}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Alt Buton */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.depositButton}
                    onPress={handleDeposit}
                    disabled={depositing}
                >
                    {depositing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Onayla ve Yatır</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* --- CÜZDAN SEÇİM MODALI --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={walletModalVisible}
                onRequestClose={() => setWalletModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Hesap Seçin</Text>
                            <TouchableOpacity onPress={() => setWalletModalVisible(false)} style={styles.closeModalButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={wallets}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderModalItem}
                        />
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    content: { padding: 24 },

    sectionLabel: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 10 },

    // YENİ: Dropdown Selector Stilleri
    selectorCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFF', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 5
    },
    selectorLeft: { flexDirection: 'row', alignItems: 'center' },
    selectorIconBox: { 
        width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFF1F2', 
        justifyContent: 'center', alignItems: 'center', marginRight: 15 
    },
    selectorTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
    selectorSubtitle: { fontSize: 14, color: '#64748B' },

    // Tutar Girişi
    inputContainer: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
        borderRadius: 20, paddingHorizontal: 20, paddingVertical: 15, marginTop: 15,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    currencySymbol: { fontSize: 24, fontWeight: 'bold', color: '#F43F5E', marginRight: 10 },
    amountInput: { flex: 1, fontSize: 32, fontWeight: 'bold', color: '#0F172A' },

    // Hızlı Tutarlar
    quickAmountContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    quickChip: { 
        backgroundColor: '#EFF6FF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE'
    },
    quickText: { color: '#2563EB', fontWeight: 'bold' },

    footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F1F5F9' },
    depositButton: { 
        backgroundColor: '#F43F5E', paddingVertical: 18, borderRadius: 20, alignItems: 'center',
        shadowColor: '#F43F5E', shadowOffset: {width:0, height:4}, shadowOpacity:0.3, shadowRadius:10
    },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    // Modal Stilleri
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '50%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    closeModalButton: { padding: 5, backgroundColor: '#F1F5F9', borderRadius: 20 },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    modalIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    modalCurrency: { fontWeight: 'bold', color: '#64748B' },
    modalWalletName: { fontSize: 16, color: '#334155', fontWeight: '600' }
});

export default DepositScreen;