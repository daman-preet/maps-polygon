import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './auth/authReducer';
import { LOG_OUT_SUCCESS } from './auth/authActions';

const allReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === LOG_OUT_SUCCESS) {
    state = undefined;
  }

  return allReducer(state, action);
};

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
