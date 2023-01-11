import {Dimensions, PixelRatio} from 'react-native';

export const findPolygonCenter = coordinates => {
  let x = coordinates.map(c => c.latitude);
  let y = coordinates.map(c => c.longitude);

  let minX = Math.min.apply(null, x);
  let maxX = Math.max.apply(null, x);

  let minY = Math.min.apply(null, y);
  let maxY = Math.max.apply(null, y);

  return {
    latitude: (minX + maxX) / 2,
    longitude: (minY + maxY) / 2,
  };
};

export const calculateArea = locations => {
  if (!locations.length) {
    return 0;
  }
  if (locations.length < 3) {
    return 0;
  }
  let radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];

  const latitudeRef = locations[0].latitude;
  const longitudeRef = locations[0].longitude;
  for (let i = 1; i < locations.length; i++) {
    let latitude = locations[i].latitude;
    let longitude = locations[i].longitude;

    listY.push(calculateYSegment(latitudeRef, latitude, circumference));

    listX.push(
      calculateXSegment(longitudeRef, longitude, latitude, circumference),
    );
  }

  // calculate areas for each triangle segment
  for (let i = 1; i < listX.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));
  }
  // sum areas of all triangle segments
  let areasSum = 0;
  listArea.forEach(area => (areasSum = areasSum + area));
  // get absolute value of area, it can't be negative
  let areaCalc = Math.abs(areasSum * 9); // Math.sqrt(areasSum * areasSum);
  return areaCalc;
};

const calculateAreaInSquareMeters = (x1, x2, y1, y2) => {
  return (y1 * x2 - x1 * y2) / 2;
};

const calculateYSegment = (latitudeRef, latitude, circumference) => {
  return ((latitude - latitudeRef) * circumference) / 360.0;
};

const calculateXSegment = (
  longitudeRef,
  longitude,
  latitude,
  circumference,
) => {
  return (
    ((longitude - longitudeRef) *
      circumference *
      Math.cos(latitude * (Math.PI / 180))) /
    360.0
  );
};

export const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const widthConverter = value => {
  const percent = (value / 375) * 100;
  return widthPercentageToDP(percent);
};

export const heightConverter = value => {
  const percent = (value / 836) * 100;
  return heightPercentageToDP(percent);
};
