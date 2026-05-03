import React, { useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionItem from '../components/TransactionItem';
import { Transaction } from '../types/transaction';
import { useTransactions } from '../hooks/useTransactions';
import { RootStackScreenProps } from '../types/navigation';

const TransactionsScreen = ({ navigation, route }: RootStackScreenProps<'Transactions'>) => {
    const { walletId, currencyCode } = route.params;
    const { transactions, loading, refreshing, onRefresh } = useTransactions(walletId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Hesap Hareketleri',
            headerBackTitle: 'Geri',
            headerTintColor: '#0F172A',
            headerStyle: { backgroundColor: '#F8FAFC' },
            headerShadowVisible: false, // Modern, çizgisiz header
        });
    }, [navigation]);

    const sections = useMemo(() => {
        if (!transactions.length) return [];

        const grouped: { [key: string]: Transaction[] } = {};
        
        transactions.forEach(item => {
            const date = new Date(item.date);
            const today = new Date();
            const yesterday = new Date(); 
            yesterday.setDate(today.getDate() - 1);

            let title = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

            if (date.toDateString() === today.toDateString()) title = 'Bugün';
            else if (date.toDateString() === yesterday.toDateString()) title = 'Dün';

            if (!grouped[title]) grouped[title] = [];
            grouped[title].push(item);
        });

        return Object.keys(grouped).map(title => ({
            title,
            data: grouped[title]
        }));
    }, [transactions]);

    // Boş Durum (Veri yoksa)
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="text-box-search-outline" size={48} color="#94A3B8" />
            </View>
            <Text style={styles.emptyText}>Henüz işlem kaydı yok.</Text>
            <Text style={styles.emptySubText}>Bu cüzdanda yapılan işlemler burada listelenir.</Text>
        </View>
    );

    // Cüzdan Seçilmediyse Hata Göster
    if (!walletId) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text style={styles.errorText}>Cüzdan bilgisi bulunamadı.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {loading && !refreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#F43F5E" />
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemWrapper}>
                            <TransactionItem 
                                item={item} 
                                currencyCode={currencyCode || '₺'} 
                            />
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    stickySectionHeadersEnabled={false} 
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh} 
                            tintColor="#F43F5E" 
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    itemWrapper: { marginBottom: 0 }, 

    sectionHeader: { marginTop: 24, marginBottom: 12, backgroundColor: '#F8FAFC' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', 
        textTransform: 'uppercase', letterSpacing: 0.5 
    },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#334155' },
    emptySubText: { fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center' },
    errorText: { marginTop: 12, fontSize: 16, color: '#334155', fontWeight: '500' }
});

export default TransactionsScreen;