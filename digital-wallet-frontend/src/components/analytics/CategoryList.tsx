import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategorySpend } from '../../types/analytics';
import { getCategoryUI } from '../../utils/categoryMapper';

const CategoryList = ({ categories }: { categories: CategorySpend[] }) => {

    const sortedCategories = [...categories].sort((a, b) => b.percentage - a.percentage);

    return (
        <View>
            {sortedCategories.map((item, index) => {
                const ui = getCategoryUI(item.category);
                return (
                    <View key={index} style={styles.itemContainer}>
                        <View style={[styles.iconBox, { backgroundColor: ui.color + '20' }]}>
                            <MaterialCommunityIcons name={ui.icon} size={24} color={ui.color}/>
                        </View>
                        <View style={styles.textContainer}>
                        <Text style={styles.categoryName}>{ui.label}</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${item.percentage}%`, backgroundColor: ui.color }]} />
                            </View>
                        </View>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amount}>-{item.amount.toFixed(2)} ₺</Text>
                            <Text style={styles.percentage}>%{item.percentage.toFixed(1)}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1, marginRight: 10 },
    categoryName: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
    progressBarBg: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, width: '100%' },
    progressBarFill: { height: '100%', borderRadius: 2 },
    amountContainer: { alignItems: 'flex-end' },
    amount: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
    percentage: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
});

export default CategoryList;