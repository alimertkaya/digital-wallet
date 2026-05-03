import { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ExchangeRate, SUPPORTED_CURRENCIES, Currency } from '../types/exchange';
import { getExchangeRates, findRateBetweenCurrencies, convertCurrency } from '../services/exchangeService';

export const useExchange = () => {
    const [rates, setRates] = useState<ExchangeRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sourceCurrency, setSourceCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);
    const [targetCurrency, setTargetCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[1]);
    const [amount, setAmount] = useState<string>('1');
    const [convertedAmount, setConvertedAmount] = useState<number>(0);
    const [currentRate, setCurrentRate] = useState<number | null>(null);
    const convertDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchRates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getExchangeRates();
            setRates(data);
        } catch (err) {
            console.error('Failed to fetch exchange rates:', err);
            setError('Döviz kurları yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchRates();
        }, [fetchRates])
    );

    useEffect(() => {
        if (rates.length > 0) {
            const rate = findRateBetweenCurrencies(rates, sourceCurrency.code, targetCurrency.code);
            setCurrentRate(rate);
        }
    }, [rates, sourceCurrency, targetCurrency]);

    useEffect(() => {
        const numAmount = parseFloat(amount) || 0;
        if (numAmount <= 0) { setConvertedAmount(0); return; }

        if (convertDebounce.current) clearTimeout(convertDebounce.current);

        convertDebounce.current = setTimeout(async () => {
            try {
                const result = await convertCurrency(sourceCurrency.code, targetCurrency.code, numAmount);
                setConvertedAmount(result);
            } catch {
                // backend erişilemezse mevcut kur ile lokal hesap
                if (currentRate !== null) {
                    setConvertedAmount(Number((numAmount * currentRate).toFixed(2)));
                }
            }
        }, 400);

        return () => { if (convertDebounce.current) clearTimeout(convertDebounce.current); };
    }, [amount, sourceCurrency, targetCurrency, currentRate]);

    const swapCurrencies = useCallback(() => {
        const temp = sourceCurrency;
        setSourceCurrency(targetCurrency);
        setTargetCurrency(temp);
    }, [sourceCurrency, targetCurrency]);

    const handleAmountChange = useCallback((value: string) => {
        const cleaned = value.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) return;
        setAmount(cleaned);
    }, []);

    return {
        rates,
        loading,
        error,
        sourceCurrency,
        targetCurrency,
        amount,
        convertedAmount,
        currentRate,
        setSourceCurrency,
        setTargetCurrency,
        handleAmountChange,
        swapCurrencies,
        refetch: fetchRates,
    };
};