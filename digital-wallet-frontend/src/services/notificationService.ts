import api from '../api';
import { Notification } from '../types/notification';

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
};
