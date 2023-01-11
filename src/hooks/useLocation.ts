import { useEffect, useState, useCallback } from 'react';
import Geolocation from 'react-native-geolocation-service';

import { useAppPermissionsContext } from './useAppPermissions';
import useError from './useError';
import { LATITUDE_DELTA, LONGITUDE_DELTA } from '../utils/constants';

const useLocation = () => {
  const { handleError } = useError();
  const { permissions, requestLocationPermission } = useAppPermissionsContext();

  const initialLocation = {
    latitude: 30.54508071,
    longitude: -97.8246823,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  const getLocationPermission = useCallback(() => {
    if (!permissions.location) {
      requestLocationPermission();
    }
  }, [permissions, requestLocationPermission]);

  const getCurrentPosition = useCallback(
    (cb = () => {}) => {
      if (permissions.location) {
        Geolocation.getCurrentPosition(
          (Position) => {
            const region = {
              latitude: Position.coords.latitude,
              longitude: Position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };
            setCurrentLocation(region);
            cb(region);
          },
          (error) => {
            handleError(error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        requestLocationPermission();
      }
    },
    [permissions, requestLocationPermission, handleError],
  );

  // useEffect(() => {
  //   getCurrentPosition();
  // }, [getCurrentPosition]);

  return { currentLocation, getCurrentPosition, getLocationPermission };
};

export default useLocation;
