import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    icon: string;
    label: string;
    value: string;
    isVerified?: boolean;
    isEditable?: boolean;
    onEdit?: () => void;
    onVerify?: () => void;
}

const InfoRow = ({ icon, label, value, isVerified, isEditable, onEdit, onVerify }: Props) => (
    <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={22} color="#64748B" />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>

        {/* Verification Status Badge */}
        {isVerified !== undefined && (
            <TouchableOpacity
                style={[
                    styles.verifyBadge,
                    { backgroundColor: isVerified ? '#D1FAE5' : '#FEF3C7' }
                ]}
                onPress={!isVerified && onVerify ? onVerify : undefined}
                disabled={isVerified || !onVerify}
            >
                <MaterialCommunityIcons
                    name={isVerified ? "check-circle" : "alert-circle"}
                    size={14}
                    color={isVerified ? "#10B981" : "#F59E0B"}
                />
                <Text style={[
                    styles.verifyBadgeText,
                    { color: isVerified ? "#059669" : "#D97706" }
                ]}>
                    {isVerified ? 'Doğrulandı' : 'Doğrula'}
                </Text>
            </TouchableOpacity>
        )}

        {/* Edit Button */}
        {isEditable && onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#64748B" />
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '600',
    },
    verifyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginRight: 8,
        gap: 4,
    },
    verifyBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default InfoRow;