import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useToast } from '../context/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getUserProfile, updateEmail, updatePhone, verifyEmail,
    verifyPhone, resendEmailCode, resendPhoneCode, updateUserInfo
} from '../services/userService';
import { authService } from '../services/authService';
import { clearTokens } from '../utils/secureStorage';
import { UserProfile, VerificationType } from '../types/user';

export const useProfile = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    const [verificationType, setVerificationType] = useState<VerificationType>('email');
    const [editingField, setEditingField] = useState<'email' | 'phone'>('email');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserProfile();
            setUser(data);
        } catch (error) {
            console.error("Profil yüklenemedi:", error);
            showToast("Profil bilgileri alınamadı.", 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUserProfile();
        }, [fetchUserProfile])
    );

    const handleLogout = () => {
        Alert.alert("Çıkış Yap", "Uygulamadan çıkmak istediğinize emin misiniz?", [
            { text: "Vazgeç", style: "cancel" },
            {
                text: "Çıkış Yap",
                style: "destructive",
                onPress: async () => {
                    try {
                        await authService.logout();
                    } catch {
                        // token geçersiz olsa bile local temizlik yapılmalı
                    } finally {
                        await clearTokens();
                        await AsyncStorage.multiRemove(['username', 'firstName']);
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }
            }
        ]);
    };

    const handleEditOpen = (field: 'email' | 'phone') => {
        setEditingField(field);
        setEditModalVisible(true);
    };

    const handleEditSubmit = async (value: string) => {
        setIsSubmitting(true);
        try {
            if (editingField === 'email') {
                await updateEmail(value);
                setVerificationType('email');
            } else {
                await updatePhone(value);
                setVerificationType('phone');
            }
            setEditModalVisible(false);
            // Auto-open verification modal
            setOtpModalVisible(true);
            showToast(`${editingField === 'email' ? 'E-posta' : 'Telefon'} adresinize doğrulama kodu gönderildi.`, 'info');
            await fetchUserProfile();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Güncelleme başarısız oldu.';
            showToast(message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOpen = (type: VerificationType = 'email') => {
        setVerificationType(type);
        setOtpModalVisible(true);
    };

    const handleVerifyClose = () => setOtpModalVisible(false);

    const handleVerifySubmit = async (code: string) => {
        setIsSubmitting(true);
        try {
            if (verificationType === 'email') {
                await verifyEmail(code);
            } else if (verificationType === 'phone') {
                await verifyPhone(code);
            }
            setOtpModalVisible(false);
            showToast("Doğrulama tamamlandı!", 'success');
            await fetchUserProfile();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Doğrulama başarısız oldu.';
            showToast(message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        try {
            if (verificationType === 'email') {
                await resendEmailCode();
            } else if (verificationType === 'phone') {
                await resendPhoneCode();
            }
            showToast("Yeni doğrulama kodu gönderildi.", 'success');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Kod gönderilemedi.';
            showToast(message, 'error');
        }
    };

    const handleEditNameSubmit = async (firstName: string, lastName: string) => {
        setIsSubmitting(true);
        try {
            await updateUserInfo(firstName, lastName);
            setEditNameModalVisible(false);
            showToast('Ad soyad güncellendi.', 'success');
            await fetchUserProfile();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Güncelleme başarısız oldu.';
            showToast(message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        loading,
        otpModalVisible,
        editModalVisible,
        editNameModalVisible,
        editingField,
        verificationType,
        isSubmitting,
        handleLogout,
        handleEditOpen,
        handleEditSubmit,
        handleEditNameSubmit,
        handleVerifyOpen,
        handleVerifyClose,
        handleVerifySubmit,
        handleResendCode,
        setEditModalVisible,
        setEditNameModalVisible,
        navigation,
        refetch: fetchUserProfile,
    };
};