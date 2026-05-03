import api from '../api';
import { RegisterRequest, LoginRequest } from '../types/auth';

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    refresh: async (refreshToken: string) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },
    logout: async () => {
        await api.post('/auth/logout');
    },
};