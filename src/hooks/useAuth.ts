import { useState, useEffect, useCallback } from 'react';
import constate from 'constate';

import { useOnlineManagerContext } from './useOnlineManager';
import { fetchCurrentUser } from '../queries/user';
import {
  storeData,
  getData,
  removeData,
  // clearAll,
} from '../utils/localStorage';
import { USER_INFO_KEY, SESSION_KEY } from '../utils/constants';

const useAuth = () => {
  const { isOnline } = useOnlineManagerContext();

  const [authVerified, setAuthVerified] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchMe = useCallback(async () => {
    console.log('>>> is user online', isOnline);
    const sid = await getData(SESSION_KEY);
    console.log('>>> jwt token', sid);
    if (sid) {
      if (isOnline) {
        try {
          const user = await fetchCurrentUser();
          storeData(USER_INFO_KEY, user);
          setUserInfo(user);
          setAuthVerified(true);
        } catch (err) {
          console.log('error in useAuth > fetch user', err);
          const userData = await getData(USER_INFO_KEY);
          if (userData) {
            setUserInfo(userData);
            setAuthVerified(true);
          } else {
            // clearAll();
            setUserInfo(null);
            setAuthVerified(true);
          }
        }
      } else {
        const userData = await getData(USER_INFO_KEY);
        setUserInfo(userData);
        setAuthVerified(true);
      }
    } else {
      setUserInfo(null);
      setAuthVerified(true);
    }
  }, [isOnline]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return {
    authVerified,
    user: userInfo,
    setUser: (user: User | null, token?: string) => {
      if (!user) {
        removeData(SESSION_KEY);
        removeData(USER_INFO_KEY);
        setUserInfo(null);
      } else {
        if (token) {
          storeData(SESSION_KEY, token);
        }
        storeData(USER_INFO_KEY, user);
        setUserInfo(user);
      }
    },
  };
};

export const [AuthProvider, useAuthContext] = constate(useAuth);
