import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditNameModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (firstName: string, lastName: string) => void;
    currentFirstName: string;
    currentLastName: string;
    isSubmitting?: boolean;
}

const EditNameModal: React.FC<EditNameModalProps> = ({
    visible,
    onClose,
    onSubmit,
    currentFirstName,
    currentLastName,
    isSubmitting = false,
}) => {
    const [firstName, setFirstName] = useState(currentFirstName);
    const [lastName, setLastName] = useState(currentLastName);
    const [errors, setErrors] = useState({ firstName: '', lastName: '' });

    useEffect(() => {
        if (visible) {
            setFirstName(currentFirstName);
            setLastName(currentLastName);
            setErrors({ firstName: '', lastName: '' });
        }
    }, [visible, currentFirstName, currentLastName]);

    const validate = (): boolean => {
        const newErrors = { firstName: '', lastName: '' };
        if (!firstName.trim()) newErrors.firstName = 'Ad boş bırakılamaz.';
        if (!lastName.trim()) newErrors.lastName = 'Soyad boş bırakılamaz.';
        setErrors(newErrors);
        return !newErrors.firstName && !newErrors.lastName;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(firstName.trim(), lastName.trim());
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Ad Soyad Güncelle</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialCommunityIcons name="account-outline" size={22} color="#64748B" />
                        </View>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={(text) => { setFirstName(text); setErrors(e => ({ ...e, firstName: '' })); }}
                            placeholder="Ad"
                            placeholderTextColor="#94A3B8"
                            autoCorrect={false}
                            editable={!isSubmitting}
                        />
                    </View>
                    {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

                    <View style={[styles.inputContainer, { marginTop: 12 }]}>
                        <View style={styles.inputIconContainer}>
                            <MaterialCommunityIcons name="account-outline" size={22} color="#64748B" />
                        </View>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={(text) => { setLastName(text); setErrors(e => ({ ...e, lastName: '' })); }}
                            placeholder="Soyad"
                            placeholderTextColor="#94A3B8"
                            autoCorrect={false}
                            editable={!isSubmitting}
                        />
                    </View>
                    {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                                <Text style={styles.submitButtonText}>Güncelle</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
    },
    inputIconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1E293B',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        marginTop: 6,
        marginLeft: 4,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F43F5E',
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: 24,
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#FDA4AF',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditNameModal;
