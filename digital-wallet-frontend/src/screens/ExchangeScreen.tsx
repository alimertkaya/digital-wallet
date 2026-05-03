import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExchange } from '../hooks/useExchange';
import CurrencySelector from '../components/exchange/CurrencySelector';
import ExchangeRateCard from '../components/exchange/ExchangeRateCard';
import { SUPPORTED_CURRENCIES } from '../types/exchange';
import { RootStackScreenProps } from '../types/navigation';

const ExchangeScreen = ({ navigation }: RootStackScreenProps<'Exchange'>) => {
    const {
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
        refetch,
    } = useExchange();

    const [sourceModalVisible, setSourceModalVisible] = useState(false);
    const [targetModalVisible, setTargetModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Filter rates to show only supported currencies
    const displayRates = rates.filter(rate =>
        SUPPORTED_CURRENCIES.some(c => c.code === rate.targetCurrency)
    );

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.loadingContainer} edges={['top']}>
                <ActivityIndicator size="large" color="#F43F5E" />
                <Text style={styles.loadingText}>Döviz kurları yükleniyor...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.title}>Döviz Çevirici</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#F43F5E']}
                        tintColor="#F43F5E"
                    />
                }
            >
                {/* Converter Card */}
                <View style={styles.converterCard}>
                    <Text style={styles.converterLabel}>Döviz Dönüştürücü</Text>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>{sourceCurrency.flag}</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={handleAmountChange}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                        />
                        <TouchableOpacity
                            style={styles.currencyBadge}
                            onPress={() => setSourceModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.currencyCode}>{sourceCurrency.code}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Swap Button */}
                    <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
                        <MaterialCommunityIcons name="swap-vertical" size={24} color="#F43F5E" />
                    </TouchableOpacity>

                    {/* Converted Amount Display */}
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultFlag}>{targetCurrency.flag}</Text>
                        <Text style={styles.resultAmount}>
                            {convertedAmount.toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Text>
                        <TouchableOpacity
                            style={styles.currencyBadge}
                            onPress={() => setTargetModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.resultCode}>{targetCurrency.code}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Current Rate Display */}
                    {currentRate && (
                        <Text style={styles.rateInfo}>
                            1 {sourceCurrency.code} = {currentRate.toFixed(4)} {targetCurrency.code}
                        </Text>
                    )}
                </View>

                {/* Currency Selection Modals */}
                <CurrencySelector
                    label=""
                    selectedCurrency={sourceCurrency}
                    onSelect={setSourceCurrency}
                    visible={sourceModalVisible}
                    onOpen={() => setSourceModalVisible(true)}
                    onClose={() => setSourceModalVisible(false)}
                />
                <CurrencySelector
                    label=""
                    selectedCurrency={targetCurrency}
                    onSelect={setTargetCurrency}
                    visible={targetModalVisible}
                    onOpen={() => setTargetModalVisible(true)}
                    onClose={() => setTargetModalVisible(false)}
                />

                {/* Exchange Rates Section */}
                <View style={styles.ratesSection}>
                    <View style={styles.ratesSectionHeader}>
                        <Text style={styles.ratesSectionTitle}>Güncel Kurlar</Text>
                        <Text style={styles.ratesSectionSubtitle}>1 USD Bazında</Text>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#94A3B8" />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                                <Text style={styles.retryText}>Tekrar Dene</Text>
                            </TouchableOpacity>
                        </View>
                    ) : displayRates.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="currency-usd-off" size={48} color="#94A3B8" />
                            <Text style={styles.emptyText}>Döviz kuru bulunamadı</Text>
                        </View>
                    ) : (
                        displayRates.map((rate) => (
                            <ExchangeRateCard key={rate.id} rate={rate} />
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#64748B',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    // Converter Card
    converterCard: {
        backgroundColor: '#F43F5E',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#F43F5E',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    converterLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginBottom: 16,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    currencySymbol: {
        fontSize: 28,
        marginRight: 12,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    currencyBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    swapButton: {
        alignSelf: 'center',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    resultFlag: {
        fontSize: 28,
        marginRight: 12,
    },
    resultAmount: {
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    resultCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    rateInfo: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    // Rates Section
    ratesSection: {
        marginTop: 32,
    },
    ratesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratesSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    ratesSectionSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#F43F5E',
        borderRadius: 12,
    },
    retryText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
});

export default ExchangeScreen;
