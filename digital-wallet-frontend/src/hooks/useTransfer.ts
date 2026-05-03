import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getWallets, transferFunds } from '../services/walletService';
import { useToast } from '../context/ToastContext';
import { Wallet } from '../types/wallet';
import { getSymbol } from '../utils/formatters';

type TransferMode = 'peer' | 'self';
type SelectionMode = 'source' | 'target';

export const useTransfer = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();

    // Data States
    const [allWallets, setAllWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null); // Kaynak
    const [targetSelfWallet, setTargetSelfWallet] = useState<Wallet | null>(null); // Hedef (Self)
    
    // Form States
    const [targetWalletId, setTargetWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [transferMode, setTransferMode] = useState<TransferMode>('peer');
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('source');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchWallets = async () => {
                try {
                    const data = await getWallets();
                    if (isActive && data.length > 0) {
                        setAllWallets(data);
                        setSelectedWallet(prev => prev || data[0]);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchWallets();
            return () => { isActive = false; };
        }, [])
    );

    const openWalletModal = (mode: SelectionMode) => {
        setSelectionMode(mode);
        setModalVisible(true);
    };

    const handleSelectWallet = (wallet: Wallet) => {
        if (selectionMode === 'source') {
            setSelectedWallet(wallet);
            // Eğer kaynak ve hedef aynı olursa hedefi sıfırla
            if (targetSelfWallet?.id === wallet.id) setTargetSelfWallet(null);
        } else {
            setTargetSelfWallet(wallet);
        }
        setModalVisible(false);
    };

    // Kendime Transferde Cüzdanları Takas Et
    const handleSwapWallets = () => {
        if (selectedWallet && targetSelfWallet) {
            const temp = selectedWallet;
            setSelectedWallet(targetSelfWallet);
            setTargetSelfWallet(temp);        
        }
    };

    // Hızlı Tutar Seçimi
    const handleQuickAmount = (value: string) => {
        setAmount(value);
        setSelectedQuickAmount(value);
    };

    const handleTransfer = async () => {
        if (!selectedWallet) { showToast('Gönderen cüzdan seçilmedi.', 'error'); return; }
        if (!amount || parseFloat(amount) <= 0) { showToast('Geçerli bir tutar giriniz.', 'warning'); return; }

        let finalTargetId = '';

        if (transferMode === 'peer') {
            if (!targetWalletId) { showToast('Alıcı cüzdan ID giriniz.', 'warning'); return; }
            finalTargetId = targetWalletId;
        } else {
            if (!targetSelfWallet) { showToast('Hedef cüzdanı seçiniz.', 'warning'); return; }
            if (targetSelfWallet.id === selectedWallet.id) { showToast('Aynı hesaba transfer yapılamaz.', 'warning'); return; }
            finalTargetId = String(targetSelfWallet.id);
        }

        setLoading(true);
        try {
            await transferFunds(selectedWallet.id, {
                targetWalletId: finalTargetId,
                amount: parseFloat(amount),
                description: description || (transferMode === 'self' ? 'Kendi Hesabıma' : 'Transfer')
            });
            
            navigation.navigate('TransferSuccess', {
                amount: amount,
                recipient: transferMode === 'self' ? targetSelfWallet?.name : finalTargetId,
                symbol: getSymbol(selectedWallet.currencyCode)
            });

            // Formu temizle
            setAmount('');
            setDescription('');
            setTargetWalletId('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Transfer başarısız.';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        // data
        allWallets, selectedWallet, targetSelfWallet,
        // form
        amount, setAmount, targetWalletId, setTargetWalletId, description, setDescription,
        // UI state
        loading, modalVisible, setModalVisible, transferMode, setTransferMode,
        selectionMode, selectedQuickAmount,
        // actions
        handleTransfer, openWalletModal, handleSelectWallet, handleSwapWallets, handleQuickAmount
    };
};
