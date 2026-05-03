import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

const COLORS: Record<ToastType, { bg: string; icon: string; name: string }> = {
    success: { bg: '#22C55E', icon: '#FFF', name: 'check-circle-outline' },
    error:   { bg: '#EF4444', icon: '#FFF', name: 'alert-circle-outline' },
    warning: { bg: '#F59E0B', icon: '#FFF', name: 'alert-outline' },
    info:    { bg: '#3B82F6', icon: '#FFF', name: 'information-outline' },
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hide = useCallback(() => {
        Animated.parallel([
            Animated.timing(translateY, { toValue: -100, duration: 250, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
    }, [translateY, opacity]);

    const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
        if (hideTimer.current) clearTimeout(hideTimer.current);

        setMessage(msg);
        setType(toastType);

        Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        hideTimer.current = setTimeout(hide, 3000);
    }, [translateY, opacity, hide]);

    const color = COLORS[type];

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Animated.View style={[styles.toast, { backgroundColor: color.bg, transform: [{ translateY }], opacity }]}>
                <MaterialCommunityIcons name={color.name} size={22} color={color.icon} style={styles.icon} />
                <Text style={styles.text} numberOfLines={2}>{message}</Text>
            </Animated.View>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 56,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    icon: { marginRight: 10 },
    text: { flex: 1, color: '#FFF', fontSize: 14, fontWeight: '600', lineHeight: 20 },
});
