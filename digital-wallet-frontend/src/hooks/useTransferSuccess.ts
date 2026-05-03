import { useEffect, useRef } from 'react';
import { Animated, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type TransferSuccessRouteProp = RouteProp<RootStackParamList, 'TransferSuccess'>;

export const useTransferSuccess = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<TransferSuccessRouteProp>();

    // Parametreleri güvenli şekilde al
    const { amount, recipient, symbol } = route.params || { amount: '0', recipient: 'Bilinmiyor', symbol: '' };

    // Animasyon Değerleri
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay: 300,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, scaleAnim]);

    const handleShareReceipt = async () => {
        try {
            await Share.share({
                message: `Transfer Dekontu: ${recipient} hesabına ${amount} ${symbol} gönderildi.`,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return {
        amount,
        recipient,
        symbol,
        scaleAnim,
        fadeAnim,
        handleShareReceipt,
        handleGoHome
    };
};