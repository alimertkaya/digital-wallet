import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import TransactionItem from './TransactionItem';
import { Transaction } from '../types/transaction';

interface RecentTransactionsProps {
    transactions: Transaction[];
    loading: boolean;
    currencyCode: string;
    onSeeAll: () => void;
}

const RecentTransactions = ({ transactions, loading, currencyCode, onSeeAll }: RecentTransactionsProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Son İşlemler</Text>
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.seeAll}>Tümü</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#F43F45E"/>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <TransactionItem item={item} currencyCode={currencyCode}/>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Henüz işlem yok.</Text>
                        </View>   
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, marginTop: 25 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#111' },
    seeAll: { color: '#F43F5E', fontWeight: '600' },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16, marginBottom: 12 },
    listContent: { paddingBottom: 20 },
    center: { padding: 20, alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    emptyText: { color: '#9CA3AF' }
});

export default RecentTransactions;