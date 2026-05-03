import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getWalletTransactions } from '../services/transactionService';
import { Transaction } from '../types/transaction';

export const useTransactions = (walletId?: number) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTransactions = useCallback(async (isRefresh = false) => {
        if (!walletId) return;

        if (!isRefresh) setLoading(true);
        try {
            const data = await getWalletTransactions(walletId);

            const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(sortedData);
        } catch (error) {
            console.error(`Cüzdan ID: ${walletId} işlemleri çekilemedi:`, error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [walletId]);

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [fetchTransactions])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions(true);
    };

    return {
        transactions,
        loading,
        refreshing,
        onRefresh
    };
};