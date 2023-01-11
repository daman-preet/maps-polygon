import AsyncStorage from './AsyncStore';

// get and set aws Tokens
const TokenBridge = {
  getTokens: async () => AsyncStorage.getItem('tokens', ''),
  setTokens: async (tokens: {
    id_token: string;
    access_token: string;
    refresh_token: string;
  }) => AsyncStorage.setItem('tokens', tokens),
  removeTokens: async () => AsyncStorage.removeItem('tokens'),
};

export default TokenBridge;
