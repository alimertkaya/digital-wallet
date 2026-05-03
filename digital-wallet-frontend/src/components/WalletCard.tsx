import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Wallet } from '../types/wallet';
import { formatMoney } from '../utils/formatters';

interface WalletCardProps {
    item: Wallet;
    onPress?: () => void;
    onDelete?: () => void;
}

const DELETE_BUTTON_WIDTH = 85;

const getCurrencyStyle = (code: string) => {
    switch (code) {
        case 'TRY': return { color: '#DC2626', bg: '#FEF2F2', icon: 'currency-try' };
        case 'USD': return { color: '#059669', bg: '#ECFDF5', icon: 'currency-usd' };
        case 'EUR': return { color: '#2563EB', bg: '#EFF6FF', icon: 'currency-eur' };
        case 'GBP': return { color: '#7C3AED', bg: '#F5F3FF', icon: 'currency-gbp' };
        default: return { color: '#475569', bg: '#F1F5F9', icon: 'currency-sign' };
    }
};

const WalletCard = ({ item, onPress, onDelete }: WalletCardProps) => {
    const styleInfo = getCurrencyStyle(item.currencyCode);
    const swipeableRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        swipeableRef.current?.close();
        onDelete?.();
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        _dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [DELETE_BUTTON_WIDTH, 0],
        });

        const scale = progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 0.9, 1],
        });

        return (
            <Animated.View
                style={[
                    styles.deleteContainer,
                    {
                        transform: [{ translateX }, { scale }],
                    },
                ]}
            >
                <RectButton style={styles.deleteButton} onPress={handleDelete}>
                    <View style={styles.deleteContent}>
                        <View style={styles.deleteIconCircle}>
                            <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.deleteText}>Sil</Text>
                    </View>
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={onDelete ? renderRightActions : undefined}
                rightThreshold={40}
                overshootRight={false}
                friction={2}
                containerStyle={styles.swipeableContainer}
            >
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={onPress}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconBox, { backgroundColor: styleInfo.bg }]}>
                                <MaterialCommunityIcons name={styleInfo.icon} size={26} color={styleInfo.color} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.subtitle}>Cüzdan</Text>
                            </View>
                        </View>

                        <View style={styles.cardRight}>
                            <Text style={styles.balance}>{formatMoney(item.balance, item.currencyCode)}</Text>
                            {onDelete && (
                                <View style={styles.swipeHint}>
                                    <MaterialCommunityIcons name="gesture-swipe-left" size={14} color="#CBD5E1" />
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },
    swipeableContainer: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 20,
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        marginLeft: 15,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    balance: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    swipeHint: {
        marginTop: 4,
        opacity: 0.6,
    },
    deleteContainer: {
        width: DELETE_BUTTON_WIDTH,
        marginLeft: -20,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    deleteContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    deleteText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default WalletCard;