import React, { useLayoutEffect } from "react";
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTransfer } from '../hooks/useTransfer';
import { Wallet } from '../types/wallet';
import { formatMoney, getSymbol } from '../utils/formatters';
import { CompositeScreenProps } from '@react-navigation/native';
import { MainTabScreenProps, RootStackScreenProps, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<MainTabScreenProps<'TransferTab'>, RootStackScreenProps<keyof RootStackParamList>>;

const TransferScreen = ({ navigation }: Props) => {
    const {
        allWallets, selectedWallet, targetSelfWallet,
        amount, setAmount, targetWalletId, setTargetWalletId, description, setDescription,
        loading, modalVisible, setModalVisible, transferMode, setTransferMode,
        selectionMode, selectedQuickAmount,
        handleTransfer, openWalletModal, handleSelectWallet, handleSwapWallets, handleQuickAmount
    } = useTransfer();

    useLayoutEffect (() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Para Gönder',
            headerBackTitle: 'Geri',
            headerTintColor: '#333',
        });
    }, [navigation]);

    // modal icindeki wallet
    const renderWalletItem = ({ item }: { item: Wallet }) => {
        const isSource = selectionMode === 'source';
        const isSelected = isSource ? selectedWallet?.id === item.id : targetSelfWallet?.id === item.id;
        const isDisabled = isSource ? targetSelfWallet?.id === item.id : selectedWallet?.id === item.id;

        return (
            <TouchableOpacity
            disabled={isDisabled} 
            style={[
                styles.modalItem,
                isSelected && styles.modalItemSelected,
                isDisabled && styles.modalItemDisabled
            ]}
            onPress={() => handleSelectWallet(item)}
        >
            <View style={styles.modalIconWrapper}>
                <Text style={styles.currencyText}>{item.currencyCode}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={[styles.modalItemName, isSelected && { color: '#FFF' }, isDisabled && { color: '#9CA3AF' }]}>{item.name} {isDisabled ? '(Seçili)' : ''}</Text>
                <Text style={[styles.modalItemBalance, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>Bakiye: {item.balance.toFixed(2)} {getSymbol(item.currencyCode)}</Text>
            </View>
            {isSelected && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FFF"/>
            )}
        </TouchableOpacity>
        );
    };

    const renderPeerContent = () => (
        <>
            {/* gonderen kart */}
            <Text style={styles.sectionLabel}>Gönderen Hesap</Text>
            <TouchableOpacity 
                style={styles.senderCard}
                onPress={() => openWalletModal('source')}
                activeOpacity={0.8}
            >
                <View style={styles.selectorIconBox}>
                    <MaterialCommunityIcons name="wallet" size={24} color="#FFF"/>
                </View>  
                <View style={{flex: 1}}>
                    <Text style={styles.selectorTitle}>
                        {selectedWallet ? selectedWallet.name : 'Hesap Seç'}
                    </Text>
                    <Text style={styles.selectorSubtitle}>
                        {selectedWallet
                            ? `Bakiye: ${formatMoney(selectedWallet.balance, getSymbol(selectedWallet.currencyCode))}`
                            : 'Lütfen seçiniz'}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#6B7280"/> 
            </TouchableOpacity>

            <Text style={styles.label}>Alıcı Cüzdan ID</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-arrow-right" size={24} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Örn: 4"
                    keyboardType="number-pad"
                    value={targetWalletId}
                    onChangeText={setTargetWalletId}
                />
            </View>

            <Text style={styles.label}>Tutar</Text>
            <View style={styles.amountRow}>
                <View style={styles.currencyBadge}>
                    <Text style={styles.currencyBadgeText}>
                        {getSymbol(selectedWallet?.currencyCode) || '₺'}
                    </Text>
                </View>
                <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="#D1D5DB"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            <View style={styles.quickAmountsRow}>
                {['50', '100', '250'].map(v => {
                    const isSelected = selectedQuickAmount === v;
                    return (
                        <TouchableOpacity
                            key={v}
                            style={[
                                styles.quickAmountChip,
                                isSelected && styles.quickAmountChipSelected
                            ]}
                            onPress={() => handleQuickAmount(v)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.quickAmountText,
                                    isSelected && styles.quickAmountTextSelected
                                ]}
                            >
                                {v}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={styles.label}>Açıklama (Opsiyonel)</Text>
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="text" size={24} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Örn: Kira"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>
        </>
    );

    const renderSelfContent = () => (
        <View style={styles.selfTransferContainer}>
            {/* gonderen hesap */}
            <Text style={styles.label}>Gönderen</Text>
            <TouchableOpacity
                style={styles.walletCard}
                onPress={() => setModalVisible(true)}
            >
                <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                    <MaterialCommunityIcons name="arrow-up-bold" size={24} color="EF4444"/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.walletCardTitle}>{selectedWallet?.name}</Text>
                    <Text style={styles.walletCardSubtitle}>
                        {formatMoney(selectedWallet?.balance || 0, getSymbol(selectedWallet?.currencyCode))}    
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#9CA3AF"/>
            </TouchableOpacity>

            <View style={styles.arrowContainer}>
                <View style={styles.line}/>
                
                <TouchableOpacity
                    style={styles.arrowCircle}
                    onPress={handleSwapWallets}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="swap-vertical" size={24} color="#FFF"/>
                </TouchableOpacity>
                <View style={styles.line}/>
            </View>

            <Text style={styles.label}>Alan Hesap</Text>
            <TouchableOpacity
                style={[styles.walletCard, !targetSelfWallet && styles.walletCardEmpty]}
                onPress={() => openWalletModal('target')}
            >
                <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
                    <MaterialCommunityIcons name="arrow-down-bold" size={24} color="10B981"/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.walletCardTitle}>
                        {targetSelfWallet ? targetSelfWallet.name : 'Hesap Seçin'}
                    </Text>
                    <Text style={styles.walletCardSubtitle}>
                        {targetSelfWallet
                            ? formatMoney(targetSelfWallet.balance, getSymbol(targetSelfWallet.currencyCode))
                            : 'Paranın yatacağı hesap'
                        }
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#9CA3AF"/>
            </TouchableOpacity>

            <Text style={[styles.label, {marginTop: 20}]}>Transfer Tutarı</Text>
            <View style={styles.amountInputContainer}>
                    <TextInput
                        style={styles.bigAmountInput}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                        textAlign="center"
                    />
                    <Text style={styles.currencySuffix}>{getSymbol(selectedWallet?.currencyCode)}</Text>
            </View>

        </View>
    ); 
    
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, transferMode == 'peer' && styles.tabButtonActive]}
                            onPress={() => setTransferMode('peer')}
                        >
                            <Text style={[styles.tabText, transferMode === 'peer' && styles.tabTextActive]}>Başkasına</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, transferMode === 'self' && styles.tabButtonActive]}
                            onPress={() => setTransferMode('self')}
                        >
                            <Text style={[styles.tabText, transferMode === 'self' && styles.tabTextActive]}>Kendime</Text>
                        </TouchableOpacity>
                    </View>
                    {transferMode === 'peer' ? renderPeerContent() : renderSelfContent()}

                    <View style={{ height: 20 }}/>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleTransfer}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF"/>
                        ) : (
                            <Text style={styles.buttonText}>Transferi Onayla</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* select wallet modal*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Hesap Seçin</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#333"/>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            // filter -> hedef seciliyorsa source walleti listeden çıkar
                            data={allWallets}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderWalletItem}
                            contentContainerStyle={{paddingBottom: 20}}
                            ListEmptyComponent={() => (
                                <Text style={{textAlign:'center', marginTop: 20, color:'#999'}}>
                                    Başka uygun cüzdan bulunamadı.
                                </Text>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    content: { padding: 24 },
    sectionLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 10 },

    senderCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16,
        borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    },
    selectorIconBox: {
        width: 48, height: 48, backgroundColor: '#1F2937', borderRadius: 14, 
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
    },
    selectorTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    selectorSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2},
    amountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
    currencyBadge: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, 
        backgroundColor: '#F3F4F6', marginRight: 12,
    },
    currencyBadgeText: {
        fontSize: 16, fontWeight: '600', color: '#111827',
    },
    amountInput: {
        flex: 1, fontSize: 28, fontWeight: 'bold', color: '#111827',
    },
    quickAmountsRow: { flexDirection: 'row', marginBottom: 20, },
    quickAmountChip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F9FAFB',
        borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8,
    },
    quickAmountText: {
        fontSize: 14, fontWeight: '500', color: '#111827',
    },
    quickAmountChipSelected: {
        backgroundColor: '#F43F5E15',   // çok hafif kırmızılık (alpha)
        borderColor: '#F43F5E',
    },
    
    quickAmountTextSelected: {
        color: '#F43F5E',
        fontWeight: '600',
    },

    formGroup: { marginBottom: 20 },
    iconWrapper: {
        width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 20,
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    senderLabel: { fontSize: 12, color: '#EF4444', fontWeight: '600' },
    senderName: { fontSize: 16, color: '#1F2937', fontWeight: 'bold' },
    label: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 8, marginTop: 10 },

    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', 
        borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 20, height: 55
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#111' },

    button: {
        backgroundColor: '#F43F5E', paddingVertical: 16, borderRadius: 16,
        alignItems: 'center', marginTop: 20, shadowColor: '#F43F5E',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    modalItem: {
        flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10,
        backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6'
    },
    modalItemSelected: {
        backgroundColor: '#10B981', borderColor: '#ECFDF5', borderWidth: 1,
    },
    modalItemDisabled: { opacity: 0.5 },
    modalIconWrapper: {
        width: 44, height: 44, backgroundColor: '#E5E7EB', borderRadius: 20,
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
    },
    currencyText: { fontWeight: 'bold', color: '#374151' },
    modalItemName: { fontSize: 16, fontWeight: '600', color: '#111' },
    modalItemBalance: { fontSize: 14, color: '#6B7280' },

    // TAB STİLLERİ
    tabContainer: {
        flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 24
    },
    tabButton: {
        flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10
    },
    tabButtonActive: {
        backgroundColor: '#FFF', 
        shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1, shadowRadius:4, elevation: 2
    },
    tabText: {
        fontWeight: '600', color: '#9CA3AF'
    },
    tabTextActive: {
        color: '#111', fontWeight: 'bold'
    },

    // KENDİME TRANSFER STİLLERİ
    selfTransferContainer: {
        marginBottom: 20
    },
    walletCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, shadowOffset: {width:0, height:4}
    },
    walletCardEmpty: {
        borderStyle: 'dashed', borderColor: '#9CA3AF', backgroundColor: '#F9FAFB'
    },
    walletCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    walletCardSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    iconBox: {
        width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12
    },
    
    // ORTA OK ALANI
    arrowContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: -10, zIndex: 10
    },
    line: {
        height: 1, backgroundColor: '#E5E7EB', flex: 1 // Çizgi yok etmek istersen burayı silip sadece arrowCircle bırakabilirsin
    },
    arrowCircle: {
        width: 44, height: 44, backgroundColor: '#3B82F6', borderRadius: 22, // Mavi renk kullandım farklılık olsun diye
        justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF'
    },

    // BÜYÜK TUTAR GİRİŞİ
    amountInputContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        marginVertical: 10
    },
    bigAmountInput: {
        fontSize: 40, fontWeight: '900', color: '#111', minWidth: 100
    },
    currencySuffix: {
        fontSize: 24, fontWeight: '600', color: '#9CA3AF', marginLeft: 8, marginTop: 8
    }
});

export default TransferScreen;