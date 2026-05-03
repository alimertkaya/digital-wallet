import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';
import { RootStackParamList } from '../types/navigation';
import { useToast } from '../context/ToastContext';
import { saveTokens } from '../utils/secureStorage';

export const useLogin = (navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>) => {
    const { showToast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (username === '' || password === '') {
            showToast('Lütfen kullanıcı adı ve şifrenizi giriniz.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const data = await authService.login({
                username: username,
                password: password
            });

            const { token, refreshToken, username: user, firstName } = data;

            await saveTokens(token, refreshToken ?? '');
            await AsyncStorage.multiSet([
                ['username', user],
                ['firstName', firstName],
            ]);

            navigation.replace('Home');
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.message || 'Kullanıcı adı veya şifre hatalı.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        username, setUsername,
        password, setPassword,
        loading,
        handleLogin
    };
};