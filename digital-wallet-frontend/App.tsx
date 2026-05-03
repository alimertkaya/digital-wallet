import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ErrorBoundary from './src/components/ErrorBoundary';
import { ToastProvider } from './src/context/ToastContext';
import OfflineBanner from './src/components/OfflineBanner';

import LoginScreen from './src/screens/auth/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import WalletScreen from "./src/screens/WalletScreen";
import TransactionScreen from "./src/screens/TransactionScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TransferScreen from "./src/screens/TransferScreen";
import TransferSuccessScreen from "./src/screens/TransferSuccessScreen";
import DepositScreen from './src/screens/DepositScreen';
import WithdrawScreen from "./src/screens/WithdrawScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import ExchangeScreen from "./src/screens/ExchangeScreen";
import NotificationScreen from "./src/screens/NotificationScreen";

import { RootStackParamList, MainTabParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBarButton = ({ children, onPress }: { children: React.ReactNode; onPress?: (e: any) => void }) => (
  <TouchableOpacity style={{
      top: -15, 
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#F43F5E',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      }}
      onPress={onPress}
    >
    <View 
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 7,  
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // title gizle
        tabBarShowLabel: false, // yazilari gizle, only icon
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? 85 : 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons  
              name="home-variant-outline"
              size={26}
              color={focused ? '#0F172A' : '#9CA3AF'}
            />
          ),
        }}
      />

      <Tab.Screen 
        name="WalletTab" 
        component={WalletScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="wallet-outline"
              size={26}
              color={focused ? '#0F172A' : '#9CA3AF'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TransferTab"
        component={TransferScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={30}
              color="#FFF"
            />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
          // tabBarStyle: { display: 'none' }
      }}
      />

      <Tab.Screen 
        name="AnalyticsTab" 
        component={AnalyticsScreen} 
        options={{
          tabBarLabel: 'Analiz',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-pie"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              color={focused ? '#0F172A' : '#9CA3AF'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
    <ToastProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

          <Stack.Screen 
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }} // Login de ust baslik olmasin
          />

          <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={MainTabs}
            options={{ headerShown: false }} 
          />

          <Stack.Screen
            name="Transfer"
            component={TransferScreen}
          />

          <Stack.Screen 
            name="TransferSuccess"
            component={TransferSuccessScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
            name="Transactions"
            component={TransactionScreen}
            options={{ title: 'İşlem Geçmişi' }}
          />

          <Stack.Screen
            name="Deposit"
            component={DepositScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Withdraw"
            component={WithdrawScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Exchange"
            component={ExchangeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="Notifications"
            component={NotificationScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    <OfflineBanner />
    </GestureHandlerRootView>
    </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;