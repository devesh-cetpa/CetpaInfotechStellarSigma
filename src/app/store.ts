import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import localStorage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import employeeReducer from '../features/employee/employeeSlice';
import userReducer from '../features/user/userSlice';

const sessionPersistConfig = {
  key: 'root',
  storage: sessionStorage, // Use session storage for most reducers
  whitelist: ['employee', 'user', 'units'], // Persist these slices
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(sessionPersistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

// Export the store and persistor
export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
