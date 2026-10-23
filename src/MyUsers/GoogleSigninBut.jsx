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
  GoogleAuth,
  isErrorWithCode,
  GoogleAuthErrorCodes,
} from 'react-native-google-auth';
import baseURL from '../../assets/common/BaseUrl';
import GoogleLogo from '../../assets/Google.png';

/**
 * "Sign in with Google" button for the login screen.
 *
 * Uses the native `react-native-google-auth` module, which talks to
 * Android's Credential Manager / One Tap API directly. This replaced
 * `@react-native-google-signin/google-signin` (and, before that,
 * expo-auth-session's browser-based Google provider in the now-removed
 * GoogleLoginButton.jsx): the old google-signin module relies on Google's
 * legacy native Sign-In API, which Google has been actively deprecating -
 * that was the root cause of the persistent `12500 SIGN_IN_FAILED` error
 * seen on multiple real and emulated devices even with a verified-correct
 * Android OAuth client (package name + SHA-1). This module needs a custom
 * dev client / native build to run - it will not work inside Expo Go.
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
      const response = await GoogleAuth.signIn();

      if (response.type === 'cancelled') {
        // User closed the account picker - not an error, just stop.
        return;
      }

      if (response.type === 'noSavedCredentialFound') {
        Alert.alert(
          'No Google Account Found',
          'Add a Google account to this device, then try again.'
        );
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
          case GoogleAuthErrorCodes.SIGN_IN_CANCELLED:
            break; // user backed out of the picker
          case GoogleAuthErrorCodes.IN_PROGRESS:
            break; // a sign-in is already in flight, ignore this tap
          case GoogleAuthErrorCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              'Google Play Services Required',
              'Please update Google Play Services and try again.'
            );
            break;
          default:
            console.error('Google Sign-In error:', error.code, error.message, error);
            Alert.alert(
              'Sign-In Error',
              `Something went wrong signing in with Google.\n\ncode: ${error.code}\n${error.message || ''}`
            );
        }
      } else {
        console.error('Google Sign-In error (no code):', error);
        Alert.alert(
          'Sign-In Error',
          `Something went wrong signing in with Google.\n\n${error?.message || String(error)}`
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
