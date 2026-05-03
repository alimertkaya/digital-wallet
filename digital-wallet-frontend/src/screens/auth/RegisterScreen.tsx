import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRegister } from '../../hooks/useRegister';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackScreenProps } from '../../types/navigation';

const RegisterScreen = ({ navigation }: RootStackScreenProps<'Register'>) => {
    const { formData, loading, handleChange, handleRegister } = useRegister(navigation);
    const [step, setStep] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validateStep1 = () => {
        const { username, email, password } = formData;
        if (!username || !email || !password) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
            return false;
        }
        if (password.length < 8) {
            Alert.alert('Güvenlik Uyarısı', 'Şifreniz en az 8 karakter olmalıdır.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigation.goBack();
        }
    };

    const renderStep1 = () => (
        <View>
            <AuthInput
                label="Kullanıcı Adı"
                placeholder="Örn: mertkaya"
                value={formData.username}
                onChangeText={(t) => handleChange('username', t)}
                autoCapitalize="none"
                icon="account-outline"
            />
            <AuthInput
                label="E-Posta"
                placeholder="mert@ornek.com"
                value={formData.email}
                onChangeText={(t) => handleChange('email', t)}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="email-outline"
            />
            <AuthInput
                label="Şifre"
                placeholder="********"
                value={formData.password}
                onChangeText={(t) => handleChange('password', t)}
                secureTextEntry
                icon="lock-outline"
            />
        </View>
    );

    const renderStep2 = () => (
        <View>
            <View style={styles.row}>
                <View style={styles.flex1}>
                    <AuthInput
                        label="Ad"
                        placeholder="Mert"
                        value={formData.firstName}
                        onChangeText={(t) => handleChange('firstName', t)}
                    />
                </View>
                <View style={[styles.flex1, { marginLeft: 12 }]}>
                    <AuthInput
                        label="Soyad"
                        placeholder="Kaya"
                        value={formData.lastName}
                        onChangeText={(t) => handleChange('lastName', t)}
                    />
                </View>
            </View>

            <AuthInput
                label="Telefon"
                placeholder="5551234568"
                value={formData.phoneNumber}
                onChangeText={(t) => handleChange('phoneNumber', t)}
                keyboardType="phone-pad"
                icon="phone-outline"
            />

            <View style={styles.row}>
                <View style={styles.flex1}>
                    <AuthInput
                        label="TCKN"
                        placeholder="11 haneli"
                        value={formData.tckn}
                        onChangeText={(t) => handleChange('tckn', t)}
                        keyboardType="number-pad"
                        maxLength={11}
                    />
                </View>
                <View style={[styles.flex1, { marginLeft: 12 }]}>
                    {/* K6: DateTimePicker kurulunca bu TouchableOpacity içine picker ekle */}
                    <Text style={styles.inputLabel}>Doğum Tarihi</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={formData.birthDate ? styles.dateText : styles.datePlaceholder}>
                            {formData.birthDate || 'YYYY-MM-DD'}
                        </Text>
                        <MaterialCommunityIcons name="calendar" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.birthDate ? new Date(formData.birthDate) : new Date(2000, 0, 1)}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={(event: DateTimePickerEvent, date?: Date) => {
                                setShowDatePicker(false);
                                if (event.type === 'set' && date) {
                                    handleChange('birthDate', date.toISOString().split('T')[0]);
                                }
                            }}
                        />
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <AuthLayout
            footer={
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#334155" />
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Hesap Oluştur 🚀</Text>
                <Text style={styles.subtitle}>
                    {step === 1 ? 'Hemen aramıza katıl ve finansal özgürlüğünü keşfet.' : 'Son birkaç detay kaldı!'}
                </Text>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepContainer}>
                <View style={[styles.stepItem, step >= 1 && styles.activeStep]} />
                <View style={[styles.stepItem, step >= 2 && styles.activeStep]} />
            </View>

            <View style={styles.form}>
                {step === 1 ? renderStep1() : renderStep2()}

                <View style={styles.spacer} />

                {step === 1 ? (
                    <AuthButton
                        title="Devam Et"
                        onPress={handleNext}
                    />
                ) : (
                    <AuthButton
                        title="Kayıt Ol"
                        onPress={() => handleRegister(formData)}
                        loading={loading}
                    />
                )}
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        lineHeight: 24,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 32,
        gap: 8,
    },
    stepItem: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
    },
    activeStep: {
        backgroundColor: '#F43F5E',
    },
    form: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    flex1: {
        flex: 1,
    },
    spacer: {
        height: 24,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 25,
    },
    footerText: {
        fontSize: 15,
        color: '#64748B',
    },
    linkText: {
        fontSize: 15,
        color: '#F43F5E',
        fontWeight: '700',
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 6,
        marginTop: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    dateText: { fontSize: 15, color: '#1E293B' },
    datePlaceholder: { fontSize: 15, color: '#CBD5E1' },
});

export default RegisterScreen;