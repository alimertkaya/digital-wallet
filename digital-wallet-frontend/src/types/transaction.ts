export interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    category?: string; // İkon seçimi için
}