import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CreateWalletModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (name: string, currency: string) => Promise<void>;
}

const CreateWalletModal = ({ visible, onClose, onSubmit }: CreateWalletModalProps) => {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name) return;
        setLoading(true);
        await onSubmit(name, currency);
        setLoading(false);
        setName('');
    };

    const CurrencyOption = ({ code }: { code: string }) => (
        <TouchableOpacity
            style={[styles.currencyOption, currency === code && styles.currencyOptionSelected]}
            onPress={() => setCurrency(code)}
        >
            <Text style={[styles.currencyText, currency === code && { color: '#FFF' }]}>{code}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Cüzdan Oluştur</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Cüzdan Adı</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Örn: TL Cüzdanım'
                        placeholderTextColor="#94A3B8"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Para Birimi</Text>
                    <View style={styles.currencyContainer}>
                        <CurrencyOption code="TRY" />
                        <CurrencyOption code="USD" />
                        <CurrencyOption code="EUR" />
                        <CurrencyOption code="GBP" />
                    </View>

                    <TouchableOpacity style={styles.createButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.createButtonText}>Cüzdanı Ekle</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
    closeButton: { padding: 8, backgroundColor: '#F8FAFC', borderRadius: 50 },
    label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 16, marginBottom: 24, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0' },
    currencyContainer: { flexDirection: 'row', gap: 10, marginBottom: 30 },
    currencyOption: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
    currencyOptionSelected: { backgroundColor: '#F43F5E', borderColor: '#F43F5E' },
    currencyText: { fontWeight: '600', color: '#64748B' },
    createButton: { backgroundColor: '#F43F5E', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#F43F5E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    createButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default CreateWalletModal;