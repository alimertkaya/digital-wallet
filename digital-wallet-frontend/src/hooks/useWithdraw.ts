import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getWallets, withdrawFromWallet } from '../services/walletService';
import { Wallet } from '../types/wallet';
import { useToast } from '../context/ToastContext';

export const useWithdraw = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchWallets = async () => {
                setLoading(true);
                try {
                    const data = await getWallets();
                    if (isActive) {
                        setWallets(data);
                        setSelectedWallet(current => current || (data.length > 0 ? data[0] : null));
                    }
                } catch {
                    showToast("Cüzdan bilgileri alınamadı.", 'error');
                } finally {
                    if (isActive) setLoading(false);
                }
            };
            fetchWallets();
            return () => { isActive = false; };
        }, [])
    );

    const handleWithdraw = async () => {
        if (!selectedWallet || !amount) {
            showToast("Lütfen bir cüzdan seçin ve tutar girin.", 'warning');
            return;
        }

        const withdrawAmount = parseFloat(amount);
        if (withdrawAmount > selectedWallet.balance) {
            showToast(`Yetersiz bakiye: ${selectedWallet.balance} ${selectedWallet.currencyCode}`, 'warning');
            return;
        }

        setProcessing(true);
        try {
            await withdrawFromWallet(selectedWallet.id, withdrawAmount, description || undefined);
            showToast("Para çekme talebiniz alındı.", 'success');
            navigation.goBack();
        } catch (error: any) {
            const msg = error.response?.data?.message || "İşlem gerçekleştirilemedi.";
            showToast(msg, 'error');
        } finally {
            setProcessing(false);
        }
    };

    return {
        wallets,
        selectedWallet,
        setSelectedWallet,
        amount,
        setAmount,
        description,
        setDescription,
        loading,
        processing,
        handleWithdraw
    };
};