import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Notification } from '../types/notification';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setError(null);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Bildirimler yüklenemedi');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchNotifications();
        }, [fetchNotifications])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchNotifications();
    }, [fetchNotifications]);


    const markAsRead = useCallback(async (id: number) => {
        try {
            await markNotificationAsRead(id);
            // Update local state optimistically
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        loading,
        error,
        refreshing,
        unreadCount,
        onRefresh,
        markAsRead,
        refetch: fetchNotifications,
    };
};
