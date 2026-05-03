import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CompositeScreenProps } from '@react-navigation/native';
import { useHome } from "../hooks/useHome";
import { MainTabScreenProps, RootStackScreenProps, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<MainTabScreenProps<'HomeTab'>, RootStackScreenProps<keyof RootStackParamList>>;
import { useNotifications } from "../hooks/useNotifications";
import HomeWalletCard from "../components/HomeWalletCard";
import PaginationDots from "../components/PaginationDots";
import ActionButtons from "../components/ActionButtons";
import RecentTransactions from "../components/RecentTransactions";

const HomeScreen = ({ navigation }: Props) => {
    const {
        wallets, transactions, loadingWallets, loadingTrans,
        firstName, activeIndex, handleScroll
    } = useHome();

    const { unreadCount } = useNotifications();

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <View style={styles.profileButton}>
                    <Text style={styles.profileInitials}>{firstName.charAt(0) || 'U'}</Text>
                </View>
                <View>
                    <Text style={styles.welcomeText}>Tekrar Merhaba,</Text>
                    <Text style={styles.username}>{firstName || 'Kullanıcı'}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
            >
                <MaterialCommunityIcons name="bell-outline" size={24} color="#1E293B" />
                {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* header */}
            {renderHeader()}

            <FlatList
                data={[1]}
                keyExtractor={() => 'home-content'}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <>
                        {/* wallet cards slider */}
                        <View>
                            {loadingWallets ? (
                                <View style={{ height: 200, justifyContent: 'center' }}>
                                    <ActivityIndicator size="large" color="#F43F5E" />
                                </View>
                            ) : (
                                <View>
                                    <FlatList
                                        data={wallets}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item, index }) => <HomeWalletCard item={item} index={index} />}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        snapToAlignment="center"
                                        decelerationRate="fast"
                                        onScroll={handleScroll}
                                        scrollEventThrottle={16}
                                    />
                                    <PaginationDots count={wallets.length} activeIndex={activeIndex} />
                                </View>
                            )}
                        </View>

                        {/* buttons */}
                        <ActionButtons />

                        <RecentTransactions
                            transactions={transactions}
                            loading={loadingTrans}
                            currencyCode={wallets[activeIndex]?.currencyCode || '₺'}
                            onSeeAll={() => {
                                const currentWallet = wallets[activeIndex];
                                if (currentWallet) {
                                    navigation.navigate('Transactions', {
                                        walletId: currentWallet.id,
                                        currencyCode: currentWallet.currencyCode
                                    });
                                }
                            }}
                        />
                        <View style={{ height: 100 }} />
                    </>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    profileButton: { width: 45, height: 45, backgroundColor: '#F3F4F6', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    profileInitials: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    welcomeText: { fontSize: 13, color: '#6B7280' },
    username: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    notificationButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    notificationBadge: { position: 'absolute', top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    notificationBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#FFF' },

});

export default HomeScreen;