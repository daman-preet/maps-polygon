import { useState } from 'react';
import { useDeviceOrientationChange } from 'react-native-orientation-locker';

type OrientationType = 'PORTRAIT' | 'LANDSCAPE';

const useOrientation = () => {
  const [orientation, setOrientation] = useState<OrientationType>('PORTRAIT');

  useDeviceOrientationChange((o) => {
    let currentOrientation = 'PORTRAIT' as OrientationType;
    if (['LANDSCAPE-LEFT', 'LANDSCAPE-RIGHT'].includes(o)) {
      currentOrientation = 'LANDSCAPE';
    }
    setOrientation(currentOrientation);
  });

  return orientation;
};

export default useOrientation;
