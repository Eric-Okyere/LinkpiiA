import advertsReducer from './advertsReducer';

const initialState={
    login:false,
    signup:false,
    user:'',
    token: null, 
    error:{},
    userData: { name: "", email: '', lastname: "" }
}


const userReducer = (state=initialState, action)=>{
    switch(action.type){
        case "LOGGED_IN":
            return { ...state, login: true, user: action.payload, token: action.payload.token }; 
        case "SIGN_IN":
            return { ...state, signup: true,  user: action.payload, token: action.payload.token  };
        case "LOGGED_OUT":
            return { ...state, login: false, user: '', token: null };
                break
                case "REGISTER_ERROR":
                    return{...state, error:{register:action.payload}}
       break
                    case "LOGIN_ERROR":
                        return{...state, error:{login:action.payload}}
           break;
                    case "SET_USERDATA":
                        return{...state, userData:action.payload}
           
                    default:
            return state;
    }
}


// This file's default export used to BE the store's root reducer (a single
// flat function handling login/signup/user/token/error/userData directly on
// top-level state). HomeCarousel.jsx later started reading `state.adverts`,
// backed by a second root reducer (src/Redux/reducers/index.js, combining
// just `adverts` via combineReducers) that was never actually wired up -
// store.js's `import reducers from "./reducers"` resolves this flat file
// (reducers.js) ahead of the same-named reducers/ directory under Node's
// module resolution, so that second file was dead code the whole time and
// `state.adverts` was always undefined, crashing HomeCarousel's
// `const { items } = useSelector(state => state.adverts)` on render.
// Combining the two here manually (not with redux's combineReducers, which
// would nest this file's existing flat shape under its own key and break
// every `state.user`/`state.login`/etc read across the app) keeps the
// existing top-level shape unchanged and adds `adverts` alongside it.
const rootReducer = (state, action) => {
    // state is `undefined` on the very first call (redux's @@INIT action) -
    // pass `undefined` through to each slice reducer in that case too, not
    // `{}`, so their own `state = initialState` default parameters actually
    // trigger. Destructuring `undefined || {}` would otherwise hand
    // userReducer an empty object instead of `undefined`, which does NOT
    // trigger its default parameter (only a literal `undefined` argument
    // does) - silently dropping the whole login/signup/user/token/error/
    // userData initial shape on startup.
    if (!state) {
        return {
            ...userReducer(undefined, action),
            adverts: advertsReducer(undefined, action),
        };
    }
    const { adverts, ...userState } = state;
    return {
        ...userReducer(userState, action),
        adverts: advertsReducer(adverts, action),
    };
};

export default rootReducer;
