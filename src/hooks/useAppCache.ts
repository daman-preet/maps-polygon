import { useState, useEffect, useCallback } from 'react';
import constate from 'constate';

import { useAuthContext } from './useAuth';
import { useOnlineManagerContext } from './useOnlineManager';
import {
  fetchNewProspectFieldConfig,
  fetchLeadSourceChoices,
  fetchRepChoices,
  fetchAltRepChoices,
  fetchMarketingRepChoices,
  fetchManagementCompanyChoices,
  fetchProjectManagerChoices,
  fetchPreInsuranceReviewerChoices,
  fetchPostInsuranceReviewerChoices,
} from '../queries/addLeadForm';
import apiService from '../utils/apiService';
import { storeData, getData } from '../utils/localStorage';
import {
  getTimestampForDate,
  saveLastCachedAt,
  getLastCachedAt,
} from '../utils/dates';
import {
  LEAD_STATUS_CHOICES_KEY,
  ADD_LEAD_FORM_INFO_KEY,
  CACHE_DATES_KEY,
  INSPECTION_TEMPLATES_KEY,
} from '../utils/constants';

const addLeadFormInfoInitialState = {
  config: {},
  leadSourceChoices: [],
  repChoices: [],
  altRepChoices: [],
  marketingRepChoices: [],
  projectManagerChoices: [],
  managementCompanyChoices: [],
  preInsuranceReviewerChoices: [],
  postInsuranceReviewerChoices: [],
};

