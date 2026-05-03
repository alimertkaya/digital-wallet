export const getCategoryUI = (categoryKey: string) => {
    switch (categoryKey) {
        case 'FOOD_BEVERAGE': 
            return { label: 'Yeme & İçme', icon: 'food-fork-drink', color: '#FF9F1C' }; // Parlak Turuncu
        case 'SHOPPING': 
            return { label: 'Alışveriş', icon: 'cart', color: '#FF006E' }; // Canlı Pembe (Hot Pink)
        case 'TRANSPORTATION': 
            return { label: 'Ulaşım', icon: 'bus', color: '#3A86FF' }; // Elektrik Mavisi
        case 'BILLS': 
            return { label: 'Faturalar', icon: 'file-document-outline', color: '#8338EC' }; // Derin Mor
        case 'ENTERTAINMENT': 
            return { label: 'Eğlence', icon: 'gamepad-variant', color: '#FB5607' }; // Neon Kırmızı
        case 'TRANSFER': 
            return { label: 'Transfer', icon: 'bank-transfer', color: '#06D6A0' }; // Parlak Yeşil
        default: 
            return { label: 'Diğer', icon: 'dots-horizontal', color: '#00B4D8' }; // Canlı Turkuaz (Gri Yerine!)
    }
};