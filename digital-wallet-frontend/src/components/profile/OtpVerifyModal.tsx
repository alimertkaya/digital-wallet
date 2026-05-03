import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { VerificationType } from '../../types/user';

interface OtpVerifyModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (code: string) => void;
    onResend?: () => void;
    verificationType?: VerificationType;
    isSubmitting?: boolean;
}

const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({
    visible,
    onClose,
    onSubmit,
    onResend,
    verificationType = 'email',
    isSubmitting = false,
}) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Reset code when modal opens
    useEffect(() => {
        if (visible) {
            setCode(['', '', '', '', '', '']);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [visible]);

    const getTitle = () => {
        switch (verificationType) {
            case 'email': return 'E-Posta Doğrulama';
            case 'phone': return 'Telefon Doğrulama';
            default: return 'Doğrulama';
        }
    };

    const getDescription = () => {
        switch (verificationType) {
            case 'email': return 'E-posta adresinize gönderilen 6 haneli kodu giriniz.';
            case 'phone': return 'Telefonunuza gönderilen 6 haneli kodu giriniz.';
            default: return 'Doğrulama kodunuzu giriniz.';
        }
    };

    const handleChange = (text: string, index: number) => {
        // Only allow numbers
        const cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 1) {
            // Handle paste
            const chars = cleaned.slice(0, 6).split('');
            const newCode = [...code];
            chars.forEach((char, i) => {
                if (index + i < 6) {
                    newCode[index + i] = char;
                }
            });
            setCode(newCode);
            const nextIndex = Math.min(index + chars.length, 5);
            inputRefs.current[nextIndex]?.focus();
        } else {
            const newCode = [...code];
            newCode[index] = cleaned;
            setCode(newCode);
            if (cleaned && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 6) {
            onSubmit(fullCode);
        }
    };

    const isComplete = code.every(c => c !== '');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={verificationType === 'email' ? 'email-check-outline' : 'cellphone-check'}
                            size={48}
                            color="#F43F5E"
                        />
                    </View>

                    {/* Title & Description */}
                    <Text style={styles.title}>{getTitle()}</Text>
                    <Text style={styles.description}>{getDescription()}</Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[
                                    styles.otpInput,
                                    digit && styles.otpInputFilled,
                                ]}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!isSubmitting}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Resend */}
                    {onResend && (
                        <TouchableOpacity onPress={onResend} style={styles.resendButton}>
                            <MaterialCommunityIcons name="refresh" size={16} color="#64748B" />
                            <Text style={styles.resendText}>Kodu Tekrar Gönder</Text>
                        </TouchableOpacity>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!isComplete || isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!isComplete || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />
                                <Text style={styles.submitButtonText}>Doğrula</Text>
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
        alignItems: 'center',
    },
    header: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF1F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    otpInputFilled: {
        borderColor: '#F43F5E',
        backgroundColor: '#FFF1F2',
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 6,
    },
    resendText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F43F5E',
        borderRadius: 16,
        paddingVertical: 16,
        width: '100%',
        marginTop: 16,
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

export default OtpVerifyModal;