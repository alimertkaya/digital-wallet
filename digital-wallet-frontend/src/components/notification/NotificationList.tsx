import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification } from '../../types/notification';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
    notifications: Notification[];
    loading: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onNotificationPress: (notification: Notification) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    loading,
    refreshing,
    onRefresh,
    onNotificationPress,
}) => {
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="bell-off-outline" size={48} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Bildirim Yok</Text>
            <Text style={styles.emptyMessage}>
                Henüz herhangi bir bildiriminiz bulunmuyor.
            </Text>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F43F5E" />
                <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <NotificationItem
                    notification={item}
                    onPress={onNotificationPress}
                />
            )}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={notifications.length === 0 ? styles.emptyListContent : styles.listContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#F43F5E']}
                    tintColor="#F43F5E"
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default NotificationList;
