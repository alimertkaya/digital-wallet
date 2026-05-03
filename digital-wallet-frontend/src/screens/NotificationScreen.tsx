import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from '../components/notification/NotificationList';
import { Notification } from '../types/notification';
import { RootStackScreenProps } from '../types/navigation';

const NotificationScreen = ({ navigation }: RootStackScreenProps<'Notifications'>) => {
    const {
        notifications,
        loading,
        refreshing,
        unreadCount,
        onRefresh,
        markAsRead,
    } = useNotifications();

    const handleNotificationPress = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.title}>Bildirimler</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Notification List */}
            <NotificationList
                notifications={notifications}
                loading={loading}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onNotificationPress={handleNotificationPress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    unreadBadge: {
        marginLeft: 8,
        backgroundColor: '#F43F5E',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    unreadBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default NotificationScreen;
