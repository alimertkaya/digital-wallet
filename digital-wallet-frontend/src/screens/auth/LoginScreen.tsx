import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLogin } from '../../hooks/useLogin';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { RootStackScreenProps } from '../../types/navigation';

const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
    const {
        username, setUsername,
        password, setPassword,
        loading, handleLogin
    } = useLogin(navigation);

    return (
        <AuthLayout
            footer={
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Hesabın yok mu? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Tekrar Hoş Geldiniz 👋</Text>
                <Text style={styles.subtitle}>Finansal özgürlüğüne kaldığın yerden devam et.</Text>
            </View>

            <View style={styles.form}>
                <AuthInput
                    label="Kullanıcı Adı"
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    icon="account-outline"
                />

                <AuthInput
                    label="Şifre"
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    icon="lock-outline"
                />

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Şifreni mi unuttun?</Text>
                </TouchableOpacity>

                <View style={styles.spacer} />

                <AuthButton
                    title="Giriş Yap"
                    onPress={handleLogin}
                    loading={loading}
                />
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 15,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        lineHeight: 24,
    },
    form: {
        flex: 1,
    },
    spacer: {
        height: 24,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#F43F5E',
        fontWeight: '600',
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
    }
});

export default LoginScreen;
