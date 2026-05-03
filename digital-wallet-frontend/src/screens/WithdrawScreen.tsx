import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    FlatList, ActivityIndicator, StatusBar, ScrollView, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWithdraw } from '../hooks/useWithdraw';
import BankAccountCard from '../components/BankAccountCard';
import { Wallet } from '../types/wallet';
import { RootStackScreenProps } from '../types/navigation';

const WithdrawScreen = ({ navigation }: RootStackScreenProps<'Withdraw'>) => {
    const {
        wallets, selectedWallet, setSelectedWallet,
        amount, setAmount, description, setDescription,
        loading, processing, handleWithdraw
    } = useWithdraw();

    const [modalVisible, setModalVisible] = useState(false);

    // Helper: Modal List Item Render
    const renderModalItem = ({ item }: { item: Wallet }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setSelectedWallet(item);
                setModalVisible(false);
                setAmount(''); // Cüzdan değişince tutarı sıfırla (Güvenlik)
            }}
        >
            <View style={styles.modalIconBox}>
                <Text style={styles.modalCurrency}>{item.currencyCode}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.modalWalletName}>{item.name}</Text>
                <Text style={styles.modalBalance}>
                    Mevcut: {item.balance.toFixed(2)} {item.currencyCode}
                </Text>
            </View>
            {selectedWallet?.id === item.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#F43F5E" />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#F43F5E" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Para Çek</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Banka Kartı Görünümü */}
                <BankAccountCard username="MERT KAYA" />

                {/* Cüzdan Seçimi (Dropdown) */}
                <Text style={styles.label}>Hangi Cüzdandan?</Text>
                <TouchableOpacity
                    style={styles.selectorCard}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.selectorLeft}>
                        <View style={styles.selectorIconBox}>
                            <MaterialCommunityIcons name="wallet-outline" size={24} color="#F43F5E" />
                        </View>
                        <View>
                            <Text style={styles.selectorTitle}>
                                {selectedWallet ? selectedWallet.name : 'Cüzdan Seç'}
                            </Text>
                            <Text style={styles.selectorSubtitle}>
                                {selectedWallet
                                    ? `Kullanılabilir: ${selectedWallet.balance.toFixed(2)} ${selectedWallet.currencyCode}`
                                    : 'Lütfen seçiniz'}
                            </Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#94A3B8" />
                </TouchableOpacity>

                {/* Tutar Girişi */}
                <Text style={styles.label}>Çekilecek Tutar</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>
                        {selectedWallet?.currencyCode === 'USD' ? '$' : selectedWallet?.currencyCode === 'EUR' ? '€' : '₺'}
                    </Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#CBD5E1"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Hızlı Seçim Butonları */}
                <View style={styles.quickAmountContainer}>
                    {['100', '500', '1000', '5000'].map((val) => (
                        <TouchableOpacity
                            key={val}
                            style={styles.quickChip}
                            onPress={() => setAmount(val)}
                        >
                            <Text style={styles.quickText}>{val}</Text>
                        </TouchableOpacity>
                    ))}
                    {/* Bakiyenin Tamamı Butonu */}
                    <TouchableOpacity
                        style={[styles.quickChip, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}
                        onPress={() => selectedWallet && setAmount(String(selectedWallet.balance))}
                    >
                        <Text style={[styles.quickText, { color: '#F43F5E' }]}>Tümü</Text>
                    </TouchableOpacity>
                </View>

                {/* Açıklama Girişi */}
                <Text style={styles.label}>Açıklama (Opsiyonel)</Text>
                <View style={styles.descriptionContainer}>
                    <MaterialCommunityIcons name="text" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Örn: Kira ödemesi, Fatura, vs."
                        placeholderTextColor="#CBD5E1"
                        value={description}
                        onChangeText={setDescription}
                        maxLength={100}
                    />
                </View>

            </ScrollView>

            {/* Footer / Action Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, (!amount || processing) && styles.disabledButton]}
                    onPress={handleWithdraw}
                    disabled={!amount || processing}
                >
                    {processing ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Onayla ve Çek</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Cüzdan Seçim Modalı */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Hesap Seçin</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
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
    center: { justifyContent: 'center', alignItems: 'center' },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    content: { padding: 24 },

    label: { fontSize: 15, fontWeight: '700', color: '#334155', marginBottom: 12, marginTop: 15 },

    // Dropdown Card
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
    selectorSubtitle: { fontSize: 13, color: '#64748B' },

    // Input
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 20, paddingHorizontal: 20, paddingVertical: 15, marginTop: 5,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    currencySymbol: { fontSize: 24, fontWeight: 'bold', color: '#F43F5E', marginRight: 10 },
    amountInput: { flex: 1, fontSize: 32, fontWeight: 'bold', color: '#0F172A' },

    // Hızlı Seçim
    quickAmountContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    quickChip: {
        backgroundColor: '#EFF6FF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', minWidth: 60, alignItems: 'center'
    },
    quickText: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },

    // Description Input
    descriptionContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginTop: 5,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    descriptionInput: { flex: 1, fontSize: 15, color: '#0F172A' },

    // Footer
    footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#F1F5F9' },
    submitButton: {
        backgroundColor: '#F43F5E', paddingVertical: 18, borderRadius: 20, alignItems: 'center',
        shadowColor: '#F43F5E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
    },
    disabledButton: { backgroundColor: '#94A3B8', shadowOpacity: 0 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '60%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    closeModalButton: { padding: 5, backgroundColor: '#F1F5F9', borderRadius: 20 },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    modalIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    modalCurrency: { fontWeight: 'bold', color: '#64748B' },
    modalWalletName: { fontSize: 16, color: '#334155', fontWeight: '600' },
    modalBalance: { fontSize: 13, color: '#94A3B8' }
});

export default WithdrawScreen;