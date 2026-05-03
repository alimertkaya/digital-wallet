import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps, StyleProp, ViewStyle, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface AuthInputProps extends TextInputProps {
    label: string;
    icon?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

const AuthInput: React.FC<AuthInputProps> = ({
    label,
    icon,
    error,
    secureTextEntry,
    containerStyle,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const isPassword = secureTextEntry && !isPasswordVisible;

    // Wrapper'a tıklandığında input'u focus et
    const handlePressWrapper = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>

            <Pressable
                onPress={handlePressWrapper}
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputWrapperFocused,
                    !!error && styles.inputWrapperError
                ]}
            >
                {icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={20}
                        color={isFocused ? '#F43F5E' : '#94A3B8'}
                        style={styles.icon}
                    />
                )}

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholderTextColor="#CBD5E1"
                    secureTextEntry={isPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#94A3B8"
                        />
                    </TouchableOpacity>
                )}
            </Pressable>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 0,
        minHeight: 56,
    },
    inputWrapperFocused: {
        borderColor: '#F43F5E',
        backgroundColor: '#FFF',
    },
    inputWrapperError: {
        borderColor: '#EF4444',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2D3748',
        paddingVertical: 15,
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    }
});

export default AuthInput;
