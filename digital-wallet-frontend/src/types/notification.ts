export enum NotificationType {
    TRANSFER_IN = 'TRANSFER_IN',
    TRANSFER_OUT = 'TRANSFER_OUT',
    PAYMENT = 'PAYMENT',
    SECURITY = 'SECURITY',
    SYSTEM = 'SYSTEM',
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
}

export interface NotificationTypeConfig {
    icon: string;
    color: string;
    backgroundColor: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
    [NotificationType.TRANSFER_IN]: {
        icon: 'arrow-down-circle',
        color: '#10B981',
        backgroundColor: '#D1FAE5',
    },
    [NotificationType.TRANSFER_OUT]: {
        icon: 'arrow-up-circle',
        color: '#F43F5E',
        backgroundColor: '#FFE4E6',
    },
    [NotificationType.PAYMENT]: {
        icon: 'credit-card-outline',
        color: '#8B5CF6',
        backgroundColor: '#EDE9FE',
    },
    [NotificationType.SECURITY]: {
        icon: 'shield-check',
        color: '#F59E0B',
        backgroundColor: '#FEF3C7',
    },
    [NotificationType.SYSTEM]: {
        icon: 'information',
        color: '#3B82F6',
        backgroundColor: '#DBEAFE',
    },
};
