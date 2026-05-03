import { useState, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWallets } from '../services/walletService';
import { getWalletTransactions } from '../services/transactionService';
import { Wallet } from '../types/wallet';
import { Transaction } from '../types/transaction';

const { width } = Dimensions.get('window');

export const useHome = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingWallets, setLoadingWallets] = useState(true);
    const [loadingTrans, setLoadingTrans] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchUser = async () => {
        const name = await AsyncStorage.getItem('firstName');
        if (name) setFirstName(name);
    };

    const fetchWalletData = useCallback(async () => {
        setLoadingWallets(true);
        try {
            const data = await getWallets();
            setWallets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingWallets(false);
        }
    }, []);

    const fetchTransactionsData = useCallback(async (walletId: number) => {
        setLoadingTrans(true);
        try {
            const data = await getWalletTransactions(walletId);
            setTransactions(data.slice(0, 5));
        } catch (error) {
            console.error(error);
            setTransactions([]);
        } finally {
            setLoadingTrans(false);
        }
    }, []);

    // sayfa odaklanınca
    useFocusEffect(
        useCallback(() => {
            fetchUser();
            fetchWalletData();
        }, [fetchWalletData])
    );

    // cüzdan değişince veya yüklenince işlemleri güncelle
    useEffect(() => {
        if (wallets.length > 0 && wallets[activeIndex]) {
            fetchTransactionsData(wallets[activeIndex].id);
        }
    }, [activeIndex, wallets, fetchTransactionsData]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    return {
        wallets,
        transactions,
        loadingWallets,
        loadingTrans,
        firstName,
        activeIndex,
        handleScroll
    };
};