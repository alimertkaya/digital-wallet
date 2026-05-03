import { useState } from 'react';
import { authService } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useToast } from '../context/ToastContext';

export const useRegister = (navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        tckn: '',
        birthDate: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^(\+90|0)?[0-9]{10}$/;
    const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

    const handleRegister = async (formData: any) => {
        if (!formData.username || !formData.password || !formData.email) {
            showToast("Lütfen kullanıcı adı, e-posta ve şifre alanlarını doldurunuz.", 'warning');
            return;
        }
        if (!EMAIL_REGEX.test(formData.email)) {
            showToast("Geçerli bir e-posta adresi giriniz.", 'warning');
            return;
        }
        if (!PASSWORD_REGEX.test(formData.password)) {
            showToast("Şifreniz en az 8 karakter, bir büyük harf ve bir rakam içermelidir.", 'warning');
            return;
        }
        if (!formData.firstName || !formData.lastName) {
            showToast("Lütfen ad ve soyad alanlarını doldurunuz.", 'warning');
            return;
        }
        if (!formData.phoneNumber) {
            showToast("Lütfen telefon numarası giriniz.", 'warning');
            return;
        }
        if (!PHONE_REGEX.test(formData.phoneNumber)) {
            showToast("Geçerli bir Türkiye telefon numarası giriniz (örn: 05321234567).", 'warning');
            return;
        }
        if (!formData.tckn || formData.tckn.length !== 11) {
            showToast("TCKN 11 haneli olmalıdır.", 'error');
            return;
        }
        if (!formData.birthDate) {
            showToast("Lütfen doğum tarihi giriniz.", 'warning');
            return;
        }
        if (!DATE_REGEX.test(formData.birthDate)) {
            showToast("Doğum tarihi YYYY-MM-DD formatında olmalıdır. Örn: 2000-01-15", 'error');
            return;
        }

        setLoading(true);
        try {
            await authService.register({ ...formData, birthDate: formData.birthDate });
            showToast("Kayıt başarılı! Giriş yapabilirsiniz.", 'success');
            navigation.navigate('Login');
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.message || "Kayıt işlemi başarısız.", 'error');
        } finally {
            setLoading(false);
        }
    };
    return {
        formData,
        loading,
        handleChange,
        handleRegister
    };
};