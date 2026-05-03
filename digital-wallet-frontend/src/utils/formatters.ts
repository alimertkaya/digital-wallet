export const getSymbol = (currency: string | undefined) => {
    if (!currency) return '';
    const symbols: Record<string, string> = {
        'TRY': '₺', 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥'
    };
    return symbols[currency] || currency;
};

export const formatMoney = (value: number, currency: string) => {
    return value.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + " " + getSymbol(currency);
};

export const formatCurrency = (amount: number, currencyCode: string) => {
    try {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(Math.abs(amount));
    } catch {
        return `${amount} ${currencyCode}`;
    }
};

export const formatNumber = (num: number) => {
    return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (dateInput: string | number[] | undefined) => {
    if (!dateInput) return '-';
    let date;
    if (Array.isArray(dateInput)) {
        date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2]);
    } else {
        date = new Date(dateInput);
    }
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const maskTCKN = (tckn: string | undefined) => {
    if (!tckn || tckn.length < 11) return '***********';
    return `${tckn.substring(0, 2)}*******${tckn.substring(9, 11)}`;
};