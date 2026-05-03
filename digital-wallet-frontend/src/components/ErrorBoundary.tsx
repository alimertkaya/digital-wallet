import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, errorMessage: '' };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleRetry = () => {
        this.setState({ hasError: false, errorMessage: '' });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <View style={styles.container}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#F43F5E" />
                    <Text style={styles.title}>Bir şeyler ters gitti</Text>
                    <Text style={styles.message}>{this.state.errorMessage}</Text>
                    <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                        <Text style={styles.buttonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#F8FAFC' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 16, marginBottom: 8 },
    message: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
    button: { backgroundColor: '#F43F5E', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default ErrorBoundary;
