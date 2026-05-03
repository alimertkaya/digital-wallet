import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    icon: string;
    title: string;
    onPress: () => void;
    color?: string;
}

const ProfileActionButton = ({ icon, title, onPress, color = "#1E293B" }: Props) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={icon} size={24} color={color} style={{ marginRight: 15 }} />
            <Text style={[styles.actionText, { color }]}>{title}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    actionText: { fontSize: 16, fontWeight: '500' },
});

export default ProfileActionButton;