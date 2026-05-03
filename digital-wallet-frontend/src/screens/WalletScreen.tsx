import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useWallets } from '../hooks/useWallets';
import WalletCard from '../components/WalletCard';
import CreateWalletModal from '../components/CreateWalletModal';
import { Wallet } from '../types/wallet';
import { CompositeScreenProps } from '@react-navigation/native';
import { MainTabScreenProps, RootStackScreenProps, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<MainTabScreenProps<'WalletTab'>, RootStackScreenProps<keyof RootStackParamList>>;

const WalletScreen = ({ navigation }: Props) => {
    const {
        wallets,
        loading,
        modalVisible,
        setModalVisible,
        handleCreateWallet,
        handleDeleteWallet,
        refreshWallets
    } = useWallets();

    const handleWalletPress = (wallet: Wallet) => {
        navigation.navigate('Transactions', {
            walletId: wallet.id,
            currencyCode: wallet.currencyCode
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Cüzdanlarım</Text>
                <Text style={styles.subtitle}>
                    {wallets.length} aktif cüzdan
                </Text>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="wallet-outline" size={64} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Henüz cüzdan yok</Text>
            <Text style={styles.emptyDescription}>
                İlk cüzdanınızı oluşturmak için + butonuna tıklayın
            </Text>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                {renderHeader()}

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#F43F5E" />
                    </View>
                ) : (
                    <FlatList
                        data={wallets}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <WalletCard
                                item={item}
                                onPress={() => handleWalletPress(item)}
                                onDelete={() => handleDeleteWallet(item.id, item.name)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmptyState}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={refreshWallets}
                                colors={['#F43F5E']}
                                tintColor="#F43F5E"
                            />
                        }
                    />
                )}

                <CreateWalletModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleCreateWallet}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 2,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F43F5E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F43F5E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default WalletScreen;
