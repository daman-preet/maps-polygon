import get from 'lodash/get';

// Login
export const HANDLE_LOGIN = 'HANDLE_LOGIN';
export const HANDLE_LOGIN_SUCCESS = 'HANDLE_LOGIN_SUCCESS';
export const HANDLE_LOGIN_ERROR = 'HANDLE_LOGIN_ERROR';

// Temporary UserName
export const USER_ID = 'USER_ID';

// User LoggedIn Successful
export const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';

// Login Response
export const LOGIN_RESPONSE_DATA = 'LOGIN_RESPONSE_DATA';

// Log Out
export const LOG_OUT = 'LOG_OUT';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_ERROR = 'LOG_OUT_ERROR';

// Redux Action to Set UserName on redux store
export const setUsername = item => ({
  type: USER_ID,
  payload: item,
});

// Redux Action to store User Logged in response Data
export const setLoginResponse = item => ({
  type: LOGIN_RESPONSE_DATA,
  payload: item,
});
