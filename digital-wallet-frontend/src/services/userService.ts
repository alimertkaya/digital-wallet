import api from '../api';
import { UserProfile } from '../types/user';

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateEmail = async (email: string): Promise<UserProfile> => {
    const response = await api.put('/users/email', { newEmail: email });
    return response.data;
};

export const updatePhone = async (phoneNumber: string): Promise<UserProfile> => {
    const response = await api.put('/users/phone', { newPhoneNumber: phoneNumber });
    return response.data;
};

export const verifyEmail = async (code: string): Promise<void> => {
    await api.post('/users/verify-email', { code });
};

export const verifyPhone = async (code: string): Promise<void> => {
    await api.post('/users/verify-phone', { code });
};

export const resendEmailCode = async (): Promise<void> => {
    await api.post('/users/resend-email-code');
};

export const resendPhoneCode = async (): Promise<void> => {
    await api.post('/users/resend-phone-code');
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/users/change-password', { oldPassword, newPassword });
};

export const updateUserInfo = async (firstName: string, lastName: string): Promise<UserProfile> => {
    const response = await api.put('/users/info', { firstName, lastName });
    return response.data;
};

export const deactivateAccount = async (): Promise<void> => {
    await api.post('/users/deactivate');
};
