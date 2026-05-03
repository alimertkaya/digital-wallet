import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ActionButtons = () => {
    const navigation = useNavigation<any>();

    const actions = [
        { label: 'Yatır', icon: 'plus', route: 'Deposit' },
        { label: 'Çek', icon: 'arrow-down', route: 'Withdraw' },
        { label: 'Gönder', icon: 'arrow-top-right', route: 'Transfer' },
        { label: 'Çevir', icon: 'swap-horizontal', route: 'Exchange' }, 
    ];

    return (
        <View style={styles.container}>
            {actions.map((action, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => action.route && navigation.navigate(action.route)}
                >
                    <MaterialCommunityIcons name={action.icon} size={24} color="#1E293B" />
                    <Text style={styles.text}>{action.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
    button: { 
        backgroundColor: '#FFF', width: '22%', paddingVertical: 14, borderRadius: 20, 
        alignItems: 'center', justifyContent: 'center', gap: 6,
        borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#64748B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 
    },
    text: { fontWeight: '600', color: '#334155', fontSize: 13 },
});

export default ActionButtons;