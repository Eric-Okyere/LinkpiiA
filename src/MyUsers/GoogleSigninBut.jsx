import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import baseURL from '../../assets/common/BaseUrl';
import GoogleLogo from '../../assets/Google.png';

/**
 * "Sign in with Google" button for the login screen.
 *
 * Uses the native @react-native-google-signin/google-signin module (talks
 * to Google Play Services directly), NOT expo-auth-session's Google
 * provider - that was the earlier approach in this file and in the now-
 * removed GoogleLoginButton.jsx, abandoned because its Android flow is
 * unreliable about actually returning an idToken. The native module needs
 * a custom dev client / native build to run - it will not work inside
 * Expo Go.
 *
 * On success, it posts the Google idToken to the backend's
 * `auth/google-signin` endpoint (controllers/user.js -> googleSignIn),
 * which verifies the token with Google, creates the account on first
 * sign-in or logs the existing one in, and returns our own app user +
 * JWT - exactly like the email/password flow - then calls
 * `onLoginSuccess(user, token)` the same way Signin.jsx's
 * handleGoogleLoginSuccess already expects.
 */
const GoogleSigninBut = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        // User closed the account picker - not an error, just stop.
        return;
      }

      const idToken = response.data?.idToken;
      if (!idToken) {
        Alert.alert(
          'Sign-In Error',
          'Google did not return a sign-in token. Please try again.'
        );
        return;
      }

      const res = await fetch(`${baseURL}auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken, agreeToTerms: true }),
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user, data.token);
      } else {
        Alert.alert(
          'Login Failed',
          data.message || 'Google sign-in failed. Please try again.'
        );
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            break; // user backed out of the picker
          case statusCodes.IN_PROGRESS:
            break; // a sign-in is already in flight, ignore this tap
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              'Google Play Services Required',
              'Please update Google Play Services and try again.'
            );
            break;
          default:
            console.error('Google Sign-In error:', error);
            Alert.alert(
              'Sign-In Error',
              'Something went wrong signing in with Google.'
            );
        }
      } else {
        console.error('Google Sign-In error:', error);
        Alert.alert(
          'Sign-In Error',
          'Something went wrong signing in with Google.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#1a1a1a" />
      ) : (
        <>
          <Image source={GoogleLogo} style={styles.logo} />
          <Text style={styles.text}>Sign in with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 230,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default GoogleSigninBut;
