import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { changePassword } from '../services/userService';
import { RootStackScreenProps } from '../types/navigation';

const ChangePasswordScreen = ({ navigation }: RootStackScreenProps<'ChangePassword'>) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
            return;
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            Alert.alert("Başarılı", "Şifreniz güncellendi.", [
                { text: "Tamam", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Şifre değiştirilemedi (Eski şifrenizi kontrol edin).";
            Alert.alert("Hata", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Şifre Değiştir</Text>
                <View style={{width: 40}}/>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Eski Şifre</Text>
                <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} placeholder="********" />

                <Text style={styles.label}>Yeni Şifre</Text>
                <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="********" />
            
                <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
                <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" />
            
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Güncelle</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    backButton: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },
    label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
    button: { backgroundColor: '#F43F5E', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ChangePasswordScreen;