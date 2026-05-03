import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useProfile } from '../hooks/useProfile';
import { formatDate, maskTCKN } from '../utils/formatters';
import InfoRow from '../components/profile/InfoRow';
import ProfileActionButton from '../components/profile/ProfileActionButton';
import OtpVerifyModal from '../components/profile/OtpVerifyModal';
import EditFieldModal from '../components/profile/EditFieldModal';
import EditNameModal from '../components/profile/EditNameModal';

const ProfileScreen = () => {
    const {
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
        navigation
    } = useProfile();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F43F5E" />
                <Text style={styles.loadingText}>Profil yükleniyor...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Premium Header */}
                <View style={styles.header}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </Text>
                        </View>
                    </View>

                    {/* Name & Username */}
                    <View style={styles.nameRow}>
                        <Text style={styles.fullName}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <TouchableOpacity
                            style={styles.editNameButton}
                            onPress={() => setEditNameModalVisible(true)}
                        >
                            <MaterialCommunityIcons name="pencil-outline" size={16} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.username}>@{user?.username}</Text>
                </View>

                {/* Personal Information Card */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                    <View style={styles.card}>
                        <InfoRow
                            icon="email-outline"
                            label="E-Posta"
                            value={user?.email || '-'}
                            isVerified={user?.isEmailVerified}
                            isEditable={true}
                            onEdit={() => handleEditOpen('email')}
                            onVerify={() => handleVerifyOpen('email')}
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="phone-outline"
                            label="Telefon"
                            value={user?.phoneNumber || '-'}
                            isVerified={user?.isPhoneVerified}
                            isEditable={true}
                            onEdit={() => handleEditOpen('phone')}
                            onVerify={() => handleVerifyOpen('phone')}
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="card-account-details-outline"
                            label="TC Kimlik No"
                            value={maskTCKN(user?.tckn || '')}
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="cake-variant-outline"
                            label="Doğum Tarihi"
                            value={formatDate(user?.birthDate)}
                        />
                    </View>
                </View>

                {/* Account Settings Card */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
                    <View style={styles.card}>
                        <ProfileActionButton
                            icon="lock-reset"
                            title="Şifre Değiştir"
                            onPress={() => navigation.navigate('ChangePassword')}
                        />
                        <View style={styles.divider} />
                        <ProfileActionButton
                            icon="shield-check-outline"
                            title="Gizlilik & Güvenlik"
                            onPress={() => { }}
                        />
                        <View style={styles.divider} />
                        <ProfileActionButton
                            icon="help-circle-outline"
                            title="Yardım & Destek"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Logout Section */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" size={20} color="#F43F5E" />
                        <Text style={styles.logoutText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>v1.0.0 (Build 2025)</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Edit Name Modal */}
            <EditNameModal
                visible={editNameModalVisible}
                onClose={() => setEditNameModalVisible(false)}
                onSubmit={handleEditNameSubmit}
                currentFirstName={user?.firstName || ''}
                currentLastName={user?.lastName || ''}
                isSubmitting={isSubmitting}
            />

            {/* Edit Field Modal */}
            <EditFieldModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleEditSubmit}
                fieldType={editingField}
                currentValue={editingField === 'email' ? (user?.email || '') : (user?.phoneNumber || '')}
                isSubmitting={isSubmitting}
            />

            {/* OTP Verification Modal */}
            <OtpVerifyModal
                visible={otpModalVisible}
                onClose={handleVerifyClose}
                onSubmit={handleVerifySubmit}
                onResend={handleResendCode}
                verificationType={verificationType}
                isSubmitting={isSubmitting}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // Header - Clean Light Design
    header: {
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 35,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    fullName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
    },
    editNameButton: {
        padding: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    username: {
        fontSize: 15,
        color: '#64748B',
    },

    // Sections
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 70,
    },

    // Logout
    logoutSection: {
        alignItems: 'center',
        marginTop: 32,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        gap: 10,
    },
    logoutText: {
        color: '#F43F5E',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        marginTop: 20,
        color: '#CBD5E1',
        fontSize: 12,
    },
});

export default ProfileScreen;