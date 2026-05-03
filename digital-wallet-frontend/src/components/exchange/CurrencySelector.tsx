import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Currency, SUPPORTED_CURRENCIES } from '../../types/exchange';

interface CurrencySelectorProps {
    selectedCurrency: Currency;
    onSelect: (currency: Currency) => void;
    label: string;
    visible: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCurrency,
    onSelect,
    label,
    visible,
    onOpen,
    onClose,
}) => {
    const renderCurrencyItem = ({ item }: { item: Currency }) => (
        <TouchableOpacity
            style={[
                styles.currencyItem,
                item.code === selectedCurrency.code && styles.currencyItemSelected,
            ]}
            onPress={() => {
                onSelect(item);
                onClose();
            }}
        >
            <Text style={styles.currencyFlag}>{item.flag}</Text>
            <View style={styles.currencyInfo}>
                <Text style={styles.currencyCode}>{item.code}</Text>
                <Text style={styles.currencyName}>{item.name}</Text>
            </View>
            {item.code === selectedCurrency.code && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#F43F5E" />
            )}
        </TouchableOpacity>
    );

    if (!label) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Para Birimi Seçin</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={SUPPORTED_CURRENCIES}
                            keyExtractor={(item) => item.code}
                            renderItem={renderCurrencyItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.selectorCard} onPress={onOpen} activeOpacity={0.8}>
                <View style={styles.selectorContent}>
                    <Text style={styles.selectorFlag}>{selectedCurrency.flag}</Text>
                    <View>
                        <Text style={styles.selectorCode}>{selectedCurrency.code}</Text>
                        <Text style={styles.selectorName}>{selectedCurrency.name}</Text>
                    </View>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#94A3B8" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Para Birimi Seçin</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={SUPPORTED_CURRENCIES}
                            keyExtractor={(item) => item.code}
                            renderItem={renderCurrencyItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
        marginTop: 16,
    },
    selectorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#64748B',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorFlag: {
        fontSize: 32,
        marginRight: 16,
    },
    selectorCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    selectorName: {
        fontSize: 14,
        color: '#64748B',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    currencyItemSelected: {
        backgroundColor: '#FFF1F2',
    },
    currencyFlag: {
        fontSize: 28,
        marginRight: 16,
    },
    currencyInfo: {
        flex: 1,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    currencyName: {
        fontSize: 14,
        color: '#64748B',
    },
});

export default CurrencySelector;
