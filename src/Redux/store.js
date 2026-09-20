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

let store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default store