
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


