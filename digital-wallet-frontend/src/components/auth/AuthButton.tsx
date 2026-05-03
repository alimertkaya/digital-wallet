import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'text';
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

const AuthButton: React.FC<AuthButtonProps> = ({
    title,
    onPress,
    loading = false,
    variant = 'primary',
    disabled = false,
    style
}) => {

    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'text':
                return styles.textButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryText;
            case 'text':
                return styles.textButtonText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.baseButton,
                getButtonStyle(),
                (disabled || loading) && styles.disabledButton,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#FFF' : '#F43F5E'} />
            ) : (
                <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: '#F43F5E',
        shadowColor: '#F43F5E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryText: {
        color: '#FFF',
    },
    secondaryButton: {
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    secondaryText: {
        color: '#64748B',
    },
    textButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
    },
    textButtonText: {
        color: '#F43F5E',
    },
    baseText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    }
});

export default AuthButton;
