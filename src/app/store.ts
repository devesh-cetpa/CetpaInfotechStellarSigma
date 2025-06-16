import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';

import userReducer from '../features/user/userSlice';
import eventReducer from '../features/events/eventsSlice';
import appartmentReducer from '../features/appartment/appartmentSlice';
import monthlyReducer from '../features/monthly/monthlySlice';
const sessionPersistConfig = {
  key: 'root',
  storage: sessionStorage, 
  whitelist: ['event', 'user', 'appartment','monthly'], 
};

const rootReducer = combineReducers({
  event:eventReducer,
  user: userReducer,
  appartment:appartmentReducer,
  monthly:monthlyReducer
});

const persistedReducer = persistReducer(sessionPersistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

// Export the store and persistor
export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
