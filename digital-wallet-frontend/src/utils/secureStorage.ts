// Requires: npm install react-native-keychain && cd ios && pod install
import * as Keychain from 'react-native-keychain';

const SERVICE = 'digital_wallet';

export const saveTokens = async (token: string, refreshToken: string): Promise<void> => {
    await Keychain.setGenericPassword('tokens', JSON.stringify({ token, refreshToken }), { service: SERVICE });
};

export const getToken = async (): Promise<string | null> => {
    const creds = await Keychain.getGenericPassword({ service: SERVICE });
    if (!creds) return null;
    try { return JSON.parse(creds.password).token ?? null; } catch { return null; }
};

export const getRefreshToken = async (): Promise<string | null> => {
    const creds = await Keychain.getGenericPassword({ service: SERVICE });
    if (!creds) return null;
    try { return JSON.parse(creds.password).refreshToken ?? null; } catch { return null; }
};

export const clearTokens = async (): Promise<void> => {
    await Keychain.resetGenericPassword({ service: SERVICE });
};
