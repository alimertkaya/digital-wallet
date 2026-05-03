import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Dimensions } from 'react-native';

interface AuthLayoutProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const { width } = Dimensions.get('window');

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, footer }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* Background circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {children}
                </View>
            </ScrollView>

            {footer && (
                <View style={styles.footer}>
                    {footer}
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        backgroundColor: '#FFF',
    },
    circle1: {
        position: 'absolute',
        top: -width * 0.2,
        right: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: '#FFF1F2',
        opacity: 0.6,
        zIndex: -1,
    },
    circle2: {
        position: 'absolute',
        top: width * 0.1,
        left: -width * 0.3,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: '#F0F9FF',
        opacity: 0.6,
        zIndex: -1,
    }
});

export default AuthLayout;
