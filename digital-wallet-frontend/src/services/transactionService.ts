import api from '../api'; 
import { Transaction } from '../types/transaction';

export const getWalletTransactions = async (walletId: number, page = 0, size = 20): Promise<Transaction[]> => {
    const response = await api.get(`/wallets/${walletId}/transactions`, { params: { page, size } });
    return response.data;
};