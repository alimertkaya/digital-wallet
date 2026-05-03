import api from "../api";
import { ExchangeRate } from "../types/exchange";

const RATES_CACHE_TTL_MS = 5 * 60 * 1000;
let ratesCache: { data: ExchangeRate[]; fetchedAt: number } | null = null;

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
    if (ratesCache && Date.now() - ratesCache.fetchedAt < RATES_CACHE_TTL_MS) {
        return ratesCache.data;
    }
    const response = await api.get('/exchange-rates');
    ratesCache = { data: response.data, fetchedAt: Date.now() };
    return ratesCache.data;
};

export const convertCurrency = async (from: string, to: string, amount: number): Promise<number> => {
    const response = await api.get('/exchange-rates/convert', { params: { from, to, amount } });
    return response.data;
};

export const calculateConversion = (amount: number, rate: number): number => {
    if (isNaN(amount) || isNaN(rate) || amount <= 0) return 0;
    return Number((amount * rate).toFixed(2));
}

export const findRateBetweenCurrencies = (
    rates: ExchangeRate[],
    sourceCurrency: string,
    targetCurrency: string
): number | null => {
    if (sourceCurrency === targetCurrency) return 1;

    const directRate = rates.find(
        r => r.sourceCurrency === sourceCurrency && r.targetCurrency === targetCurrency
    );
    if (directRate) return directRate.rate;

    const inverseRate = rates.find(
        r => r.sourceCurrency === targetCurrency && r.targetCurrency === sourceCurrency
    );
    if (inverseRate) return 1 / inverseRate.rate;

    const sourceToUsd = rates.find(
        r => r.sourceCurrency === 'USD' && r.targetCurrency === sourceCurrency
    );
    const usdToTarget = rates.find(
        r => r.sourceCurrency === 'USD' && r.targetCurrency === targetCurrency
    );

    if (sourceToUsd && usdToTarget) {
        return usdToTarget.rate / sourceToUsd.rate;
    }

    return null;
}