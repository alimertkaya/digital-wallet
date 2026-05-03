import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Transfer: undefined;
    TransferSuccess: { amount: string; recipient: string; symbol: string };
    Transactions: { walletId: number; currencyCode: string };
    Deposit: undefined;
    Withdraw: undefined;
    ChangePassword: undefined;
    Exchange: undefined;
    Notifications: undefined;
};

export type MainTabParamList = {
    HomeTab: undefined;
    WalletTab: undefined;
    TransferTab: undefined;
    AnalyticsTab: undefined;
    ProfileTab: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    BottomTabScreenProps<MainTabParamList, T>;
