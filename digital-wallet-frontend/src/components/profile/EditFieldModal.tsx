import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditFieldModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
    fieldType: 'email' | 'phone';
    currentValue: string;
    isSubmitting?: boolean;
}

const EditFieldModal: React.FC<EditFieldModalProps> = ({
    visible,
    onClose,
    onSubmit,
    fieldType,
    currentValue,
    isSubmitting = false,
}) => {
    const [value, setValue] = useState(currentValue);
    const [error, setError] = useState('');

    const isEmail = fieldType === 'email';
    const title = isEmail ? 'E-Posta Güncelle' : 'Telefon Güncelle';
    const placeholder = isEmail ? 'yeni@email.com' : '05XX XXX XX XX';
    const icon = isEmail ? 'email-outline' : 'phone-outline';
    const keyboardType = isEmail ? 'email-address' : 'phone-pad';

    /**
     * Validates input based on field type.
     */
    const validate = (): boolean => {
        if (!value.trim()) {
            setError('Bu alan boş bırakılamaz.');
            return false;
        }
        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError('Geçerli bir e-posta adresi giriniz.');
                return false;
            }
        } else {
            const phoneRegex = /^[0-9]{10,11}$/;
            const cleanedPhone = value.replace(/\s/g, '');
            if (!phoneRegex.test(cleanedPhone)) {
                setError('Geçerli bir telefon numarası giriniz.');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(value.trim());
        }
    };

    const handleClose = () => {
        setValue(currentValue);
        setError('');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <MaterialCommunityIcons name={icon} size={22} color="#64748B" />
                        </View>
                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={(text) => {
                                setValue(text);
                                setError('');
                            }}
                            placeholder={placeholder}
                            placeholderTextColor="#94A3B8"
                            keyboardType={keyboardType as any}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isSubmitting}
                        />
                    </View>

                    {/* Error */}
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="information-outline" size={18} color="#64748B" />
                        <Text style={styles.infoText}>
                            {isEmail
                                ? 'Yeni e-posta adresinize doğrulama kodu gönderilecektir.'
                                : 'Yeni telefon numaranıza SMS ile doğrulama kodu gönderilecektir.'
                            }
                        </Text>
                    </View>

                    {/* Submit Button */}
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
        marginTop: 8,
        marginLeft: 4,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
    },
    infoText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
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

export default EditFieldModal;
