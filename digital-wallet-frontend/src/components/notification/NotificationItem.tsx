import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification, NOTIFICATION_TYPE_CONFIG } from '../../types/notification';

interface NotificationItemProps {
    notification: Notification;
    onPress: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
    const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type];

    const formatTimeAgo = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Şimdi';
            if (diffMins < 60) return `${diffMins} dk önce`;
            if (diffHours < 24) return `${diffHours} saat önce`;
            if (diffDays < 7) return `${diffDays} gün önce`;

            return date.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
            });
        } catch {
            return '';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                !notification.read && styles.unreadContainer,
            ]}
            onPress={() => onPress(notification)}
            activeOpacity={0.7}
        >
            {/* Icon Badge */}
            <View style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}>
                <MaterialCommunityIcons
                    name={typeConfig.icon}
                    size={24}
                    color={typeConfig.color}
                />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !notification.read && styles.unreadTitle]} numberOfLines={1}>
                        {notification.title}
                    </Text>
                    <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>
            </View>

            {/* Unread Indicator */}
            {!notification.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    unreadContainer: {
        backgroundColor: '#FEFCE8',
        borderColor: '#FEF08A',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
        flex: 1,
        marginRight: 8,
    },
    unreadTitle: {
        color: '#0F172A',
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#94A3B8',
    },
    message: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F43F5E',
        marginLeft: 8,
    },
});

export default NotificationItem;
