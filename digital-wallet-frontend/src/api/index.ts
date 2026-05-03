import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/env';
import { getToken, getRefreshToken, saveTokens, clearTokens } from '../utils/secureStorage';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                original.headers.Authorization = `Bearer ${token}`;
                return api(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            isRefreshing = false;
            return Promise.reject(error);
        }

        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const { token, refreshToken: newRefreshToken } = response.data;

            await saveTokens(token, newRefreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            processQueue(null, token);

            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
        } catch (refreshError) {
            processQueue(refreshError, null);
            await clearTokens();
            await AsyncStorage.multiRemove(['username', 'firstName']);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;