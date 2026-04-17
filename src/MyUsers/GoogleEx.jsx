import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import baseURL from '../../assets/common/BaseUrl';


export const signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (response && response.idToken) {
            console.log("User Info:", response.user);
            
            // Send the idToken to your Node.js backend
            const serverResponse = await axios.post(`${baseURL}auth/google-signin`, { token: response.idToken });

            console.log("Server Response:", serverResponse.data);

            alert(`Signed in as: ${response.user.name}\nEmail: ${response.user.email}`);
        } else {
            console.log("Sign-in cancelled by user");
        }
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        if (error.code) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    console.log("Sign-in is already in progress");
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Play services not available or outdated");
                    break;
                default:
                    console.log("An unknown error occurred during sign-in");
            }
        } else {
            console.log("A non-Google sign-in error occurred");
        }
    }
};
