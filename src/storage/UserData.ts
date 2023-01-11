import AsyncStore from './AsyncStore';

/**
 * Store User information after login
 * @param loginDetail : Object of login information
 */
export const fillLoginData = async (loginDetail: any) => {
  const jsonString = JSON.stringify(loginDetail);
  const loginData = JSON.parse(jsonString);
  await AsyncStore.setItem('loginData', loginData);
};

export const storeSavedAreas = async (key: any, savedAreas: any) => {
  const jsonString = JSON.stringify(savedAreas);
  const savedAreaData = JSON.parse(jsonString);
  await AsyncStore.setItem(key, savedAreaData);
};
