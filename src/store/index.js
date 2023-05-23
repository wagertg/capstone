import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import auth from './auth';
import teams from './team';
import notifications from './notifications';

const reducer = combineReducers({
  auth,
  teams,
  notifications
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from './auth';
export * from './team';
export * from './notifications';
