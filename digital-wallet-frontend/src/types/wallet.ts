export interface Wallet {
    id: number;
    name: string;
    balance: number;
    currencyCode: string;
}

export interface DepositRequest {
    amount: number;
    description: string;
}

export interface TransferRequest {
    targetWalletId: string;
    amount: number;
    description: string;
}