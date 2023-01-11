import {
  HANDLE_LOGIN,
  HANDLE_LOGIN_SUCCESS,
  HANDLE_LOGIN_ERROR,
  USER_ID,
  LOGGED_IN_SUCCESS,
  LOGIN_RESPONSE_DATA,
} from './authActions';
import get from 'lodash/get';

const initialState = {
  fetchError: false,
  errorMessage: '',
  loginData: {},
  userName: '',
  loggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case HANDLE_LOGIN:
      return {
        ...state,
        loading: true,
        fetchError: false,
        errorMessage: '',
      };
    case HANDLE_LOGIN_SUCCESS:
      return {
        ...state,
        loginData: action.payload,
        loading: false,
        fetchError: false,
        errorMessage: '',
      };
    case HANDLE_LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        fetchError: true,
      };
    case USER_ID:
      return {
        ...state,
        userName: action.payload,
      };
    case LOGGED_IN_SUCCESS:
      return {
        ...state,
        loggedIn: JSON.parse(action.payload),
      };
    case LOGIN_RESPONSE_DATA:
      return {
        ...state,
        loginData: action.payload,
      };
    default:
      return state;
  }
};

// Selectors

// Get Login Response Data
export const getLoginData = state => state.auth.loginData;

// Get is Login response is in progress
export const isLoading = state => state.auth.loading;

// Get Login Error
export const fetchError = state => state.auth.fetchError;

// Get Error Message
export const fetchErrorMessage = state => state.auth.errorMessage;

// Get Temporary User Name
export const getUserName = state => state.auth.userName;

export default authReducer;
