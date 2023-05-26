import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import auth from './auth';
import teams from './team';
import notifications from './notifications';
import onlineUsers from './onlineUsers';
import users from './users';

const reducer = combineReducers({
  auth,
  teams,
  notifications,
  onlineUsers,
  users
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from './auth';
export * from './team';
export * from './notifications';
export * from './onlineUsers';
export * from './users';
