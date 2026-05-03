import api from '../api';
import { Wallet, DepositRequest, TransferRequest } from '../types/wallet';

export const createWallet = async (name: string, currency: string) => {
    const response = await api.post('/wallets', {
        name,
        currencyCode: currency,
        balance: 0
    });
    return response.data;
};

export const getWallets = async (page = 0, size = 20): Promise<Wallet[]> => {
    const response = await api.get('/wallets', { params: { page, size } });
    return response.data;
};

export const depositToWallet = async (walletId: number, data: DepositRequest) => {
    const response = await api.post(`/wallets/${walletId}/deposit`, data);
    return response.data;
};

export const withdrawFromWallet = async (walletId: number, amount: number, description?: string) => {
    const response = await api.post(`/wallets/${walletId}/withdraw`, {
        amount: amount,
        description: description || 'Banka Hesabına Çekim'
    });
    return response.data;
};

export const transferFunds = async (sourceWalletId: number, data: TransferRequest) => {
    const response = await api.post(`/wallets/${sourceWalletId}/transfer`, data);
    return response.data;
};

export const deleteWallet = async (walletId: number): Promise<void> => {
    await api.delete(`/wallets/${walletId}`);
};