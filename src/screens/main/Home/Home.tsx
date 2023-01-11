import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';
import {
  MainView,
  ItemView,
  ListView,
  DetailsView,
  ModalView,
} from './Home.styled';
import theme from './../../../theme';
import MapView, {Polygon, Polyline, Marker, LatLng} from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from './../../../components';
import {ContainedButton, OutlineButton} from './../../../components/Button';
import useYupValidationResolver from './../../../validation/resolver';
import {saveAreaSchema} from './../../../validation/authValidation';
import {Controller, useForm} from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {findPolygonCenter, calculateArea} from './../../../Helpers/Methods';
import {
  Text1,
  Heading,
  FontWeights,
  Text2,
} from './../../../components/Typography';
import get from 'lodash/get';
import {fillLoginData, storeSavedAreas} from '../../../storage/UserData';
import {setLoginResponse} from './../../../state/auth/authActions';
import {connect} from 'react-redux';
import AsyncStore from '../../../storage/AsyncStore';
import {isEmpty} from 'lodash';
import {rgba} from 'polished';

interface IProps {
  navigation?: any;
  setLoginResponse?: any;
}

Ionicons.loadFont().then();
MaterialIcons.loadFont().then();

const Home = ({navigation, setLoginResponse}: IProps) => {
  const mapRef = useRef() as React.MutableRefObject<MapView>;
  const [isActiveDraw, setIsActiveDraw] = useState(false);
  const [lat, setLat] = useState(30.723611832611496);
  const [long, setLong] = useState(76.75313566963952);
  const [editing, setEditing] = useState(Array<LatLng>);
  const [selectedArea, setSelectedArea] = useState(Array<LatLng>);
  const [isModalVisible, setModalVisible] = useState(false);
  const refRBSheet2 = useRef();
  const [savedArea, setSavedArea] = useState(Array<any>);
  const [selectedAreaName, setSelectedAreaName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  type FormData = {
    name: string;
  };

  const resolver = useYupValidationResolver(saveAreaSchema);

  const {
    handleSubmit,
    control,
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: {errors},
  } = useForm<FormData>({
    resolver,
    defaultValues: {
      name: '',
    },
  });

  const handleSave = (data: FormData) => {
    Keyboard.dismiss();
    setIsActiveDraw(false);
    setSavedArea([
      ...savedArea,
      {
        area: data.name,
        area_coordinates: editing,
        area_sf: calculateArea(editing),
        id: savedArea.length + 1,
      },
    ]);
    storeSavedAreas(userEmail, {
      areas: [
        ...savedArea,
        {
          area: data.name,
          area_coordinates: editing,
          area_sf: calculateArea(editing),
          id: savedArea.length + 1,
        },
      ],
    });
    toggleModal();
    setEditing([]);
    setValue('name', '');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => refRBSheet2.current.open()}>
          <Ionicons
            name="list"
            color={theme.colors.primary}
            size={30}
            style={{marginRight: 20}}
          />
        </TouchableWithoutFeedback>
      ),
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            fillLoginData({});
            setLoginResponse({});
          }}>
          <Ionicons
            name="log-out-outline"
            color={theme.colors.primary}
            size={30}
            style={{marginLeft: 20}}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  const handleClear = useCallback(() => {
    {
      setEditing([]);
    }
  }, []);

  const toggleModal = () => {
    setValue('name', '');
    setModalVisible(!isModalVisible);
  };

  const renderItem = ({item}) => (
    <Item
      id={item.id}
      title={item.area}
      area_sf={item.area_sf}
      area={item.area_coordinates}
    />
  );

  const Item = ({id, title, area_sf, area}) => (
    <TouchableOpacity
      onPress={async () => {
        setSelectedAreaName(title);
        setSelectedArea(area);
        if (mapRef != null) {
          refRBSheet2.current.close();
          mapRef.current.animateToRegion(
            {
              latitude: area[0].latitude,
              longitude: area[0].longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            },
            2000,
          );
        }
      }}>
      <ItemView>
        <View>
          <DetailsView>
            <Text2>{'Name: '}</Text2>
            <Text1 fontWeight={FontWeights.regular}>{title}</Text1>
          </DetailsView>
          <DetailsView>
            <Text2>{'Area: '} </Text2>
            <Text1 fontWeight={FontWeights.regular}>
              {+area_sf + ' sq ft'}
            </Text1>
          </DetailsView>
        </View>
        <MaterialIcons
          name="delete"
          color={theme.colors.gray50}
          size={20}
          style={{marginLeft: 'auto', right: 10}}
          onPress={() => {
            refRBSheet2.current.close();
            if (selectedAreaName === title) {
              setSelectedArea([]);
              setSelectedAreaName('');
            }
            const areas = savedArea.filter(item => {
              const areaId = get(item, 'id');
              if (id != areaId) {
                return item;
              } else {
                return null;
              }
            });
            setSavedArea(areas);
            storeSavedAreas(userEmail, {areas: areas});
          }}
        />
      </ItemView>
    </TouchableOpacity>
  );

  function onMapTap(e: any) {
    if (!isActiveDraw) {
      return;
    }
    setEditing([...editing, e.nativeEvent.coordinate]);
  }

  const getLoginInfoFromStorage = async () => {
    try {
      await AsyncStore.getItem('loginData', {}).then(data => {
        setUserEmail(get(data, 'email', ''));
      });
    } catch (error) {
      console.log('error fetching login data', error);
    }
  };

  useEffect(() => {
    getLoginInfoFromStorage();
  }, []);

  useEffect(() => {
    if (!isEmpty(userEmail)) {
      getSavedAreasInfoFromStorage();
    }
  }, [userEmail]);

  const getSavedAreasInfoFromStorage = async () => {
    try {
      await AsyncStore.getItem(userEmail, {}).then(data => {
        setSavedArea(get(data, 'areas', []));
      });
    } catch (error) {
      console.log('error fetching area data', error);
    }
  };

  useEffect(() => {
    if (!isEmpty(userEmail)) {
      storeSavedAreas(userEmail, savedArea);
    }
  }, [savedArea]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      <MainView>
        <MapView
          style={{left: 0, right: 0, top: 0, bottom: 0, position: 'absolute'}}
          minZoomLevel={15}
          ref={mapRef}
          // maxZoomLevel={40}
          initialRegion={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled={true}
          zoomTapEnabled={true}
          mapType={'satellite'}
          onPress={e => {
            onMapTap(e);
          }}>
          {selectedArea.map(polyline => (
            <>
              <Marker coordinate={findPolygonCenter(selectedArea)}>
                <Text1 style={{color: theme.colors.warningYellow}}>
                  {selectedAreaName}
                </Text1>
              </Marker>
              <Polygon
                coordinates={selectedArea}
                strokeColor={theme.colors.warningYellow}
                strokeWidth={1}
              />
            </>
          ))}

          {editing.map(polyline => (
            <Polygon
              coordinates={editing}
              fillColor={rgba(theme.colors.primary, 0.08)}
              lineCap="butt"
              strokeWidth={2}
            />
          ))}

          {editing.map(polyline => (
            <Polyline
              coordinates={editing}
              strokeColor={theme.colors.blue[80]}
              strokeWidth={2}
            />
          ))}
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
          />
        </MapView>
        {isActiveDraw && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 20,
              right: 20,
            }}>
            <OutlineButton
              onPress={() => {
                handleClear();
              }}
              style={{marginRight: 10}}>
              {'Clear'}
            </OutlineButton>
            <ContainedButton
              onPress={() => {
                if (editing.length > 0) {
                  toggleModal();
                } else {
                  Alert.alert('Alert', 'No Area Selected yet');
                }
              }}>
              {'Finish'}
            </ContainedButton>
          </View>
        )}
        <RBSheet
          ref={refRBSheet2}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={savedArea.length == 0 ? 200 : 300}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <ListView>
            <OutlineButton
              align="right"
              onPress={() => {
                refRBSheet2.current.close();
                setIsActiveDraw(true);
                setSelectedArea([]);
                setSelectedAreaName('');
              }}>
              {'Create Area'}
            </OutlineButton>
            <Heading>{'List of Areas'}</Heading>
            {savedArea.length == 0 ? (
              <View style={{paddingVertical: 10}}>
                <Text1
                  fontWeight={FontWeights.regular}
                  color={theme.colors.gray50}>
                  {'No areas saved yet'}
                </Text1>
              </View>
            ) : (
              <FlatList
                data={savedArea}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            )}
          </ListView>
        </RBSheet>
        <Modal isVisible={isModalVisible}>
          <ModalView>
            <Ionicons
              name="close"
              color={theme.colors.gray50}
              size={22}
              style={{marginLeft: 'auto', marginBottom: 10}}
              onPress={toggleModal}
            />
            <KeyboardAwareScrollView
              bounces={false}
              scrollEnabled={false}
              keyboardShouldPersistTaps="always">
              <View>
                <Controller
                  name="name"
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      label="Area Name"
                      onChangeText={text => {
                        onChange(text);
                      }}
                      value={value}
                      error={!!errors.name}
                      errorText={errors.name?.message}
                    />
                  )}
                />
                <ContainedButton
                  fullWidth
                  onPress={handleSubmit(handleSave)}
                  style={{marginTop: 20}}>
                  {'Save'}
                </ContainedButton>
              </View>
            </KeyboardAwareScrollView>
          </ModalView>
        </Modal>
      </MainView>
    </>
  );
};

export default connect(() => ({}), {
  setLoginResponse,
})(Home);
