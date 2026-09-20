const initialState={
    login:false,
    signup:false,
    user:'',
    token: null, 
    error:{},
    userData: { name: "", email: '', lastname: "" }
}


export default (state=initialState, action)=>{
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
