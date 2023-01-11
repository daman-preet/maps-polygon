import { useState, useCallback } from 'react';
import constate from 'constate';
import { useQueryClient } from 'react-query';

import { useOnlineManagerContext } from './useOnlineManager';
import { useAppStoreContext } from './useAppStore';
import { useInterval } from './useInterval';
import useError from './useError';
import { createLead } from '../queries/jobs';
import { uploadDocument } from '../queries/jobDocs';
import {
  uploadPhoto,
  UploadSTatusTypes,
  AppStoreReducerActionTypes,
  AppQueueActionTypes,
} from '../utils/store';

const useAppQueue = () => {
  const { isOnline } = useOnlineManagerContext();
  const { store, dispatch } = useAppStoreContext();
  const { getErrorMessage } = useError();
  const queryClient = useQueryClient();

  const [queuedTask, setQueuedTask] = useState(0);

  const uploadNewLead = useCallback(
    async (uploadTask: any) => {
      try {
        dispatch({
          type: AppStoreReducerActionTypes.UpdateNewJob,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Uploading,
          },
        });
        const uploadedJobInfo = await createLead(uploadTask?.requestPayload);
        console.log('>>>>>', uploadedJobInfo);
        // queryClient.setQueryData('recentJobs', (oldData: any) => [
        //   uploadedJobInfo,
        //   ...oldData,
        // ]);
        dispatch({
          type: AppStoreReducerActionTypes.RemoveFromNewJob,
          payload: {
            id: uploadTask?.id,
          },
        });
      } catch (err) {
        console.log('error on uploading New Lead', err);
        dispatch({
          type: AppStoreReducerActionTypes.UpdateNewJob,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Error,
            errorMessage: getErrorMessage(err),
          },
        });
      } finally {
        setQueuedTask((p) => p - 1);
      }
    },
    [queryClient, dispatch, getErrorMessage],
  );

  const uploadJobPhoto = useCallback(
    async (uploadTask: any) => {
      try {
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobPhotos,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Uploading,
          },
        });

        const uploadedPhotoInfo = await uploadPhoto({
          type: AppQueueActionTypes.UploadJobPhoto,
          payload: {
            job: uploadTask?.requestParams?.job,
            name: uploadTask?.requestPayload?.name,
            tags: uploadTask?.requestPayload?.tags || [],
            description: uploadTask?.requestPayload?.description || '',
            exif: uploadTask?.requestPayload?.exif || {},
            is_video: false,
          },
          photoInfo: {
            uri: uploadTask?.requestPayload?.path,
            name: uploadTask?.requestPayload?.name,
            type: uploadTask?.requestPayload?.imageType || 'image/jpeg',
          },
        });

        queryClient.setQueryData(
          ['jobs', `${uploadTask?.requestParams?.job}`, 'photoGallery'],
          (oldData: any) => ({
            pages: [
              {
                ...oldData?.pages[0],
                results: [uploadedPhotoInfo, ...oldData?.pages[0]?.results],
              },
            ],
            pageParams: oldData.pageParams?.slice(0, 1),
          }),
        );
        dispatch({
          type: AppStoreReducerActionTypes.RemoveFromJobPhotos,
          payload: {
            id: uploadTask?.id,
          },
        });
      } catch (err) {
        console.log('error on uploading Job photo', err);
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobPhotos,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Error,
            errorMessage: getErrorMessage(err),
          },
        });
      } finally {
        setQueuedTask((p) => p - 1);
      }
    },
    [queryClient, dispatch, getErrorMessage],
  );

  const uploadJobDocument = useCallback(
    async (uploadTask: any) => {
      try {
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobDocs,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Uploading,
          },
        });

        const uploadedDocInfo = await uploadDocument({
          payload: {
            job: uploadTask?.requestParams?.job,
            name: uploadTask?.requestPayload?.name,
            tags: uploadTask?.requestPayload?.tags || [],
            doc: {
              uri: uploadTask?.requestPayload?.uri,
              name: uploadTask?.requestPayload?.name,
              type: uploadTask?.requestPayload?.type || 'image/jpeg',
            },
          },
        });

        dispatch({
          type: AppStoreReducerActionTypes.RemoveFromJobDocs,
          payload: {
            id: uploadTask?.id,
          },
        });
        queryClient.setQueryData(
          ['jobs', `${uploadTask?.requestParams?.job}`, 'jobDocuments'],
          (oldData: any) => ({
            pages: [
              {
                ...oldData?.pages[0],
                results: [uploadedDocInfo, ...oldData?.pages[0]?.results],
              },
            ],
            pageParams: oldData.pageParams?.slice(0, 1),
          }),
        );
      } catch (err) {
        console.log('error on uploading Job doc', err);
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobDocs,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Error,
            errorMessage: getErrorMessage(err),
          },
        });
      } finally {
        setQueuedTask((p) => p - 1);
      }
    },
    [queryClient, dispatch, getErrorMessage],
  );

  const uploadJobInspectionPhoto = useCallback(
    async (uploadTask: any) => {
      try {
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobInspectionPhotos,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Uploading,
          },
        });

        await uploadPhoto({
          type: AppQueueActionTypes.UploadJobInspectionPhoto,
          payload: {
            job_inspection_lineitems:
              uploadTask?.requestParams?.job_inspection_lineitems,
            name: uploadTask?.requestPayload?.name,
            tags: uploadTask?.requestPayload?.tags || [],
            description: uploadTask?.requestPayload?.description || '',
            exif: uploadTask?.requestPayload?.exif || {},
            is_video: false,
          },
          photoInfo: {
            uri: uploadTask?.requestPayload?.path,
            name: uploadTask?.requestPayload?.name,
            type: uploadTask?.requestPayload?.imageType || 'image/jpeg',
          },
        });

        // queryClient.setQueryData(
        //   ['jobs', `${uploadTask?.requestParams?.job}`, 'photoGallery'],
        //   (oldData: any) => ({
        //     pages: [
        //       {
        //         ...oldData?.pages[0],
        //         results: [uploadedPhotoInfo, ...oldData?.pages[0]?.results],
        //       },
        //     ],
        //     pageParams: oldData.pageParams?.slice(0, 1),
        //   }),
        // );
        dispatch({
          type: AppStoreReducerActionTypes.RemoveFromJobInspectionPhotos,
          payload: {
            id: uploadTask?.id,
          },
        });
      } catch (err) {
        console.log('error on uploading Job photo', err);
        dispatch({
          type: AppStoreReducerActionTypes.UpdateJobInspectionPhotos,
          payload: {
            id: uploadTask?.id,
            status: UploadSTatusTypes.Error,
            errorMessage: getErrorMessage(err),
          },
        });
      } finally {
        setQueuedTask((p) => p - 1);
      }
    },
    [dispatch, getErrorMessage],
  );

  const insertNewTaskToQueue = () => {
    const queuedNewJobs =
      store?.new_jobs.filter((datum: any) => {
        return datum?.status === UploadSTatusTypes.Queued;
      }) || [];
    const uploadingNewJob = queuedNewJobs[0];
    if (uploadingNewJob) {
      setQueuedTask((p) => p + 1);
      uploadNewLead(uploadingNewJob);
    } else {
      const queuedJobPhotos =
        store?.job_photos.filter((datum: any) => {
          return datum?.status === UploadSTatusTypes.Queued;
        }) || [];
      const uploadingJobPhoto = queuedJobPhotos[0];
      if (uploadingJobPhoto) {
        setQueuedTask((p) => p + 1);
        uploadJobPhoto(uploadingJobPhoto);
      } else {
        const queuedJobDocs =
          store?.job_docs.filter((datum: any) => {
            return datum?.status === UploadSTatusTypes.Queued;
          }) || [];
        const uploadingJobDoc = queuedJobDocs[0];
        if (uploadingJobDoc) {
          setQueuedTask((p) => p + 1);
          uploadJobDocument(uploadingJobDoc);
        } else {
          const queuedJobInspectionPhotos =
            store?.job_inspection_photos.filter((datum: any) => {
              return datum?.status === UploadSTatusTypes.Queued;
            }) || [];
          const uploadingInspectionPhoto = queuedJobInspectionPhotos[0];
          if (uploadingInspectionPhoto) {
            setQueuedTask((p) => p + 1);
            uploadJobInspectionPhoto(uploadingInspectionPhoto);
          }
        }
      }
    }
  };

  const processQueue = () => {
    if (isOnline && queuedTask < 4) {
      insertNewTaskToQueue();
    }
  };

  useInterval(processQueue, 5 * 1000);

  return {
    queuedTask,
    uploadJobPhoto,
    uploadJobDocument,
    uploadJobInspectionPhoto,
  };
};

export const [AppQueueProvider, useAppQueueContext] = constate(useAppQueue);
