import { applyMiddleware, legacy_createStore as createStore} from "redux";
import reducers from "./reducers";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import thunk from "redux-thunk";


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  }

const persistedReducer = persistReducer(persistConfig, reducers)

// thunk was imported but never actually applied, so any async (thunk) action
// - including the new fetchAdverts() below, and the pre-existing logout()
// action in actions.js - would throw "Actions must be plain objects" the
// moment it was dispatched. Wiring it in here so thunk actions actually work.
let store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)

export default store
