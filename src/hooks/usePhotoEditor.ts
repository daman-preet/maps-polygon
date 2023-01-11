import { Alert } from 'react-native';
import PhotoEditor from '@baronha/react-native-photo-editor';

type PhotoEditorOnEditProps = {
  imageInfo: any;
  onSuccess?: (arg1: any, arg2?: string) => void;
  onError?: (arg: any) => void;
  showAlert?: boolean;
};

const usePhotoEditor = () => {
  const onEdit = async ({
    imageInfo,
    onSuccess = () => {},
    onError = () => {},
    showAlert = false,
  }: PhotoEditorOnEditProps) => {
    try {
      const path = await PhotoEditor.open({
        path: imageInfo?.uri,
        stickers: [
          'https://cdn-icons-png.flaticon.com/512/271/271226.png',
          'https://cdn-icons-png.flaticon.com/512/545/545680.png',
          'https://cdn-icons-png.flaticon.com/512/892/892493.png',
          'https://cdn-icons-png.flaticon.com/512/8066/8066397.png',
          'https://cdn-icons-png.flaticon.com/512/399/399278.png',
        ],
      });

      const updatedImageInfo = { ...imageInfo, editedImageUri: path };
      if (showAlert) {
        Alert.alert('Rooflink', 'Keep or discard original photo?', [
          {
            text: 'Keep Original',
            onPress: () => {
              console.log('Keep Original Pressed', updatedImageInfo);
              onSuccess(updatedImageInfo, 'keep_original');
            },
            style: 'cancel',
          },
          {
            text: 'Discard Original ',
            onPress: () => {
              console.log('Discard Original Pressed', updatedImageInfo);
              onSuccess(updatedImageInfo, 'discard_original');
            },
          },
        ]);
      } else {
        onSuccess(updatedImageInfo);
      }
    } catch (err) {
      console.log('error on edit photo', err);
      onError(err);
    }
  };

  return {
    onEdit,
  };
};

export default usePhotoEditor;
