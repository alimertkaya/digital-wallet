// TODO: react-native-config kurulduktan sonra Config.API_URL kullan
// npm install react-native-config && cd ios && pod install
const DEV_API_URL = 'http://localhost:8080/api/v1';
const PROD_API_URL = 'https://api.example.com/api/v1';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
