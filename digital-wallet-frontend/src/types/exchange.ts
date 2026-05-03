export interface ExchangeRate {
    id: number;
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    updatedAt: string;
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
    flag: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'USD', name: 'Amerikan Doları', symbol: '$', flag: '🇺🇸' },
    { code: 'TRY', name: 'Türk Lirası', symbol: '₺', flag: '🇹🇷' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'İngiliz Sterlini', symbol: '£', flag: '🇬🇧' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code);
};