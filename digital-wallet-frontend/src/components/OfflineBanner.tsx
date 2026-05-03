import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const OfflineBanner = () => {
    const { isConnected } = useNetworkStatus();

    if (isConnected) return null;

    return (
        <View style={styles.banner}>
            <MaterialCommunityIcons name="wifi-off" size={18} color="#FFF" />
            <Text style={styles.text}>İnternet bağlantısı yok</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E293B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
        zIndex: 9998,
    },
    text: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});

export default OfflineBanner;
