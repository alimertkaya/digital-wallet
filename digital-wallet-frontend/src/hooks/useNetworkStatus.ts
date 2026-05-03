// Requires: npm install @react-native-community/netinfo && cd ios && pod install
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsConnected(state.isConnected ?? true);
        });

        NetInfo.fetch().then((state: NetInfoState) => {
            setIsConnected(state.isConnected ?? true);
        });

        return unsubscribe;
    }, []);

    return { isConnected };
};
