import { useCallback } from 'react';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';

const useError = () => {
  const isUnAuthorized = useCallback((error: any) => {
    let isUserUnAuthorized = false;

    if (error?.isAxiosError) {
      const axiosError = error as AxiosError;

      if (+axiosError.response?.data?.statusCode === 401) {
        isUserUnAuthorized = true;
      } else if (+axiosError.request?.statusCode === 401) {
        isUserUnAuthorized = true;
      }
    } else if (error && error.code && +error.code === 401) {
      isUserUnAuthorized = true;
    }
    return isUserUnAuthorized;
  }, []);

  const getErrorMessage = useCallback((error: any) => {
    if (error?.isAxiosError) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        let errMsg = 'Something went wrong';
        const errData = axiosError.response?.data || {};
        let strErrors = '';
        Object.keys(errData).forEach((val) => {
          strErrors += val + ': ' + errData[val] + '\n';
        });
        if (strErrors) {
          errMsg = strErrors;
        } else if (errData.detail || errData.message) {
          errMsg = JSON.stringify(errData.detail || errData.message);
        }
        return errMsg;
      }
      if (axiosError.request || axiosError.message) {
        return axiosError.message ?? 'Something went wrong';
      }
    }

    if (error?.message) {
      return error.message;
    }

    return error
      ? JSON.stringify(error)
      : 'Something went wrong. Please try again';
  }, []);

  const handleError = useCallback(
    (error: any) => {
      const errorMessage = getErrorMessage(error);
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        {
          cancelable: true,
        },
      );

      // if (isUnAuthorized(error)) signOut()
    },
    [getErrorMessage],
  );

  return { isUnAuthorized, getErrorMessage, handleError };
};

export default useError;
