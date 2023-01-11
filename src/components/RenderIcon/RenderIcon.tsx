import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {find} from 'lodash';

import {icons} from './icons';

interface RenderIconProps {
  name: string;
  size?: number;
  color?: string;
}

const RenderIcon = ({name, size = 20, color = '#000'}: RenderIconProps) => {
  let icon = find(icons, {name});
  if (!icon) {
    icon = find(icons, {name: 'MdError'});
  }

  return (
    <Svg width={size} height={size} viewBox={icon?.viewBox}>
      <Path fill={color} d={icon?.d} />
    </Svg>
  );
};

export default RenderIcon;
