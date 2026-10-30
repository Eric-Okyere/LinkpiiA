import axios from "axios"
import baseURL from "../../assets/common/BaseUrl"



const catchError = error =>{
    if(error?.response?.data) {
        return error.response.data
    } 
    else  if(message?.response?.data)
    
    {
        message.response.data
    }

    return { success: false, error: error.message }
}


export const signup = async values =>{
    try {
        const {data} = await axios.post(`${baseURL}create-user`, {...values})
        return data
    
     } catch (error) {
       return catchError(error)
     }
}

export const signin = async( values) =>{
    //  const dispatch= useDispatch()

    try {
        const {data} = await axios.post(`${baseURL}sign-in`, {...values})
       //  dispatch(loggedIn(data))
        return data
    
     } catch (error) {
       return catchError(error)
     }
}

export const verifyEmailCode = async (email, code) =>{
    try {
        const {data} = await axios.post(`${baseURL}verify-email-code`, {email, code})
        return data

     } catch (error) {
       return catchError(error)
     }
}

export const resendVerificationCode = async email =>{
    try {
        const {data} = await axios.post(`${baseURL}resend-verification-code`, {email})
        return data

     } catch (error) {
       return catchError(error)
     }
}

export const verifyLoginCode = async (email, code) =>{
    try {
        const {data} = await axios.post(`${baseURL}verify-login-code`, {email, code})
        return data

     } catch (error) {
       return catchError(error)
     }
}

export const resendLoginCode = async email =>{
    try {
        const {data} = await axios.post(`${baseURL}resend-login-code`, {email})
        return data

     } catch (error) {
       return catchError(error)
     }
}

export const forgetPassword = async email =>{
    try {
        const {data} = await axios.post(`${baseURL}forgot-password`, {email})
        return data
    
     } catch (error) {
       return catchError(error)
     }
}

export const updateNotification = (updater, text, type="error") =>{
    updater({text, type});
    setTimeout(() => {
        updater({text:"", type:""})
    }, 5000);
}
