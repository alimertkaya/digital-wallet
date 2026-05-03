import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getWallets, depositToWallet } from '../services/walletService';
import { Wallet } from '../types/wallet';
import { useToast } from '../context/ToastContext';

export const useDeposit = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [depositing, setDepositing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const data = await getWallets();
                    setWallets(data);
                    if (data.length > 0) {
                        setSelectedWallet(currentWallet => {
                            return currentWallet || data[0];
                        });
                    }
                } catch {
                    showToast("Cüzdanlar yüklenmedi.", 'error');
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }, [])
    );

    const handleDeposit = async () => {
        if (!selectedWallet || !amount) {
            showToast("Lütfen cüzdan ve tutar giriniz.", 'warning');
            return;
        }

        setDepositing(true);
        try {
            await depositToWallet(selectedWallet.id, {
                amount: parseFloat(amount),
                description: 'Mobil Uygulama Yatırma'
            });
            showToast("Para yatırma talebiniz alındı.", 'success');
            navigation.goBack();
        } catch {
            showToast("Yatırma işlemi başarısız.", 'error');
        } finally {
            setDepositing(false);
        }
    };

    return {
        wallets,
        selectedWallet,
        setSelectedWallet,
        amount,
        setAmount,
        loading,
        depositing,
        handleDeposit
    };
};