const useAppCache = () => {
  const { isOnline } = useOnlineManagerContext();
  const { user } = useAuthContext();

  const [leadStatusChoices, setLeadStatusChoices] = useState<
    LeadStatusChoice[]
  >([]);
  const [addLeadFormInfo, setAddLeadFormInfo] = useState(
    addLeadFormInfoInitialState,
  );
  const [cacheDates, setCacheDates] = useState<any>({});
  const [inspectionTemplates, setInspectionTemplates] = useState([]);

  useEffect(() => {
    storeData(ADD_LEAD_FORM_INFO_KEY, addLeadFormInfo);
  }, [addLeadFormInfo]);

  useEffect(() => {
    storeData(CACHE_DATES_KEY, cacheDates);
  }, [cacheDates]);

  useEffect(() => {
    storeData(INSPECTION_TEMPLATES_KEY, inspectionTemplates);
  }, [inspectionTemplates]);

  const loadStoredLeadStatus = async () => {
    try {
      const leadChoices = await getData(LEAD_STATUS_CHOICES_KEY);
      setLeadStatusChoices(leadChoices || []);
    } catch (err) {
      console.log('error on load stored leadStatusChoices', err);
    }
  };

  const loadStoredAddLeadFormInfo = async () => {
    try {
      const addLeadFormData = await getData(ADD_LEAD_FORM_INFO_KEY);
      setAddLeadFormInfo(addLeadFormData || addLeadFormInfoInitialState);
    } catch (err) {
      console.log('error on load stored leadStatusChoices', err);
    }
  };

  const loadStoredCacheDates = async () => {
    try {
      const storedCacheDates = await getData(CACHE_DATES_KEY);
      setLeadStatusChoices(storedCacheDates || {});
    } catch (err) {
      console.log('error on load stored cache dates', err);
    }
  };

  const loadStoredInspectionTemplates = async () => {
    try {
      const storedInspectionTemplates = await getData(INSPECTION_TEMPLATES_KEY);
      setLeadStatusChoices(storedInspectionTemplates || []);
    } catch (err) {
      console.log('error on load stored inspection templates', err);
    }
  };

  const fetchLeadStatusChoices = async () => {
    if (isOnline) {
      try {
        const { data } = await apiService.get('/api/company-leadstatus/');
        const leadChoices = data && Array.isArray(data) ? data : [];
        setLeadStatusChoices(leadChoices);
        storeData(LEAD_STATUS_CHOICES_KEY, leadChoices);
      } catch (err) {
        console.log('error on fetch lead status choices', err);
      }
    }
  };

  const fetchAddLeadFormConfig = async () => {
    if (isOnline) {
      try {
        const data = await fetchNewProspectFieldConfig();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          config: data,
        }));
      } catch (err) {
        console.log('error on add lead form config fetch', err);
      }
    }
  };

  const fetchAddLeadFormSources = async () => {
    if (isOnline) {
      try {
        const data = await fetchLeadSourceChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          leadSourceChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form sources fetch', err);
      }
    }
  };

  const fetchAddLeadFormReps = async () => {
    if (isOnline) {
      try {
        const data = await fetchRepChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          repChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form Rep fetch', err);
      }
    }
  };

  const fetchAddLeadFormAltReps = async () => {
    if (isOnline) {
      try {
        const data = await fetchAltRepChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          altRepChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form alt_rep fetch', err);
      }
    }
  };

  const fetchAddLeadFormMarketingReps = async () => {
    if (isOnline) {
      try {
        const data = await fetchMarketingRepChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          marketingRepChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form marketing_rep fetch', err);
      }
    }
  };

  const fetchAddLeadFormProjectManagers = async () => {
    if (isOnline) {
      try {
        const data = await fetchProjectManagerChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          projectManagerChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form project_manager fetch', err);
      }
    }
  };

  const fetchAddLeadFormManagementCompanies = async () => {
    if (isOnline) {
      try {
        const data = await fetchManagementCompanyChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          managementCompanyChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form management_company fetch', err);
      }
    }
  };

  const fetchAddLeadFormPreInsuranceReviewers = async () => {
    if (isOnline) {
      try {
        const data = await fetchPreInsuranceReviewerChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          preInsuranceReviewerChoices: data,
        }));
      } catch (err) {
        console.log('error on add lead form pre_insurance_reviewer fetch', err);
      }
    }
  };

  const fetchAddLeadFormPostInsuranceReviewers = async () => {
    if (isOnline) {
      try {
        const data = await fetchPostInsuranceReviewerChoices();
        setAddLeadFormInfo((prevState) => ({
          ...prevState,
          postInsuranceReviewerChoices: data,
        }));
      } catch (err) {
        console.log(
          'error on add lead form post_insurance_reviewer fetch',
          err,
        );
      }
    }
  };

  const fetchOfflineCompanyResources = async () => {
    if (isOnline) {
      try {
        const { data } = await apiService.get(
          '/api/light/company-resources/offline/',
        );
        setCacheDates(data?.cache_dates || {});
        setInspectionTemplates(data?.inspection_templates || []);
      } catch (err) {
        console.log('error in fetch offline company resources', err);
      }
    }
  };

  const loadAppCache = useCallback(async () => {
    const leadStatusLastEditedAt = getTimestampForDate(
      cacheDates?.date_lead_statuses_last_edited ?? '',
    );
    const employeesLastEditedAt = getTimestampForDate(
      cacheDates?.date_employees_last_edited,
    );
    const leadSourcesLastEditedAt = getTimestampForDate(
      cacheDates?.date_lead_sources_last_edited,
    );
    const inspectionTemplatesLastEditedAt = getTimestampForDate(
      cacheDates?.date_inspection_templates_last_edited,
    );
    const photoTagsLastEditedAt = getTimestampForDate(
      cacheDates?.date_photo_tags_last_edited,
    );
    const lastCachedAt = await getLastCachedAt();

    const shouldfetchLeadStatusChoices = leadStatusLastEditedAt > lastCachedAt;
    if (shouldfetchLeadStatusChoices) {
      fetchLeadStatusChoices();
    }

    const shouldFetchAddLeadFormInfo =
      employeesLastEditedAt > lastCachedAt ||
      leadSourcesLastEditedAt > lastCachedAt;
    if (shouldFetchAddLeadFormInfo) {
      // fetchAddLeadFormConfig();
      // fetchAddLeadFormSources();
      // fetchAddLeadFormReps();
      // fetchAddLeadFormAltReps();
      // fetchAddLeadFormMarketingReps();
      // fetchAddLeadFormProjectManagers();
      // fetchAddLeadFormManagementCompanies();
      // fetchAddLeadFormPreInsuranceReviewers();
      // fetchAddLeadFormPostInsuranceReviewers();
    }

    const shouldFetchCompanyResources =
      inspectionTemplatesLastEditedAt > lastCachedAt ||
      photoTagsLastEditedAt > lastCachedAt;
    if (shouldFetchCompanyResources) {
      // fetchOfflineCompanyResources();
    }

    const isAnyCacheUpdated =
      shouldfetchLeadStatusChoices ||
      shouldFetchAddLeadFormInfo ||
      shouldFetchCompanyResources;
    if (isAnyCacheUpdated) {
      saveLastCachedAt();
    }
  }, [cacheDates]);

  useEffect(() => {
    loadStoredLeadStatus();
    loadStoredAddLeadFormInfo();
    loadStoredCacheDates();
    loadStoredInspectionTemplates();

    console.log('changed', isOnline);
    if (isOnline) {
      fetchAddLeadFormConfig();
      fetchAddLeadFormSources();
      fetchAddLeadFormReps();
      fetchAddLeadFormAltReps();
      fetchAddLeadFormMarketingReps();
      fetchAddLeadFormProjectManagers();
      fetchAddLeadFormManagementCompanies();
      fetchAddLeadFormPreInsuranceReviewers();
      fetchAddLeadFormPostInsuranceReviewers();

      fetchOfflineCompanyResources();

      loadAppCache();
    }
  }, [isOnline]);

  useEffect(() => {
    fetchAddLeadFormConfig();
    fetchAddLeadFormSources();
    fetchAddLeadFormReps();
    fetchAddLeadFormAltReps();
    fetchAddLeadFormMarketingReps();
    fetchAddLeadFormProjectManagers();
    fetchAddLeadFormManagementCompanies();
    fetchAddLeadFormPreInsuranceReviewers();
    fetchAddLeadFormPostInsuranceReviewers();
  }, [user?.auto_set_customer_region]);

  return {
    leadStatusChoices,
    addLeadFormInfo,
  };
};

export const [AppCacheProvider, useAppCacheContext] = constate(useAppCache);
