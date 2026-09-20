// src/Redux/reducers/index.js
import { combineReducers } from 'redux';
import advertsReducer from '../advertsReducer';

const rootReducer = combineReducers({
    adverts: advertsReducer,
    // other reducers can be added here
});

export default rootReducer;
