import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { getWallets, createWallet, deleteWallet } from '../services/walletService';
import { Wallet } from '../types/wallet';
import { useToast } from '../context/ToastContext';

export const useWallets = () => {
    const { showToast } = useToast();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchWallets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getWallets();
            setWallets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchWallets();
        }, [fetchWallets])
    );

    const handleCreateWallet = async (name: string, currency: string) => {
        try {
            await createWallet(name, currency);
            setModalVisible(false);
            await fetchWallets();
            showToast("Yeni cüzdan oluşturuldu!", 'success');
        } catch (error) {
            showToast("Cüzdan oluşturulamadı.", 'error');
            throw error;
        }
    };

    const handleDeleteWallet = async (walletId: number, walletName: string) => {
        Alert.alert(
            "Cüzdanı Sil",
            `"${walletName}" cüzdanını silmek istediğinize emin misiniz?`,
            [
                { text: "Vazgeç", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteWallet(walletId);
                            await fetchWallets();
                            showToast("Cüzdan silindi.", 'success');
                        } catch (error: any) {
                            const message = error?.response?.data?.message || 'Cüzdan silinemedi.';
                            showToast(message, 'error');
                        }
                    }
                }
            ]
        );
    };

    return {
        wallets,
        loading,
        modalVisible,
        setModalVisible,
        handleCreateWallet,
        handleDeleteWallet,
        refreshWallets: fetchWallets
    };
};