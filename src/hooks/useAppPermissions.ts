import { useState, useMemo, useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import {
  PERMISSIONS,
  check,
  checkMultiple,
  request,
  requestMultiple,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import constate from 'constate';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { SIRI, ...PERMISSIONS_IOS } = PERMISSIONS.IOS; // remove siri (certificate required)

const useAppPermissions = () => {
  const [permissions, setPermissions] = useState({
    location: true,
    camera: true,
    writeToStorage: true,
    readFromStorage: true,
  });

  const PLATFORM_PERMISSIONS = useMemo(() => {
    if (Platform.OS === 'ios') {
      return {
        locationPermission: PERMISSIONS_IOS.LOCATION_ALWAYS,
        cameraPermission: PERMISSIONS_IOS.CAMERA,
        writePermission: PERMISSIONS_IOS.MEDIA_LIBRARY,
        readPermission: PERMISSIONS_IOS.PHOTO_LIBRARY,
      };
    }
    return {
      locationPermission: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      cameraPermission: PERMISSIONS.ANDROID.CAMERA,
      writePermission: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      readPermission: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    };
  }, []);

  const checkLocationPermission = useCallback(async () => {
    try {
      const result = await check(PLATFORM_PERMISSIONS?.locationPermission);
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        location: result === RESULTS.GRANTED,
      }));
    } catch (err) {
      console.log('error in check for location permission', err);
    }
  }, [PLATFORM_PERMISSIONS]);

  const requestLocationPermission = useCallback(
    async (cb = () => {}) => {
      try {
        const result = await request(PLATFORM_PERMISSIONS?.locationPermission);
        console.log('>>>> results', result);
        setPermissions((prevPermissions) => ({
          ...prevPermissions,
          location: result === RESULTS.GRANTED,
        }));
        cb();
      } catch (err) {
        console.log('error in request for location permission', err);
      }
    },
    [PLATFORM_PERMISSIONS],
  );

  const checkCameraPermission = useCallback(async () => {
    try {
      const results = await checkMultiple([
        PLATFORM_PERMISSIONS?.cameraPermission,
        PLATFORM_PERMISSIONS?.writePermission,
        PLATFORM_PERMISSIONS?.readPermission,
      ]);
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        camera:
          results[PLATFORM_PERMISSIONS.cameraPermission] === RESULTS.GRANTED,
        writeToStorage:
          results[PLATFORM_PERMISSIONS.writePermission] === RESULTS.GRANTED,
        readFromStorage:
          results[PLATFORM_PERMISSIONS.readPermission] === RESULTS.GRANTED,
      }));
    } catch (err) {
      console.log('error in check for camera permission', err);
    }
  }, [PLATFORM_PERMISSIONS]);

  const requestCameraPermission = useCallback(
    async (cb = () => {}) => {
      try {
        const results = await requestMultiple([
          PLATFORM_PERMISSIONS?.cameraPermission,
          PLATFORM_PERMISSIONS?.writePermission,
          PLATFORM_PERMISSIONS?.readPermission,
        ]);
        setPermissions((prevPermissions) => ({
          ...prevPermissions,
          camera:
            results[PLATFORM_PERMISSIONS.cameraPermission] === RESULTS.GRANTED,
          writeToStorage:
            results[PLATFORM_PERMISSIONS.writePermission] === RESULTS.GRANTED,
          readFromStorage:
            results[PLATFORM_PERMISSIONS.readPermission] === RESULTS.GRANTED,
        }));
        cb();
      } catch (err) {
        console.log('error in request for camera permission', err);
      }
    },
    [PLATFORM_PERMISSIONS],
  );

  const openDeviceSetting = () => {
    openSettings().catch(() => {
      Alert.alert(
        'Cannot open settings. Please manually go to setting to enable the permission for RoofLink.',
      );
    });
  };

  useEffect(() => {
    checkLocationPermission();
    checkCameraPermission();
  }, [checkLocationPermission, checkCameraPermission]);

  return {
    permissions,
    checkLocationPermission,
    requestLocationPermission,
    checkCameraPermission,
    requestCameraPermission,
    openDeviceSetting,
  };
};

export const [AppPermissionsProvider, useAppPermissionsContext] =
  constate(useAppPermissions);
