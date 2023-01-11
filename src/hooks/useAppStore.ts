import { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import constate from 'constate';
import { isArray } from 'lodash';
import uuid from 'react-native-uuid';

import { APP_STORE_KEY } from '../utils/constants';
import { storeData, getData } from '../utils/localStorage';
import {
  AppStoreReducerActionTypes,
  AppQueueActionTypes,
  UploadSTatusTypes,
} from '../utils/store';

const initialStoreState = {
  new_jobs: [],
  job_photos: [],
  job_docs: [],
  job_inspection_photos: [],
};

const storeReducer = (
  currentState = initialStoreState as any,
  action: { type: string; payload: any },
) => {
  const { type, payload } = action;

  switch (type) {
    case AppStoreReducerActionTypes.SetStoreState:
      return payload;
    case AppStoreReducerActionTypes.AddToNewJob:
      return { ...currentState, new_jobs: [...currentState.new_jobs, payload] };
    case AppStoreReducerActionTypes.AddToJobPhotos:
      if (isArray(payload)) {
        return {
          ...currentState,
          job_photos: [...currentState.job_photos, ...payload],
        };
      }
      return {
        ...currentState,
        job_photos: [...currentState.job_photos, payload],
      };
    case AppStoreReducerActionTypes.AddToJobDocs:
      if (isArray(payload)) {
        return {
          ...currentState,
          job_docs: [...currentState.job_docs, ...payload],
        };
      }
      return {
        ...currentState,
        job_docs: [...currentState.job_docs, payload],
      };
    case AppStoreReducerActionTypes.AddToJobInspectionPhotos:
      if (isArray(payload)) {
        return {
          ...currentState,
          job_inspection_photos: [
            ...currentState.job_inspection_photos,
            ...payload,
          ],
        };
      }
      return {
        ...currentState,
        job_inspection_photos: [...currentState.job_inspection_photos, payload],
      };
    case AppStoreReducerActionTypes.UpdateNewJob:
      return {
        ...currentState,
        new_jobs: currentState.new_jobs.map((job: any) => {
          if (job?.id === payload?.id) {
            return {
              ...job,
              ...payload,
            };
          }
          return job;
        }),
      };
    case AppStoreReducerActionTypes.RemoveFromNewJob:
      return {
        ...currentState,
        new_jobs: currentState.new_jobs.filter((job: any) => {
          return job?.id !== payload?.id;
        }),
      };
    case AppStoreReducerActionTypes.UpdateJobPhotos:
      return {
        ...currentState,
        job_photos: currentState.job_photos.map((photo: any) => {
          if (photo?.id === payload?.id) {
            return {
              ...photo,
              ...payload,
            };
          }
          return photo;
        }),
      };
    case AppStoreReducerActionTypes.RemoveFromJobPhotos:
      return {
        ...currentState,
        job_photos: currentState.job_photos.filter((photo: any) => {
          return photo?.id !== payload?.id;
        }),
      };
    case AppStoreReducerActionTypes.UpdateJobDocs:
      return {
        ...currentState,
        job_docs: currentState.job_docs.map((doc: any) => {
          if (doc?.id === payload?.id) {
            return {
              ...doc,
              ...payload,
            };
          }
          return doc;
        }),
      };
    case AppStoreReducerActionTypes.RemoveFromJobDocs:
      return {
        ...currentState,
        job_docs: currentState.job_docs.filter((doc: any) => {
          return doc?.id !== payload?.id;
        }),
      };
    case AppStoreReducerActionTypes.UpdateJobInspectionPhotos:
      return {
        ...currentState,
        job_inspection_photos: currentState.job_inspection_photos.map(
          (photo: any) => {
            if (photo?.id === payload?.id) {
              return {
                ...photo,
                ...payload,
              };
            }
            return photo;
          },
        ),
      };
    case AppStoreReducerActionTypes.RemoveFromJobInspectionPhotos:
      return {
        ...currentState,
        job_inspection_photos: currentState.job_inspection_photos.filter(
          (photo: any) => {
            return photo?.id !== payload?.id;
          },
        ),
      };
    case AppStoreReducerActionTypes.ResetQueueStatus:
      return {
        ...currentState,
        new_jobs: currentState.new_jobs.map((job: any) => ({
          ...job,
          status: 'Queued',
        })),
        job_photos:
          currentState?.job_photos?.map((photo: any) => ({
            ...photo,
            status: 'Queued',
          })) ?? [],
        job_docs:
          currentState?.job_docs?.map((doc: any) => ({
            ...doc,
            status: 'Queued',
          })) ?? [],
        job_inspection_photos:
          currentState?.job_inspection_photos?.map((photo: any) => ({
            ...photo,
            status: 'Queued',
          })) ?? [],
      };
    default:
      throw new Error('action type does not exist for store reducer');
  }
};

const useAppStore = () => {
  const [mappedKeyObj, setMappedKeyObj] = useState({});
  const [store, dispatch] = useReducer(storeReducer, initialStoreState);

  const didMount = useRef(true);

  const loadMappedKeys = useCallback(async () => {
    try {
      const savedMappedKeyObj = await getData('@mapped_keys');
      setMappedKeyObj(savedMappedKeyObj || {});
    } catch (err) {
      console.log('error on loading saved mapped keys', err);
    }
  }, []);

  const loadStoreData = useCallback(async () => {
    try {
      const storedData = await getData(APP_STORE_KEY);
      dispatch({
        type: AppStoreReducerActionTypes.SetStoreState,
        payload: storedData || initialStoreState,
      });
      setTimeout(() => {
        dispatch({
          type: AppStoreReducerActionTypes.ResetQueueStatus,
          payload: {},
        });
      }, 300);
    } catch (err) {
      console.log('error on loading store data', err);
    }
  }, []);

  useEffect(() => {
    loadMappedKeys();
    loadStoreData();
  }, [loadMappedKeys, loadStoreData]);

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
    } else {
      storeData(APP_STORE_KEY, store);
    }
  }, [store]);

  const saveToAppStore = (params: any, payload: any) => {
    if (params.actionType === AppQueueActionTypes.CreateJob) {
      const modifiedPayload = {
        id: payload.id,
        requestParams: params,
        requestPayload: payload,
        status: UploadSTatusTypes.Queued,
        errorMessage: '',
      };
      dispatch({
        type: AppStoreReducerActionTypes.AddToNewJob,
        payload: modifiedPayload,
      });
    } else if (params.actionType === AppQueueActionTypes.UploadJobPhoto) {
      let modifiedPayload;
      if (isArray(payload)) {
        modifiedPayload = payload.map((datum) => ({
          id: uuid.v4(),
          requestParams: params,
          requestPayload: datum,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        }));
      } else {
        modifiedPayload = {
          id: uuid.v4(),
          requestParams: params,
          requestPayload: payload,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        };
      }
      dispatch({
        type: AppStoreReducerActionTypes.AddToJobPhotos,
        payload: modifiedPayload,
      });
    } else if (params.actionType === AppQueueActionTypes.UploadJobDoc) {
      let modifiedPayload;
      if (isArray(payload)) {
        modifiedPayload = payload.map((datum) => ({
          id: uuid.v4(),
          requestParams: params,
          requestPayload: datum,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        }));
      } else {
        modifiedPayload = {
          id: uuid.v4(),
          requestParams: params,
          requestPayload: payload,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        };
      }
      dispatch({
        type: AppStoreReducerActionTypes.AddToJobDocs,
        payload: modifiedPayload,
      });
    } else if (
      params.actionType === AppQueueActionTypes.UploadJobInspectionPhoto
    ) {
      let modifiedPayload;
      if (isArray(payload)) {
        modifiedPayload = payload.map((datum) => ({
          id: uuid.v4(),
          requestParams: params,
          requestPayload: datum,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        }));
      } else {
        modifiedPayload = {
          id: uuid.v4(),
          requestParams: params,
          requestPayload: payload,
          status: UploadSTatusTypes.Queued,
          errorMessage: '',
        };
      }
      dispatch({
        type: AppStoreReducerActionTypes.AddToJobInspectionPhotos,
        payload: modifiedPayload,
      });
    }
  };

  return {
    mappedKeyObj,
    store,
    dispatch,
    saveToAppStore,
  };
};

export const [AppStoreProvider, useAppStoreContext] = constate(useAppStore);
