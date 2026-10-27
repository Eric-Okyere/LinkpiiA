import baseURL from '../../assets/common/BaseUrl';

export function logout(){
    return async(dispatch)=>{
        try {
             await auth.auth().signOut(),
             dispatch(loggedOut)
        } catch (error) {
            console.log(error)
        }
    }
}
export function loggedIn(user){
    return {
        type:"LOGGED_IN",
        payload:user
    }
}

export function signUp(user){
    return {
        type:"SIGN_IN",
        payload:user
    }
}

export function loggedOut(user){
    return {
        type:"LOGGED_OUT",
        payload:user
    }
}

export function registerError(error){
    return {
        type:"REGISTER_ERROR",
        payload:error
    }
}
export function setUserData(data){
    return {
        type:"SET_USERDATA",
        payload:data
    }
}




// Fetches the business-partner flyer adverts shown in the home carousel
// (GET /advert on the backend - same endpoint the website's Home.jsx uses).
// Dispatches into the existing (previously unused) advertsReducer.
export function fetchAdverts() {
  return async (dispatch) => {
    dispatch({ type: 'ADVERTS_LOADING' });
    try {
      const response = await fetch(`${baseURL}advert`);
      const data = await response.json();
      dispatch({ type: 'ADVERTS_SUCCESS', payload: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('fetchAdverts error:', error);
      dispatch({ type: 'ADVERTS_ERROR', error: error?.message || String(error) });
    }
  };
}
