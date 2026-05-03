import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
    activeTab: 'analysis' | 'expenses';
    onTabChange: (tab: 'analysis' | 'expenses') => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'analysis' && styles.tabActive]}
                onPress={() => onTabChange('analysis')}
                activeOpacity={0.7}
            >
                <Text style={[styles.tabText, activeTab === 'analysis' && styles.tabTextActive]}>
                    Durumum
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'expenses' && styles.tabActive]}
                onPress={() => onTabChange('expenses')}
                activeOpacity={0.7}
            >
                <Text style={[styles.tabText, activeTab === 'expenses' && styles.tabTextActive]}>
                    Harcamalar
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 4, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    tabText: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
    tabTextActive: { color: '#0F172A' },
});